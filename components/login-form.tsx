'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { ArrowRight, Lock, ShieldCheck, Users, Building2, Fingerprint, KeyRound, CheckCircle2, Sparkles, Stethoscope, Microchip, Shield } from 'lucide-react'
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

  const quickDemoLogin = (targetRole: RoleId) => {
    setLoading(true)
    const demoEmail = targetRole === 'citizen' ? 'rahul.das@majuli.org' : `${targetRole}@healthpulse.gov.in`
    const demoAadhaar = '4819 2049 4921'
    const session = setAuthSession(targetRole, demoEmail, demoAadhaar)

    toast.success(`Quick Access: Signed in as ${session.name}`, {
      description: `Role: ${ROLES[targetRole].name}. Loading dashboard...`,
    })

    setTimeout(() => {
      router.push(`/dashboard/${targetRole}`)
    }, 350)
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
    }, 500)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const session = setAuthSession(role, email, aadhaar)

    toast.success(`Welcome back, ${session.name}!`, {
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
      {/* Quick Demo Role Selection Chips */}
      <div className="space-y-2 rounded-2xl border border-primary/20 bg-card/90 p-3.5 shadow-md backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs font-black text-foreground">
          <span className="flex items-center gap-1.5 text-primary">
            <Sparkles className="size-3.5 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
            Quick Demo Access (1-Click Login):
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => quickDemoLogin('citizen')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-2 text-xs font-extrabold text-foreground transition-all hover:scale-105 hover:bg-primary/10 hover:border-primary/40"
          >
            <span>🌾 Resident</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('doctor')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-2 text-xs font-extrabold text-foreground transition-all hover:scale-105 hover:bg-emerald-500/10 hover:border-emerald-500/40"
          >
            <span>👨‍⚕️ Doctor</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('lab')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-2 text-xs font-extrabold text-foreground transition-all hover:scale-105 hover:bg-cyan-500/10 hover:border-cyan-500/40"
          >
            <span>🔬 Lab Tech</span>
          </button>
          <button
            type="button"
            onClick={() => quickDemoLogin('dho')}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/40 p-2 text-xs font-extrabold text-foreground transition-all hover:scale-105 hover:bg-rose-500/10 hover:border-rose-500/40"
          >
            <span>🏛️ Official</span>
          </button>
        </div>
      </div>

      {/* Portal Type Switcher Tabs */}
      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/60 p-1.5 border border-border">
        <button
          type="button"
          onClick={() => handlePortalSwitch('citizen')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
            portalType === 'citizen'
              ? 'bg-card text-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Fingerprint className="size-4 text-primary" /> Citizen Aadhaar Portal
        </button>

        <button
          type="button"
          onClick={() => handlePortalSwitch('admin')}
          className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all cursor-pointer ${
            portalType === 'admin'
              ? 'bg-card text-foreground shadow-md'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Building2 className="size-4 text-emerald-600 dark:text-emerald-400" /> Staff & Officials
        </button>
      </div>

      {portalType === 'citizen' ? (
        /* AADHAAR VERIFIED CITIZEN LOGIN FORM */
        <form onSubmit={otpSent ? handleSubmit : handleSendAadhaarOtp} className="flex flex-col gap-5">
          <div className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                <Fingerprint className="size-4 text-primary" /> Verified Citizen Identification
              </span>
              <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-black rounded-full">
                UIDAI LINKED
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Enter your 12-digit Aadhaar number to verify your resident identity and submit authentic disease reports.
            </p>

            <div className="space-y-2 pt-1">
              <Label htmlFor="aadhaar" className="font-bold text-xs flex items-center justify-between">
                <span>12-Digit Aadhaar Number</span>
                <span className="text-[10px] text-muted-foreground">Unique Citizen ID</span>
              </Label>
              <Input
                id="aadhaar"
                value={aadhaar}
                onChange={(e) => setAadhaar(e.target.value)}
                placeholder="4819 2049 4921"
                maxLength={14}
                className="font-mono tracking-wider font-extrabold h-11 border-primary/40 rounded-xl"
              />
            </div>

            {otpSent && (
              <div className="space-y-2 pt-1 animate-in fade-in-50 duration-300">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="font-bold text-xs">Enter 4-Digit Aadhaar OTP</Label>
                  <span className="text-[10px] text-emerald-600 font-extrabold">OTP sent to ******4921</span>
                </div>
                <Input
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="4921"
                  maxLength={4}
                  className="font-mono text-center tracking-widest text-base font-black h-11 border-emerald-500/40 rounded-xl"
                />
              </div>
            )}
          </div>

          <Button type="submit" size="lg" className="mt-1 w-full font-black shadow-xl shadow-primary/20 gap-2 h-11 rounded-2xl bg-primary hover:bg-primary/90" disabled={loading}>
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
              <Label htmlFor="role" className="font-extrabold text-xs">Official Staff Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v as RoleId)}>
                <SelectTrigger id="role" className="w-full h-11 border-emerald-500/30 rounded-xl font-bold">
                  <SelectValue placeholder="Select official role" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_GROUPS.filter((g) => g.id !== 'field' || role !== 'citizen').map((group) => (
                    <SelectGroup key={group.id}>
                      <SelectLabel className="font-black text-xs uppercase tracking-wider text-muted-foreground">{group.label}</SelectLabel>
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
              <Label htmlFor="email" className="font-bold text-xs">Official Government ID / Email</Label>
              <Input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="h-11 rounded-xl font-medium"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-bold text-xs">Official Password</Label>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold">Authorized Access</span>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <Button type="submit" size="lg" className="mt-2 w-full font-black shadow-xl shadow-emerald-500/20 gap-2 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white" disabled={loading}>
            {loading ? 'Authenticating & Loading...' : 'Sign In to Official Admin Hub'}
            {!loading && <ArrowRight className="size-4" />}
          </Button>
        </form>
      )}

      <div className="rounded-2xl bg-muted/60 p-3.5 text-center text-xs text-muted-foreground space-y-1 border border-border">
        <div className="flex items-center justify-center gap-1 font-black text-foreground">
          <Lock className="size-3 text-emerald-500" /> Secure Anti-Spam Verification Active
        </div>
        <p>1-Aadhaar per resident prevents duplicate filings and guarantees report authenticity.</p>
      </div>
    </div>
  )
}
