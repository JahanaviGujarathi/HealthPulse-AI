'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  Droplets,
  ShieldCheck,
  Activity,
  AlertTriangle,
  TrendingUp,
  MapPin,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export function Hero() {
  const router = useRouter()
  const [reportText, setReportText] = useState('')
  const [time, setTime] = useState('')

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
    router.push(`/login?redirect=/dashboard/citizen?section=report&query=${encodeURIComponent(reportText)}`)
  }

  return (
    <section className="relative overflow-hidden border-b border-[#DCE4F0] bg-[#F7F9FE] py-12 lg:py-16 dark:bg-[#0B111E] dark:border-[#1E2D45]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          
          {/* ZONE 1: Action Console (Left - 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Live Status Pill */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCE4F0] bg-white px-3 py-1 text-xs font-semibold text-[#172554] shadow-xs dark:bg-[#111A2B] dark:border-[#1E2D45] dark:text-[#EEF3FF]">
              <span className="flex size-2 rounded-full bg-[#3BAA72]" />
              <span className="text-[11px] font-bold tracking-wide uppercase text-[#3157D5]">SURVEILLANCE NETWORK ACTIVE</span>
              <span className="text-[10px] text-[#94A3B8] border-l border-[#DCE4F0] pl-2 font-mono dark:border-[#1E2D45]">
                {time || 'LIVE'}
              </span>
            </div>

            {/* Clean Medical Headline */}
            <h1 className="text-balance text-3xl font-bold tracking-tight text-[#172554] sm:text-4xl lg:text-5xl leading-tight dark:text-[#F1F5F9]">
              Smart Water Safety & Epidemic Early Warning.
            </h1>

            <p className="max-w-xl text-sm leading-relaxed text-[#64748B] font-normal dark:text-[#94A3B8]">
              HealthPulse AI maps potable water contamination and clinical symptom clusters across villages in real time. Flag water issues to immediately trigger local rapid response teams.
            </p>

            {/* Quick Report Input */}
            <form onSubmit={handleQuickReport} className="relative w-full max-w-md">
              <div className="flex items-center gap-2 rounded-xl border border-[#DCE4F0] bg-white p-1.5 shadow-xs focus-within:border-[#3157D5] focus-within:ring-2 focus-within:ring-[#EEF3FF] transition-all dark:bg-[#111A2B] dark:border-[#1E2D45]">
                <Input
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Diarrhea cluster in Kamalabari..."
                  className="flex-1 border-0 bg-transparent text-xs sm:text-sm text-[#172033] placeholder-[#94A3B8] focus-visible:ring-0 h-9 px-2 dark:text-[#F1F5F9]"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#3157D5] hover:bg-[#243FA8] text-white font-semibold text-xs h-9 px-4 rounded-lg flex items-center gap-1 shrink-0"
                >
                  <span>Report</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
              <p className="text-[11px] text-[#94A3B8] mt-2 px-1">
                Submissions are verified via local ASHA workers and laboratory water cultures.
              </p>
            </form>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                size="default"
                onClick={() => router.push('/login')}
                className="gap-2 text-xs sm:text-sm font-semibold bg-[#3157D5] hover:bg-[#243FA8] text-white px-5 py-2.5 rounded-lg shadow-xs"
              >
                <span>Access Health Portals</span>
                <ArrowRight className="size-4" />
              </Button>
              <Button
                size="default"
                variant="outline"
                onClick={() => {
                  document.getElementById('disease-map')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-xs sm:text-sm font-semibold border-[#DCE4F0] bg-white text-[#172033] hover:bg-[#F7F9FE] px-5 py-2.5 rounded-lg dark:bg-[#111A2B] dark:border-[#1E2D45] dark:text-[#F1F5F9]"
              >
                View Outbreak Map
              </Button>
            </div>

            {/* Compliance Note */}
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#64748B] pt-1">
              <ShieldCheck className="size-4 text-[#3BAA72]" />
              <span>OWASP Level 3 Security · Aadhaar OTP Verification</span>
            </div>
          </div>

          {/* ZONE 2: Threat Monitor Console (Center - 4 Cols) */}
          <div className="lg:col-span-4 rounded-2xl bg-white border border-[#DCE4F0] p-5 shadow-xs flex flex-col justify-between h-[490px] interactive-card dark:bg-[#111A2B] dark:border-[#1E2D45]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#E8EDF5] dark:border-[#1E2D45]">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#E5485D] animate-pulse-ring-danger" />
                <span className="text-xs font-bold text-[#172554] uppercase tracking-wide dark:text-[#F1F5F9]">
                  Live Surveillance Ledger
                </span>
              </div>
              <Badge variant="outline" className="text-[10px] font-semibold border-[#FFB7C0] text-[#E5485D] bg-[#FFF0F2]">
                Active Feed
              </Badge>
            </div>

            {/* Feed Log (Restrained Semantic Cards) */}
            <div className="flex-1 my-3.5 space-y-2.5 overflow-y-auto pr-1 text-xs">
              {/* High Risk Card */}
              <div className="p-3 rounded-xl bg-white border border-[#FFB7C0] space-y-1 shadow-2xs hover:border-[#E5485D] transition-colors dark:bg-[#161F32]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#E5485D] flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#E5485D]" /> Waterborne Warning
                  </span>
                  <span className="text-[#94A3B8] font-mono">14:04</span>
                </div>
                <p className="text-[#172033] text-xs leading-normal font-medium dark:text-[#F1F5F9]">
                  ASHA worker confirmed 7 watery diarrhea cases in Kamalabari block.
                </p>
              </div>

              {/* Warning Amber Card */}
              <div className="p-3 rounded-xl bg-white border border-[#FDE68A] space-y-1 shadow-2xs dark:bg-[#161F32]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#D99A24] flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#D99A24]" /> Turbidity Advisory
                  </span>
                  <span className="text-[#94A3B8] font-mono">12:11</span>
                </div>
                <p className="text-[#172033] text-xs leading-normal font-medium dark:text-[#F1F5F9]">
                  Community Well #3 recorded 12.4 NTU. Boil-water advisory dispatched.
                </p>
              </div>

              {/* Normal Success Card */}
              <div className="p-3 rounded-xl bg-white border border-[#A7F3D0] space-y-1 shadow-2xs dark:bg-[#161F32]">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-[#3BAA72] flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[#3BAA72]" /> Lab Confirmed
                  </span>
                  <span className="text-[#94A3B8] font-mono">10:32</span>
                </div>
                <p className="text-[#172033] text-xs leading-normal font-medium dark:text-[#F1F5F9]">
                  State Lab confirmed NEGATIVE cholera culture for Teok Block.
                </p>
              </div>
            </div>

            {/* Bottom Risk Score */}
            <div className="pt-3 border-t border-[#E8EDF5] flex items-center justify-between dark:border-[#1E2D45]">
              <div>
                <span className="text-[10px] text-[#64748B] block font-semibold uppercase">District Threat Index</span>
                <span className="text-base font-bold text-[#172554] dark:text-[#F1F5F9]">72 / 100</span>
              </div>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#E5485D] bg-[#FFF0F2] border border-[#FFB7C0] rounded-lg px-2.5 py-1">
                <TrendingUp className="size-3" />
                <span>Elevated</span>
              </span>
            </div>
          </div>

          {/* ZONE 3: Telemetry Hub (Right - 3 Cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3.5">
            {/* Widget 1: Water Safety */}
            <div className="rounded-2xl bg-white border border-[#DCE4F0] p-4 shadow-xs flex flex-col gap-3 interactive-card dark:bg-[#111A2B] dark:border-[#1E2D45]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172554] uppercase tracking-wide flex items-center gap-1.5 dark:text-[#F1F5F9]">
                  <Droplets className="size-3.5 text-[#3157D5] animate-subtle-bounce" />
                  Water Telemetry
                </span>
                <Badge variant="outline" className="text-[10px] border-[#DCE4F0] text-[#64748B]">
                  PHED Grid
                </Badge>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center py-1 border-b border-[#E8EDF5] dark:border-[#1E2D45]">
                  <span className="text-[#64748B]">Average pH</span>
                  <span className="font-semibold text-[#172033] dark:text-[#F1F5F9]">7.1 (Safe)</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-[#E8EDF5] dark:border-[#1E2D45]">
                  <span className="text-[#64748B]">Free Chlorine</span>
                  <span className="font-semibold text-[#E5485D]">0.12 mg/L (Low)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-[#64748B]">Bacterial Coliform</span>
                  <span className="font-semibold text-[#E5485D]">180 CFU/100mL</span>
                </div>
              </div>
            </div>

            {/* Widget 2: Healthcare Capacity */}
            <div className="rounded-2xl bg-white border border-[#DCE4F0] p-4 shadow-xs flex flex-col gap-3 interactive-card dark:bg-[#111A2B] dark:border-[#1E2D45]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#172554] uppercase tracking-wide flex items-center gap-1.5 dark:text-[#F1F5F9]">
                  <Activity className="size-3.5 text-[#3157D5]" />
                  Clinical Capacity
                </span>
                <span className="text-[11px] font-semibold text-[#3BAA72]">78% Utilized</span>
              </div>

              <div className="w-full bg-[#EEF3FF] h-2 rounded-full overflow-hidden dark:bg-[#1E2D45]">
                <div className="bg-[#3157D5] h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '78%' }} />
              </div>

              <div className="flex justify-between text-[11px] text-[#64748B]">
                <span>142 Active Admissions</span>
                <span>38 Beds Available</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
