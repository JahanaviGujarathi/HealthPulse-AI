'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Droplets,
  ShieldCheck,
  Sparkles,
  Activity,
  Bell,
  AlertTriangle,
  TrendingUp,
  HeartPulse,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export function Hero() {
  const router = useRouter()
  const [reportText, setReportText] = useState('')
  const [time, setTime] = useState('')

  // Live ticking clock for high-end diagnostic feel
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleQuickReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportText.trim()) return
    // Forward the report query straight to the login -> citizen dashboard
    router.push(`/login?redirect=/dashboard/citizen?section=report&query=${encodeURIComponent(reportText)}`)
  }

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background via-secondary/15 to-background py-16 lg:py-24">
      {/* Cinematic Glowing Background Blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-10 -z-10 -translate-x-1/2 blur-3xl opacity-35 dark:opacity-20 animate-pulse-glow"
      >
        <div className="h-[450px] w-[900px] rounded-full bg-gradient-to-tr from-primary via-accent to-purple-600" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-10 -z-10 blur-3xl opacity-20 dark:opacity-10 animate-float"
        style={{ animationDuration: '9s' }}
      >
        <div className="h-[350px] w-[700px] rounded-full bg-gradient-to-br from-accent to-emerald-500" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          
          {/* ZONE 1: Action Console (Left - 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-24">
            {/* Live Ticker System Pill */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-black text-primary backdrop-blur-md shadow-xs transition-all duration-300 hover:scale-105">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              <span>EPIDEMIOLOGICAL RISK CENTER</span>
              <span className="text-[10px] text-muted-foreground border-l border-border/60 pl-2 ml-1 font-mono">
                {time || 'SYS ACTIVE'}
              </span>
            </div>

            {/* Core Cinematic Headline */}
            <h1 className="text-balance text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-5xl xl:text-6xl leading-[1.08]">
              Outbreak Surveillance{' '}
              <span className="bg-gradient-to-r from-primary via-accent to-purple-500 bg-clip-text text-transparent">
                System Active.
              </span>
            </h1>

            <p className="max-w-xl text-pretty text-sm sm:text-base leading-relaxed text-muted-foreground font-normal">
              HealthPulse AI is an early warning network mapping water safety and illness clusters. Enter an issue below to instantly alert local ASHA workers and deploy response teams.
            </p>

            {/* Integrated Quick Report Search Input */}
            <form onSubmit={handleQuickReport} className="relative w-full max-w-md">
              <div className="flex items-center gap-2 rounded-2xl border border-primary/20 bg-card/60 p-2 shadow-lg backdrop-blur-md focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all duration-300">
                <Input
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Diarrhea outbreak in Kamalabari..."
                  className="flex-1 border-0 bg-transparent text-xs sm:text-sm placeholder-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-10 px-2 font-medium"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-extrabold text-xs h-10 px-4 rounded-xl flex items-center gap-1 shrink-0 cursor-pointer shadow-md shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <span>Report</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-2 px-1 font-bold">
                ⚠️ Citizen reports are verified via Aadhaar OTP prior to medical routing.
              </p>
            </form>

            {/* Dashboard Sign in Trigger */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button
                size="lg"
                onClick={() => router.push('/login')}
                className="group gap-2 text-xs sm:text-sm font-black shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground px-6 py-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Access Clinical Portals</span>
                <Activity className="size-4 animate-pulse text-white/95" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('disease-map')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="gap-2 text-xs sm:text-sm font-extrabold border-border/80 hover:bg-muted/50 px-6 py-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                View Map
              </Button>
            </div>

            {/* Security Compliance Seal */}
            <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground pt-1">
              <ShieldCheck className="size-4 text-emerald-500 animate-pulse" />
              <span>Sanitized Data Intake (A03) · Secure Access Control (A01)</span>
            </div>
          </div>

          {/* ZONE 2: Threat Monitor Console (Center - 4 Cols) */}
          <div className="lg:col-span-4 rounded-3xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between glass-card border-border/80 h-[520px]">
            {/* Ambient Background Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-xs font-black uppercase tracking-wider text-rose-500">Live Surveillance Feed</span>
              </div>
              <Badge variant="outline" className="text-[9px] font-mono border-rose-500/20 text-rose-500 bg-rose-500/5">
                OUTBREAK ACTIVE
              </Badge>
            </div>

            {/* Simulated Clinical Feed Log */}
            <div className="flex-1 my-4 space-y-3.5 overflow-y-auto pr-1 text-[11px] font-mono scrollbar-none relative z-10">
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 space-y-1 animate-pulse">
                <div className="flex justify-between font-bold text-destructive">
                  <span>[WARNING] WATERBORNE SURGE</span>
                  <span>14:04:12</span>
                </div>
                <p className="text-foreground/90 font-bold leading-normal">
                  ASHA confirmed 7 watery diarrhea cases in Kamalabari block. High threat score verified.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-1">
                <div className="flex justify-between font-bold text-amber-500">
                  <span>[ADVISORY] TURBIDITY ALERT</span>
                  <span>12:11:45</span>
                </div>
                <p className="text-foreground/80 leading-normal">
                  Community Well #3 recorded 12.4 NTU. Boil-water guidance issued for Kamalabari village.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-muted/40 border border-border/40 space-y-1">
                <div className="flex justify-between font-bold text-muted-foreground">
                  <span>[SYSTEM] DIAGNOSTIC CLEAR</span>
                  <span>10:32:01</span>
                </div>
                <p className="text-foreground/70 leading-normal">
                  State Health Lab confirmed NEGATIVE cholera culture for Teok Block. Tracking low risk.
                </p>
              </div>
            </div>

            {/* Bottom Real-time Water Safety Dial Indicator */}
            <div className="pt-3 border-t border-border/60 relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">District Risk Index</span>
                <span className="text-lg font-black text-foreground">72/100 · High</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-rose-500 font-bold bg-rose-500/10 border border-rose-500/20 rounded-lg px-2 py-1">
                <TrendingUp className="size-3.5" />
                <span>+12.8% vs Mon</span>
              </div>
            </div>
          </div>

          {/* ZONE 3: Floating Resource Hub (Right - 3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            
            {/* Widget 1: Water Safety Parameters */}
            <div className="rounded-2xl p-4 glass-card shadow-lg flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Droplets className="size-4 text-accent animate-bounce" />
                  Water Parameters
                </span>
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1 font-bold">
                    <span>Chlorine Levels</span>
                    <span className="text-foreground">0.1 mg/L (Low)</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[15%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-muted-foreground mb-1 font-bold">
                    <span>Turbidity Index</span>
                    <span className="text-foreground">12.4 NTU (High)</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[82%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Active Emergency Dispatch */}
            <div className="rounded-2xl p-4 glass-card shadow-lg flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <HeartPulse className="size-4 text-rose-500" />
                  Active Dispatch
                </span>
                <Badge className="text-[9px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-extrabold uppercase">
                  EN ROUTE
                </Badge>
              </div>
              <p className="text-xs text-foreground font-bold">Kamalabari Block deployment:</p>
              <div className="space-y-1.5 text-xs text-muted-foreground font-bold">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Tanker #4: 2.1km away</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  <span>Chlorination unit: Arrived</span>
                </div>
              </div>
            </div>

            {/* Widget 3: AI Prediction Timeline */}
            <div className="rounded-2xl p-4 glass-card shadow-lg flex flex-col gap-3 transition-transform hover:scale-[1.01]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-foreground uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="size-4 text-primary animate-spin" style={{ animationDuration: '8s' }} />
                  AI Outbreak Forecast
                </span>
                <span className="text-[10px] text-primary font-bold">10-Day Prediction</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl font-black text-foreground">84%</div>
                <div className="text-[10px] text-muted-foreground leading-normal font-bold">
                  High cholera threat predicted within 3 days if chlorine levels remain unadjusted.
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
