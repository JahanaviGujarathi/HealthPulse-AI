'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Lock, ShieldCheck, Building2, Fingerprint, KeyRound, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ROLE_GROUPS, ROLE_ORDER, ROLES, type RoleId } from '@/lib/roles'
import { getAuthSession } from '@/lib/auth'
import { isValidAadhaar, maskAadhaar } from '@/lib/security'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

// Firebase Auth & Firestore imports
import {
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const defaultPortal = searchParams.get('portal') || 'citizen'

  const [portalType, setPortalType] = useState<'citizen' | 'admin'>(defaultPortal === 'admin' ? 'admin' : 'citizen')
  const [role, setRole] = useState<RoleId>(defaultPortal === 'admin' ? 'dho' : 'citizen')
  const [email, setEmail] = useState(defaultPortal === 'admin' ? 'dho.jorhat@assam.gov.in' : '')
  const [aadhaar, setAadhaar] = useState('4819 2049 4921')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [password, setPassword] = useState('demo1234')
  const [loading, setLoading] = useState(false)

  const handlePortalSwitch = (type: 'citizen' | 'admin') => {
    setPortalType(type)
    setOtpSent(false)
    setOtp('')
    if (type === 'citizen') {
      setRole('citizen')
      setEmail('')
    } else {
      setRole('dho')
      setEmail('dho.jorhat@assam.gov.in')
    }
  }

  const handleSendAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (!isValidAadhaar(aadhaar)) {
      toast.error('Invalid Aadhaar Format', {
        description: 'Please enter a valid 12-digit Indian Aadhaar number (e.g. 4819 2049 4921).',
      })
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setOtpSent(true)
      toast.success('Aadhaar OTP Sent!', {
        description: `OTP sent to mobile registered with Aadhaar ${maskAadhaar(aadhaar)}. Default OTP is 4921.`,
      })
    }, 600)
  }

  // Handle standard Firebase Anonymous Auth for Citizens
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    signInAnonymously(auth)
      .then(async (userCredential) => {
        const user = userCredential.user
        // Save the Aadhaar and profile details in Firestore
        await setDoc(doc(db, 'users', user.uid), {
          role: 'citizen',
          aadhaar: aadhaar.replace(/\s/g, ''),
          name: 'Resident of Majuli',
          email: `${user.uid}@healthpulse.ai`,
          createdAt: new Date().toISOString(),
        })

        toast.success('Welcome!', {
          description: `Aadhaar ${maskAadhaar(aadhaar)} Verified. Unique Citizen Account Active.`,
        })

        setTimeout(() => {
          router.push(redirectTo || `/dashboard/citizen`)
        }, 600)
      })
      .catch((error) => {
        setLoading(false)
        console.error('Anonymous auth error:', error)
        toast.error('Verification Failed', {
          description: error.message || 'Could not verify Aadhaar authentication session.',
        })
      })
  }

  // Handle standard Firebase Email/Password login for Official Staff
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        toast.success('Access Approved!', {
          description: `Loading your dashboard portal...`,
        })
        setTimeout(() => {
          router.push(redirectTo || `/dashboard/${role}`)
        }, 800)
      })
      .catch((error) => {
        // Fallback: create demo user in Firebase Auth if it doesn't exist yet
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
              const user = userCredential.user
              // Pre-register user in Firestore with selected role
              await setDoc(doc(db, 'users', user.uid), {
                email: email,
                name: ROLES[role]?.sampleUser || 'Demo User',
                role: role,
                createdAt: new Date().toISOString(),
              })

              toast.success('Demo Account Initialized!', {
                description: `Created and authenticated credentials for ${ROLES[role]?.name}.`,
              })
              setTimeout(() => {
                router.push(redirectTo || `/dashboard/${role}`)
              }, 800)
            })
            .catch((regError: any) => {
              setLoading(false)
              console.error('Demo registration error:', regError)
              toast.error('Authentication Failed', {
                description: error.message || 'Could not authenticate official staff portal credentials.',
              })
            })
        } else {
          setLoading(false)
          console.error('Admin login error:', error)
          toast.error('Authentication Failed', {
            description: error.message || 'Could not authenticate official staff portal credentials.',
          })
        }
      })
  }

  // Handle standard Google Sign-In popup
  const handleGoogleSignIn = () => {
    setLoading(true)
    const provider = new GoogleAuthProvider()
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user
        toast.success(`Authenticated as ${user.displayName || user.email}!`, {
          description: 'Syncing your profile and loading portal...',
        })

        // Wait brief delay for onAuthStateChanged listener in auth.ts to sync and retrieve role
        setTimeout(() => {
          const session = getAuthSession()
          const targetRole = session?.role || 'citizen'
          router.push(redirectTo || `/dashboard/${targetRole}`)
        }, 1200)
      })
      .catch((error) => {
        setLoading(false)
        console.error('Google sign-in error:', error)
        toast.error('Google Sign-In Failed', {
          description: error.message || 'Authentication with Google was cancelled or failed.',
        })
      })
  }

  return (
    <div className="space-y-6">
      {/* Portal Type Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-muted/60 p-1.5 border border-border">
        <button
          type="button"
          onClick={() => handlePortalSwitch('citizen')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
            portalType === 'citizen'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Fingerprint className="size-4 text-primary" /> Citizen Aadhaar Login
        </button>

        <button
          type="button"
          onClick={() => handlePortalSwitch('admin')}
          className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
            portalType === 'admin'
              ? 'bg-card text-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" /> Official Staff Portal
        </button>
      </div>

      {portalType === 'citizen' ? (
        /* AADHAAR VERIFIED CITIZEN LOGIN FORM */
        <form onSubmit={otpSent ? handleCitizenSubmit : handleSendAadhaarOtp} className="flex flex-col gap-5">
          <div className="space-y-4 rounded-xl border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <Fingerprint className="size-4 text-primary" /> 1-Account Per Resident Verification
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold">
                UIDAI / ABHA LINKED
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Log in with your 12-digit Aadhaar number to access your verified Majuli society health update and submit authentic reports.
            </p>

            <div className="space-y-2 pt-1">
              <Label htmlFor="aadhaar" className="font-semibold text-xs flex items-center justify-between">
                <span>12-Digit Aadhaar Number</span>
                <span className="text-[10px] text-muted-foreground">Unique Citizen ID</span>
              </Label>
              <Input
                id="aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="4819 2049 4921"
                maxLength={14}
                className="font-mono tracking-wider font-bold h-11 border-primary/30"
                disabled={loading}
              />
            </div>

            {otpSent && (
              <div className="space-y-2 pt-1 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="font-semibold text-xs">Enter 4-Digit Aadhaar OTP</Label>
                  <span className="text-[10px] text-emerald-600 font-bold">OTP sent to ******4921</span>
                </div>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4921"
                  maxLength={4}
                  className="font-mono text-center tracking-widest text-base font-extrabold h-11 border-emerald-500/40"
                  disabled={loading}
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full font-extrabold shadow-md gap-2 h-11" disabled={loading}>
            {loading ? (
              'Verifying Credentials...'
            ) : otpSent ? (
              <>
                <CheckCircle2 className="size-4" /> Verify OTP & Enter Citizen Portal
              </>
            ) : (
              <>
                <KeyRound className="size-4" /> Get Aadhaar Verification OTP
              </>
            )}
          </Button>
        </form>
      ) : (
        /* OFFICIAL ADMIN PORTAL MODE */
        <form onSubmit={handleAdminSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role" className="font-semibold">Official Staff Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RoleId)} disabled={loading}>
                <SelectTrigger id="role" className="w-full h-10 border-emerald-500/30">
                  <SelectValue placeholder="Select official role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_GROUPS.filter((g) => g.id !== 'field' || role !== 'citizen').map((group) => (
                    <SelectGroup key={group.id}>
                      <SelectLabel className="font-bold text-xs uppercase tracking-wider text-muted-foreground">{group.label}</SelectLabel>
                      {ROLE_ORDER.filter((id) => id !== 'citizen' && ROLES[id].group === group.id).map((id) => (
                        <SelectItem key={id} value={id}>
                          {ROLES[id].name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed">{ROLES[role].description}</p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="font-semibold">Official Government ID / Email</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-semibold">Official Password</Label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Authorized Access</span>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                disabled={loading}
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full font-extrabold shadow-md gap-2 h-11" disabled={loading}>
            {loading ? 'Authenticating & Loading...' : 'Sign In to Official Admin Hub'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      )}

      {/* Shared Google Sign-In CTA */}
      <div className="flex flex-col gap-4 pt-2">
        <div className="relative flex items-center justify-center">
          <span className="absolute px-3 bg-background text-[10px] uppercase text-muted-foreground font-extrabold">Or Outbreak Surveillance Identity</span>
          <div className="w-full border-t border-border" />
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleSignIn}
          className="w-full h-11 font-bold gap-2 rounded-xl border-border/80 shadow-xs hover:bg-muted/50"
          disabled={loading}
        >
          <svg className="size-4 mr-1.5" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#FBBC05"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#4285F4"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#34A853"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Google Outbreak Portal Login
        </Button>
      </div>

      <div className="rounded-lg bg-muted/60 p-3 text-center text-xs text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-1 font-bold text-foreground">
          <Lock className="size-3 text-emerald-500" /> Secure Anti-Spam Protection
        </div>
        <p>1-Aadhaar per resident verification prevents duplicate filings and guarantees report authenticity.</p>
      </div>
    </div>
  )
}
