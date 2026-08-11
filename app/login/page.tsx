import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'
import { Brand } from '@/components/brand'
import { LoginForm } from '@/components/login-form'
import { ThemeToggle } from '@/components/theme-toggle'

export default function LoginPage() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      {/* Brand / info panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35) 0, transparent 45%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25) 0, transparent 40%)',
          }}
          aria-hidden="true"
        />
        <Link href="/" className="relative">
          <Brand size="lg" className="[&_span]:text-primary-foreground [&_.text-primary]:text-primary-foreground [&>div]:bg-primary-foreground [&>div]:text-primary" />
        </Link>
        <div className="relative max-w-md">
          <p className="text-2xl font-semibold leading-snug text-balance">
            {'"'}Early detection saves lives. HealthPulse AI gives every health worker and official
            the signal they need — before an outbreak spreads.{'"'}
          </p>
          <p className="mt-4 text-sm text-primary-foreground/80">
            Smart Health Surveillance & Early Warning System
          </p>
        </div>
        <div className="relative flex items-center gap-2 text-sm text-primary-foreground/80">
          <Lock className="size-4" />
          JWT authentication · Role-based access · Audit logging
        </div>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col items-center justify-center p-6 sm:p-10">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center justify-between lg:hidden">
            <Link href="/">
              <Brand />
            </Link>
          </div>
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose your role to open the matching dashboard.
          </p>
          <div className="mt-8">
            <Suspense fallback={<div className="py-8 text-center text-xs text-muted-foreground">Loading login form...</div>}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
