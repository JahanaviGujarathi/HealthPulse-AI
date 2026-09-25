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
  Radio,
  FileCheck2,
  Users,
  Building,
  Sparkles,
  PhoneCall,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { HotspotMap } from '@/components/dashboard/map-panel'
import { VILLAGES, WATER_SOURCES, TOTALS } from '@/lib/data'

export function Hero() {
  const router = useRouter()
  const [reportText, setReportText] = useState('')
  const [activeTab, setActiveTab] = useState<'map' | 'telemetry'>('map')
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
    <section className="relative overflow-hidden border-b border-[#DCE4F0] bg-[#F7F9FE] pt-8 pb-14 lg:pt-12 lg:pb-16 dark:bg-[#0B111E] dark:border-[#1E2D45]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* TOP ENTERPRISE BANNER / TICKER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[#E8EDF5] pb-4 dark:border-[#1E2D45]">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#3BAA72] opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#3BAA72]" />
            </span>
            <span className="text-xs font-bold text-[#172554] tracking-wide uppercase dark:text-[#F1F5F9]">
              NATIONAL EPIDEMIOLOGICAL SURVEILLANCE GRID
            </span>
            <span className="text-[11px] text-[#64748B] font-mono border-l border-[#DCE4F0] pl-2 dark:border-[#1E2D45]">
              {time || 'LIVE'} · IDSP CONNECTED
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#E5485D]" />
              <strong className="text-[#172033] dark:text-[#F1F5F9]">{TOTALS.contaminatedSources}</strong> High-Risk Sources
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-[#3BAA72]" />
              <strong className="text-[#172033] dark:text-[#F1F5F9]">{TOTALS.villagesMonitored}</strong> Monitored Blocks
            </span>
            <span className="inline-flex items-center gap-1">
              <strong className="text-[#3157D5] font-bold">{TOTALS.activeCases}</strong> Active Case Alerts
            </span>
          </div>
        </div>

        {/* HERO MAIN GRID */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-start">
          
          {/* LEFT 6 COLS: Product Positioning & Action Console */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Pill Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#DCE5FF] bg-[#EEF3FF] px-3.5 py-1 text-xs font-semibold text-[#3157D5] dark:bg-[#172554] dark:border-[#243FA8] dark:text-[#EEF3FF]">
              <Radio className="size-3.5 animate-subtle-pulse" />
              <span>Real-Time Water Purity & Outbreak Forecasting</span>
            </div>

            {/* Typography Master Headline */}
            <div className="space-y-3">
              <h1 className="text-balance text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#172554] leading-[1.12] dark:text-[#F1F5F9]">
                Clinical Early Warning for District Epidemic Outbreaks.
              </h1>
              <p className="text-base sm:text-lg leading-relaxed text-[#64748B] font-normal dark:text-[#94A3B8]">
                Integrated surveillance system connecting village water sensors, household symptom reports, and automated clinical hospital alerts in under 24 hours.
              </p>
            </div>

            {/* Action Bar / Form */}
            <div className="space-y-3 pt-1">
              <form onSubmit={handleQuickReport} className="relative w-full max-w-lg">
                <div className="flex items-center gap-2 rounded-xl border border-[#DCE4F0] bg-white p-1.5 shadow-xs focus-within:border-[#3157D5] focus-within:ring-3 focus-within:ring-[#EEF3FF] transition-all dark:bg-[#111A2B] dark:border-[#1E2D45]">
                  <Input
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Enter village symptom cluster or water issue..."
                    className="flex-1 border-0 bg-transparent text-xs sm:text-sm text-[#172033] placeholder-[#94A3B8] focus-visible:ring-0 h-10 px-3 font-medium dark:text-[#F1F5F9]"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#3157D5] hover:bg-[#243FA8] text-white font-semibold text-xs h-10 px-5 rounded-lg flex items-center gap-1.5 shrink-0 interactive-btn shadow-xs"
                  >
                    <span>Instant Alert</span>
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
              </form>

              {/* Action Buttons Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Button
                  size="default"
                  onClick={() => router.push('/login')}
                  className="gap-2 text-xs sm:text-sm font-semibold bg-[#3157D5] hover:bg-[#243FA8] text-white px-5 py-2.5 rounded-lg interactive-btn shadow-xs"
                >
                  <span>Access Clinical Portals</span>
                  <ArrowRight className="size-4" />
                </Button>
                <Button
                  size="default"
                  variant="outline"
                  onClick={() => {
                    document.getElementById('disease-map')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="text-xs sm:text-sm font-semibold border-[#DCE4F0] bg-white text-[#172033] hover:bg-[#F7F9FE] hover:border-[#3157D5] px-5 py-2.5 rounded-lg dark:bg-[#111A2B] dark:border-[#1E2D45] dark:text-[#F1F5F9]"
                >
                  View Outbreak Map
                </Button>
              </div>
            </div>

            {/* Live Trust Metrics Row */}
            <div className="grid grid-cols-3 gap-3 pt-3 border-t border-[#E8EDF5] dark:border-[#1E2D45]">
              <div className="space-y-0.5">
                <span className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight dark:text-[#F1F5F9]">
                  99.6%
                </span>
                <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">ML Forecast Accuracy</p>
              </div>
              <div className="space-y-0.5 border-l border-[#E8EDF5] pl-3 dark:border-[#1E2D45]">
                <span className="text-xl sm:text-2xl font-black text-[#172554] tracking-tight dark:text-[#F1F5F9]">
                  &lt; 24h
                </span>
                <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">Intervention Window</p>
              </div>
              <div className="space-y-0.5 border-l border-[#E8EDF5] pl-3 dark:border-[#1E2D45]">
                <span className="text-xl sm:text-2xl font-black text-[#3157D5] tracking-tight">
                  8 Roles
                </span>
                <p className="text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">Unified Architecture</p>
              </div>
            </div>

          </div>

          {/* RIGHT 6 COLS: High-End Live Interactive Surveillance Card */}
          <div className="lg:col-span-6 rounded-2xl bg-white border border-[#DCE4F0] p-5 shadow-xs interactive-card dark:bg-[#111A2B] dark:border-[#1E2D45]">
            
            {/* Interactive Control Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#E8EDF5] dark:border-[#1E2D45]">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-[#3157D5] animate-subtle-pulse" />
                <span className="text-xs font-bold text-[#172554] uppercase tracking-wide dark:text-[#F1F5F9]">
                  Regional Surveillance Cockpit
                </span>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-[#F7F9FE] p-1 border border-[#DCE4F0] dark:bg-[#162032] dark:border-[#1E2D45]">
                <button
                  onClick={() => setActiveTab('map')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeTab === 'map'
                      ? 'bg-[#3157D5] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#172033] dark:text-[#94A3B8]'
                  }`}
                >
                  GIS Map
                </button>
                <button
                  onClick={() => setActiveTab('telemetry')}
                  className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                    activeTab === 'telemetry'
                      ? 'bg-[#3157D5] text-white shadow-2xs'
                      : 'text-[#64748B] hover:text-[#172033] dark:text-[#94A3B8]'
                  }`}
                >
                  Live Feed
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: GIS Map View */}
            {activeTab === 'map' ? (
              <div className="my-3 space-y-3">
                <div className="h-[280px] w-full rounded-xl overflow-hidden border border-[#DCE4F0] relative">
                  <HotspotMap height={280} center={[26.85, 94.25]} zoom={9} />
                </div>
                
                {/* Telemetry Snapshot Pill Bar */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="rounded-xl border border-[#FFB7C0] bg-[#FFF0F2] p-2.5">
                    <span className="text-[10px] text-[#E5485D] block font-semibold uppercase">High Contamination</span>
                    <span className="text-sm font-bold text-[#E5485D]">Kamalabari</span>
                  </div>
                  <div className="rounded-xl border border-[#FDE68A] bg-[#FFF7E5] p-2.5">
                    <span className="text-[10px] text-[#D99A24] block font-semibold uppercase">Turbidity Alert</span>
                    <span className="text-sm font-bold text-[#D99A24]">Garamur #3</span>
                  </div>
                  <div className="rounded-xl border border-[#A7F3D0] bg-[#EAF8F1] p-2.5">
                    <span className="text-[10px] text-[#3BAA72] block font-semibold uppercase">Chlorination OK</span>
                    <span className="text-sm font-bold text-[#3BAA72]">Jorhat Grid</span>
                  </div>
                </div>
              </div>
            ) : (
              /* TAB CONTENT 2: Live Feed & Telemetry Alerts */
              <div className="my-3 space-y-2.5 h-[340px] overflow-y-auto pr-1 text-xs">
                <div className="p-3 rounded-xl bg-[#FFF0F2] border border-[#FFB7C0] space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#E5485D] flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#E5485D] animate-pulse" /> Waterborne Surge Alert
                    </span>
                    <span className="text-[#94A3B8] font-mono">14:04</span>
                  </div>
                  <p className="text-[#172033] font-medium leading-normal dark:text-[#F1F5F9]">
                    ASHA verified 7 watery diarrhea cases in Kamalabari block. Rapid Response Team dispatched.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#FFF7E5] border border-[#FDE68A] space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#D99A24] flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#D99A24]" /> Elevated Turbidity (12.4 NTU)
                    </span>
                    <span className="text-[#94A3B8] font-mono">12:11</span>
                  </div>
                  <p className="text-[#172033] font-medium leading-normal dark:text-[#F1F5F9]">
                    Community Well #3 exceeding safe limits. Public boil-water advisory triggered.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[#EAF8F1] border border-[#A7F3D0] space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-bold text-[#3BAA72] flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-[#3BAA72]" /> Lab Diagnostics Clear
                    </span>
                    <span className="text-[#94A3B8] font-mono">10:32</span>
                  </div>
                  <p className="text-[#172033] font-medium leading-normal dark:text-[#F1F5F9]">
                    Culture negative for Vibrio cholerae in Teok sector. Risk level lowered to Low.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Status Summary Bar */}
            <div className="pt-3 border-t border-[#E8EDF5] flex items-center justify-between text-xs text-[#64748B] dark:border-[#1E2D45] dark:text-[#94A3B8]">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-[#3BAA72]" />
                <span>Sanitized Field Telemetry</span>
              </div>
              <button
                onClick={() => router.push('/dashboard/dho')}
                className="font-semibold text-[#3157D5] hover:text-[#243FA8] flex items-center gap-1 transition-colors"
              >
                <span>Full District Board</span>
                <ArrowRight className="size-3" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
