'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Droplets, HeartPulse, Lock, ShieldCheck, Sparkles, Activity, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const stats = [
  { value: '8', label: 'Role-based Portals', desc: 'Citizen to State Admin' },
  { value: '91%', label: 'AI Model Accuracy', desc: 'Neural Outbreak Engine' },
  { value: '7 Days', label: 'Early Warning Lead', desc: 'Before Outbreak Spreads' },
]

export function Hero() {
  const router = useRouter()

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-muted/20 to-background py-16 sm:py-24 lg:py-32">
      {/* Background Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl opacity-35 dark:opacity-20 animate-pulse-glow"
      >
        <div className="h-[420px] w-[950px] rounded-full bg-gradient-to-tr from-primary via-cyan-500 to-emerald-400" />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col gap-6">
          {/* Classic Banner Badge */}
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold text-primary backdrop-blur shadow-xs transition-all duration-300 hover:bg-primary/20 hover:scale-105 cursor-pointer">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500" />
            </span>
            <span>Real-time Water & Public Health Surveillance System</span>
          </div>

          {/* Classic Headline */}
          <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.12]">
            Detect & prevent disease outbreaks{' '}
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-emerald-400 bg-clip-text text-transparent">
              before they spread.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-xl text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground font-normal">
            HealthPulse AI connects Citizens, ASHA Field Workers, Doctors, Pathology Labs, Water Testing Officers, and District Officials into one unified intelligence platform — using predictive AI to detect cholera, typhoid, and water contamination early.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="group gap-2 text-sm font-extrabold shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            >
              <span>Sign In to Access Portals</span>
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                document.getElementById('roles')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="gap-2 text-sm font-bold border-border/80 hover:bg-muted/80 px-7 py-6 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore 8 Role Portals
            </Button>
          </div>

          {/* Security Compliance Seal */}
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground pt-1">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Compliant with <b>OWASP Top 10 Security Architecture</b> · RBAC Enforced</span>
          </div>

          {/* Classic Stats Grid */}
          <dl className="mt-4 grid grid-cols-3 gap-4 border-t border-border/60 pt-6">
            {stats.map((s) => (
              <div key={s.label} className="group space-y-1 p-2.5 rounded-xl border border-transparent transition-all duration-300 hover:border-border/60 hover:bg-card/70 shadow-xs">
                <dt className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl transition-colors group-hover:text-primary">{s.value}</dt>
                <dd className="text-xs font-bold text-foreground">{s.label}</dd>
                <p className="text-[11px] text-muted-foreground hidden sm:block">{s.desc}</p>
              </div>
            ))}
          </dl>
        </div>

        {/* Live Hero Preview Component */}
        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card shadow-2xl transition-all duration-500 hover:shadow-primary/20 hover:scale-[1.015]">
            <Image
              src="/hero-health-worker.png"
              alt="Community health worker reviewing surveillance data on a tablet near a village water pump"
              width={720}
              height={720}
              priority
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
          </div>

          {/* Floating AI Risk Widget */}
          <div className="absolute -left-4 bottom-8 w-64 rounded-2xl border border-primary/30 bg-card/95 p-4 shadow-2xl backdrop-blur-md animate-float">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
                <Sparkles className="size-4 animate-spin text-primary" style={{ animationDuration: '6s' }} />
                AI Outbreak Risk Engine
              </div>
              <Badge variant="outline" className="text-[10px] font-bold bg-destructive/10 text-destructive border-destructive/30 animate-pulse">
                HIGH RISK
              </Badge>
            </div>
            <p className="mt-2 text-sm font-bold text-foreground">Kamalabari · Cholera Outbreak</p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-destructive">87%</span>
              <span className="text-xs font-medium text-muted-foreground">7-day forecast</span>
            </div>
            <div className="mt-2.5 h-2 w-full rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-destructive w-[87%] transition-all duration-1000 ease-out" />
            </div>
          </div>

          {/* Floating Live Advisory Pill */}
          <div className="absolute -right-3 top-6 flex items-center gap-2.5 rounded-xl border border-amber-500/40 bg-card/95 px-4 py-3 text-xs font-bold shadow-xl backdrop-blur-md text-amber-600 dark:text-amber-400 transition-transform duration-300 hover:scale-105 cursor-pointer">
            <Droplets className="size-4 text-amber-500 animate-bounce" />
            <span>Boil-water advisory active in Kamalabari</span>
          </div>
        </div>
      </div>
    </section>
  )
}
