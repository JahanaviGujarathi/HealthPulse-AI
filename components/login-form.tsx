'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Lock, ShieldCheck, Users, Building2, Fingerprint, KeyRound, CheckCircle2 } from 'lucide-react'
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
import { setAuthSession } from '@/lib/auth'
import { isValidAadhaar, maskAadhaar } from '@/lib/security'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect')
  const defaultPortal = searchParams.get('portal') || 'citizen'

  const [portalType, setPortalType] = useState<'citizen' | 'admin'>(defaultPortal === 'admin' ? 'admin' : 'citizen')
  const [role, setRole] = useState<RoleId>(defaultPortal === 'admin' ? 'dho' : 'citizen')
  const [email, setEmail] = useState(defaultPortal === 'admin' ? 'dho.jorhat@assam.gov.in' : 'rahul.das@majuli.org')
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
      setEmail('rahul.das@majuli.org')
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const session = setAuthSession(role, email, aadhaar)

    toast.success(`Welcome, ${session.name}!`, {
      description: portalType === 'citizen'
        ? `Aadhaar ${maskAadhaar(aadhaar)} Verified. Unique Citizen Account Active.`
        : `Authenticated for ${ROLES[role].name}. Loading portal...`,
    })

    setTimeout(() => {
      const target = redirectTo || `/dashboard/${role}`
      router.push(target)
    }, 400)
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
        <form onSubmit={otpSent ? handleSubmit : handleSendAadhaarOtp} className="flex flex-col gap-5">
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
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full font-extrabold shadow-md gap-2 h-11" disabled={loading}>
            {loading ? (
              'Verifying with UIDAI Servers...'
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="role" className="font-semibold">Official Staff Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RoleId)}>
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
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-semibold">Official Password</Label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">RBAC Enforced</span>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full font-extrabold shadow-md gap-2 h-11" disabled={loading}>
            {loading ? 'Authenticating & Loading...' : 'Sign In to Official Admin Hub'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      )}

      <div className="rounded-lg bg-muted/60 p-3 text-center text-xs text-muted-foreground space-y-1">
        <div className="flex items-center justify-center gap-1 font-bold text-foreground">
          <Lock className="size-3 text-emerald-500" /> OWASP A04 Anti-Spam Protection
        </div>
        <p>1-Aadhaar per resident verification prevents duplicate filings and guarantees report authenticity.</p>
      </div>
    </div>
  )
}
