'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  Bell,
  FilePlus,
  PlusCircle,
  Stethoscope,
  UserCheck,
  TrendingUp,
  BarChart4,
  Droplets,
  ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { CaseTrendChart, CasesByBlockChart, WaterQualityChart } from '@/components/dashboard/charts'
import { DISEASE_REPORTS, DISEASES, HOSPITALS, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function DoctorDashboard({ section }: { section: string }) {
  const [cases, setCases] = useState<DiseaseReport[]>(
    DISEASE_REPORTS.filter((r) => r.status === 'confirmed'),
  )

  useEffect(() => {
    let active = true
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports?role=doctor')
        const data = await res.json()
        if (active && res.ok && data.reports) {
          setCases(data.reports.filter((r: any) => r.status === 'confirmed'))
        }
      } catch (err) {
        console.error('Error fetching doctor cases:', err)
      }
    }
    fetchReports()
    return () => {
      active = false
    }
  }, [])

  // Form state
  const [patient, setPatient] = useState('')
  const [disease, setDisease] = useState('Cholera')
  const [village, setVillage] = useState('Kamalabari')
  const [severity, setSeverity] = useState<'high' | 'medium' | 'low'>('high')

  // Tab state for chart switcher
  const [activeChartTab, setActiveChartTab] = useState<'trends' | 'blocks' | 'water'>('trends')

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!patient) {
      toast.error('Please enter patient name / ID')
      return
    }

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          village,
          disease: disease as any,
          symptoms: ['Confirmed Diagnosis', 'Dehydration'],
          status: 'confirmed',
          source: 'Doctor',
          severity,
        }),
      })

      const data = await res.json()
      if (res.ok && data.report) {
        setCases([data.report, ...cases])
        toast.success('Confirmed Case Logged!', {
          description: `${disease} case for ${patient} uploaded to district surveillance ledger.`,
        })
        setPatient('')
      } else {
        toast.error(data.error || 'Failed to upload case')
      }
    } catch (err) {
      toast.error('Network error uploading case')
    }
  }

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Clinical Surveillance Portal — Dr. Meera Nair"
          description="Jorhat Civil Hospital. Monitor confirmed clinical cases, bed availability, and epidemiological trends."
        />

        {/* Dashboard stat cards with weekly sparklines and progress indicators */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Stethoscope}
            label="Confirmed Cases Today"
            value="14"
            hint="Uploaded to registry"
            tone="danger"
            sparklineData={[10, 12, 11, 14, 15, 14]}
          />
          <StatCard
            icon={Activity}
            label="Hospital Bed Occupancy"
            value="83%"
            hint="266 of 320 beds filled"
            tone="warning"
            sparklineData={[80, 81, 82, 83, 83, 83]}
            progress={83}
          />
          <StatCard
            icon={UserCheck}
            label="Recoveries This Week"
            value="39"
            hint="Discharged patients"
            tone="success"
            sparklineData={[30, 32, 35, 34, 38, 39]}
          />
          <StatCard
            icon={Bell}
            label="Active Outbreak Alerts"
            value="2"
            hint="Kamalabari & Teok"
            tone="danger"
            sparklineData={[1, 2, 2, 1, 2, 2]}
          />
        </div>

        {/* SPLIT CLINICAL WORKSTATION LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT PANE: Interactive Charts Hub (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/60">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-extrabold flex items-center gap-1.5">
                      <TrendingUp className="size-4 text-primary" />
                      Epidemiological Analysis Hub
                    </CardTitle>
                    <CardDescription className="text-xs">Toggle metric models to inspect local health indices.</CardDescription>
                  </div>

                  {/* Chart Tab Switcher Buttons */}
                  <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border shadow-xs">
                    <button 
                      onClick={() => setActiveChartTab('trends')}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-black transition-all cursor-pointer",
                        activeChartTab === 'trends' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Trends
                    </button>
                    <button 
                      onClick={() => setActiveChartTab('blocks')}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-black transition-all cursor-pointer",
                        activeChartTab === 'blocks' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Blocks
                    </button>
                    <button 
                      onClick={() => setActiveChartTab('water')}
                      className={cn(
                        "rounded-lg px-3 py-1.5 text-xs font-black transition-all cursor-pointer",
                        activeChartTab === 'water' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      Water
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="animate-in fade-in duration-300">
                  {activeChartTab === 'trends' && (
                    <CaseTrendChart compact title="Clinical Disease Outbreak Trend" description="14-day confirmed disease trajectories" />
                  )}
                  {activeChartTab === 'blocks' && (
                    <CasesByBlockChart />
                  )}
                  {activeChartTab === 'water' && (
                    <WaterQualityChart />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Bed Occupancy Capacity Sub-ledger */}
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold">Hospital Bed Capacity</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {HOSPITALS.map((h) => (
                  <div key={h.id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <p className="font-bold text-sm text-foreground">{h.name}</p>
                      <Badge variant="outline" className="border-primary/20 bg-primary/5 text-[11px] font-bold">{h.bedsAvailable} free</Badge>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500"
                        style={{ width: `${Math.round(((h.beds - h.bedsAvailable) / h.beds) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANE: Case entry + ledger (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Confirmed Case Form */}
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base flex items-center gap-2 font-extrabold">
                  <PlusCircle className="size-4 text-primary" /> Confirmed Case Entry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddCase} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-muted-foreground">Patient Name / ID</Label>
                    <Input placeholder="e.g. Biren Saikia" value={patient} onChange={(e) => setPatient(e.target.value)} required className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-muted-foreground">Diagnosed Disease</Label>
                    <Select value={disease} onValueChange={(v) => v && setDisease(v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DISEASES.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-muted-foreground">Patient Village</Label>
                    <Input value={village} onChange={(e) => setVillage(e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-muted-foreground">Clinical Severity</Label>
                    <Select value={severity} onValueChange={(v: any) => v && setSeverity(v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high" className="text-xs">High (ICU Admission)</SelectItem>
                        <SelectItem value="medium" className="text-xs">Medium (General Ward)</SelectItem>
                        <SelectItem value="low" className="text-xs">Low (Outpatient ORS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-10 rounded-xl cursor-pointer">
                    <FilePlus className="size-4" /> Upload Confirmed Case
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Case Registry Ledger list */}
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold">Registry Ledger</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {cases.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-muted/10 p-3.5 space-y-2 transition-all hover:border-primary/30">
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <p className="font-bold text-sm text-foreground">{c.patient}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{c.village} · {c.reportedAt}</p>
                      </div>
                      <Badge variant="outline" className={c.severity === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold text-[9px] uppercase rounded-full px-2 py-0.5' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-[9px] uppercase rounded-full px-2 py-0.5'}>
                        {c.severity}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-black text-[10px] px-2 py-0.5 rounded-md">{c.disease}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    )
  }

  // Dedicated Hospital Bed Capacity Section
  if (section === 'beds') {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Hospital Bed Capacity & Ward Allocation — Jorhat Civil Hospital"
          description="Real-time occupancy tracking, ICU bed availability, and inter-facility transfers."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {HOSPITALS.map((h) => {
            const occupied = h.beds - h.bedsAvailable
            const pct = Math.round((occupied / h.beds) * 100)
            return (
              <Card key={h.id} className="glass-card shadow-lg">
                <CardHeader className="pb-3 border-b border-border/40">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-extrabold">{h.name}</CardTitle>
                    <Badge variant="outline" className={pct > 80 ? "bg-rose-500/10 text-rose-600 border-rose-500/20 font-bold" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold"}>
                      {pct}% Occupied
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">{h.bedsAvailable} of {h.beds} beds available for emergency admissions.</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-muted-foreground">
                      <span>Occupancy Meter</span>
                      <span>{occupied} / {h.beds} Beds</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className={cn("h-full transition-all duration-500", pct > 80 ? "bg-rose-500" : "bg-primary")}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="w-full text-xs font-bold gap-1 cursor-pointer" onClick={() => toast.success(`Admission logged at ${h.name}`)}>
                      <PlusCircle className="size-3.5 text-primary" /> Admit Patient
                    </Button>
                    <Button size="sm" variant="secondary" className="w-full text-xs font-bold gap-1 cursor-pointer" onClick={() => toast.success(`Discharge processed at ${h.name}`)}>
                      <UserCheck className="size-3.5 text-emerald-600" /> Process Discharge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  // Dedicated Clinical Cases & Registry View
  if (section === 'cases' || section === 'reports') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Log Confirmed Disease Case" description="Record verified clinical diagnoses to update district outbreak models." />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <FilePlus className="size-4 text-primary" /> Clinical Intake Form
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddCase} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Patient Full Name / Reg ID</Label>
                    <Input placeholder="e.g. Biren Saikia" value={patient} onChange={(e) => setPatient(e.target.value)} required className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Diagnosed Disease</Label>
                    <Select value={disease} onValueChange={(v) => v && setDisease(v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DISEASES.map((d) => (
                          <SelectItem key={d} value={d} className="text-xs">{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Patient Village / Locality</Label>
                    <Input value={village} onChange={(e) => setVillage(e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Severity Level</Label>
                    <Select value={severity} onValueChange={(v: any) => v && setSeverity(v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high" className="text-xs">High (ICU Admission)</SelectItem>
                        <SelectItem value="medium" className="text-xs">Medium (General Ward)</SelectItem>
                        <SelectItem value="low" className="text-xs">Low (Outpatient ORS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-10 rounded-xl cursor-pointer">
                    <FilePlus className="size-4" /> Upload Confirmed Case
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-7">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold">Active Confirmed Case Ledger</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {cases.map((c) => (
                  <div key={c.id} className="rounded-2xl border border-border bg-muted/10 p-4 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-extrabold text-sm text-foreground">{c.patient}</p>
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-black text-[10px]">{c.disease}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{c.village} · Reported {c.reportedAt} by {c.source}</p>
                    </div>
                    <Badge variant="outline" className={c.severity === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold text-xs uppercase' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold text-xs uppercase'}>
                      {c.severity}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Analytics & Trends Section
  return (
    <div className="space-y-6">
      <SectionHeader title="Clinical Epidemiological Analytics" description="Multi-variable epidemiological metrics and regional disease distribution." />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-3xl p-4 shadow-lg border border-border">
          <CaseTrendChart title="Clinical Disease Trajectory" description="14-day trends across Cholera, Typhoid, and Diarrhea" />
        </div>
        <div className="glass-card rounded-3xl p-4 shadow-lg border border-border">
          <CasesByBlockChart />
        </div>
      </div>
    </div>
  )
}
