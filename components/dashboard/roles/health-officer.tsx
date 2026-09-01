'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  FileText,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Siren,
  Sparkles,
  Truck,
  UserCheck,
  Building2,
  Droplets,
  Download,
  Filter,
  Send,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { AiPredictionCard } from '@/components/dashboard/ai-prediction-card'
import { CaseTrendChart, CasesByBlockChart } from '@/components/dashboard/charts'
import { HotspotMap } from '@/components/dashboard/map-panel'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AI_PREDICTIONS, NOTIFICATIONS, RESOURCE_FORECAST, TOTALS, DISEASE_REPORTS, WATER_SOURCES, type DiseaseReport, type WaterSource } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function HealthOfficerDashboard({ section }: { section: string }) {
  const [alerts, setAlerts] = useState(NOTIFICATIONS)
  const [reports, setReports] = useState<DiseaseReport[]>(DISEASE_REPORTS)
  const [waterSources, setWaterSources] = useState<WaterSource[]>(WATER_SOURCES)
  const [resources, setResources] = useState(RESOURCE_FORECAST)
  const [isDeployingRRT, setIsDeployingRRT] = useState(false)

  // Reallocation modal state
  const [reallocateModalOpen, setReallocateModalOpen] = useState(false)
  const [selectedResource, setSelectedResource] = useState<{ resource: string; current: number; required: number; unit: string } | null>(null)
  const [targetFacility, setTargetFacility] = useState('Majuli CHC')
  const [reallocateQty, setReallocateQty] = useState('50')

  // Custom advisory form state
  const [customTitle, setCustomTitle] = useState('')
  const [customBody, setCustomBody] = useState('')
  const [customAudience, setCustomAudience] = useState<'citizen' | 'government'>('citizen')

  // Fetch live reports
  useEffect(() => {
    let active = true
    const fetchData = async () => {
      try {
        const [repRes, waterRes] = await Promise.all([
          fetch('/api/reports?role=dho'),
          fetch('/api/water-tests'),
        ])
        const repData = await repRes.json()
        const waterData = await waterRes.json()

        if (active) {
          if (repRes.ok && repData.reports) setReports(repData.reports)
          if (waterRes.ok && waterData.waterSources) setWaterSources(waterData.waterSources)
        }
      } catch (err) {
        console.error('Error loading DHO data:', err)
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [])

  const handleApproveAlert = (id: string, title: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, severity: 'low' as const } : a)),
    )
    toast.success(`District Alert Approved & Dispatched!`, {
      description: `Advisory "${title}" authorized by DHO Dr. Arun Gogoi and broadcasted via SMS & IDSP Grid.`,
    })
  }

  const handleCreateAdvisory = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customTitle || !customBody) return

    const newAdvisory = {
      id: `adv-${Date.now()}`,
      title: customTitle,
      body: customBody,
      type: 'outbreak' as const,
      severity: 'high' as const,
      time: 'Just now',
      audience: customAudience,
    }

    setAlerts([newAdvisory, ...alerts])
    toast.success('Official District Advisory Broadcasted!', {
      description: `Published to ${customAudience === 'citizen' ? 'Public Portal & SMS' : 'Health Staff Network'}.`,
    })
    setCustomTitle('')
    setCustomBody('')
  }

  const handleOpenReallocate = (r: { resource: string; current: number; required: number; unit: string }) => {
    setSelectedResource(r)
    setReallocateQty(Math.round(r.current * 0.2).toString() || '10')
    setReallocateModalOpen(true)
  }

  const handleConfirmReallocate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedResource) return

    const qty = Number(reallocateQty) || 1
    setResources((prev) =>
      prev.map((item) =>
        item.resource === selectedResource.resource
          ? { ...item, current: Math.max(0, item.current - qty) }
          : item,
      ),
    )

    toast.success(`Resource Transfer Order Executed!`, {
      description: `Dispatched ${qty} ${selectedResource.unit} of ${selectedResource.resource} to ${targetFacility}. Fleet tracking active.`,
    })

    setReallocateModalOpen(false)
  }

  const handleDeployRRT = () => {
    setIsDeployingRRT(true)
    setTimeout(() => {
      setIsDeployingRRT(false)
      toast.success('Rapid Response Team (RRT) Deployed to Kamalabari!', {
        description: 'Epidemiologists, medical officers, and mobile chlorination units dispatched.',
      })
    }, 600)
  }

  // ---------------------------------------------------------------------------
  // SECTION 1: OVERVIEW
  // ---------------------------------------------------------------------------
  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="District Health Surveillance Center — Dr. Arun Gogoi (DHO)"
          description="Jorhat District Office. Comprehensive epidemiology surveillance, AI outbreak prediction models, and emergency response management."
          action={
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeployingRRT}
              className="gap-1.5 font-bold shadow-md cursor-pointer"
              onClick={handleDeployRRT}
            >
              <Siren className="size-4 animate-pulse" /> Deploy Rapid Response Team
            </Button>
          }
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={HeartPulse} label="Total Active Cases" value={TOTALS.activeCases} hint="Across 8 monitored villages" tone="danger" />
          <StatCard icon={AlertTriangle} label="High-Risk Hotspots" value={TOTALS.highRiskVillages} hint="Kamalabari & Garamur" tone="danger" />
          <StatCard icon={Sparkles} label="AI Predicted Risk" value="87%" hint="Cholera forecast in Kamalabari" tone="warning" />
          <StatCard icon={ShieldCheck} label="Surveillance Coverage" value="100%" hint="54,700 population monitored" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <AiPredictionCard prediction={AI_PREDICTIONS[0]} />
            <CaseTrendChart title="District Epidemiological Curve" description="Reported active cases over last 14 days" />
          </div>

          <div className="space-y-6">
            <Card className="border-amber-500/30">
              <CardHeader className="bg-amber-500/5 pb-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Siren className="size-4 text-amber-600" /> Pending Alert Approvals
                  </span>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30">
                    {alerts.filter((a) => a.severity === 'high').length} pending
                  </Badge>
                </CardTitle>
                <CardDescription>Authorize high-priority district health advisories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {alerts.filter((a) => a.severity === 'high').length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1" />
                    All district alerts reviewed & approved.
                  </div>
                ) : (
                  alerts
                    .filter((a) => a.severity === 'high')
                    .map((a) => (
                      <div key={a.id} className="rounded-lg border border-border p-3 space-y-2">
                        <p className="font-semibold text-xs text-foreground">{a.title}</p>
                        <p className="text-[11px] text-muted-foreground">{a.body}</p>
                        <Button
                          size="sm"
                          variant="default"
                          className="w-full h-7 text-xs font-bold gap-1 cursor-pointer"
                          onClick={() => handleApproveAlert(a.id, a.title)}
                        >
                          <CheckCircle2 className="size-3" /> Authorize & Broadcast Advisory
                        </Button>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resource Pre-Positioning</CardTitle>
                <CardDescription>Medical supplies for high-risk zones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.slice(0, 3).map((r) => (
                  <div key={r.resource} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>{r.resource}</span>
                      <span>{r.current} / {r.required} {r.unit}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-amber-500 transition-all"
                        style={{ width: `${Math.round((r.current / r.required) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="size-4 text-primary" /> District Disease Hotspot Surveillance Map
            </CardTitle>
          </CardHeader>
          <CardContent>
            <HotspotMap height={380} zoom={9} center={[26.75, 94.2]} />
          </CardContent>
        </Card>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // SECTION 2: MAP VIEW
  // ---------------------------------------------------------------------------
  if (section === 'map') {
    return (
      <div className="space-y-6">
        <SectionHeader title="District Disease & Water Hotspot Map" description="Geospatial distribution of confirmed cases and contaminated water bodies." />
        <Card className="glass-card shadow-xl p-2">
          <HotspotMap height={550} zoom={10} center={[26.75, 94.2]} />
        </Card>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // SECTION 3: AI PREDICTIONS
  // ---------------------------------------------------------------------------
  if (section === 'ai') {
    return (
      <div className="space-y-6">
        <SectionHeader title="AI Outbreak Predictions & Risk Engine" description="Machine learning early warning models trained on rainfall, water quality, and case velocity." />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {AI_PREDICTIONS.map((p) => (
            <AiPredictionCard key={p.id} prediction={p} />
          ))}
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // SECTION 4: RESOURCES (WITH INTERACTIVE REALLOCATION MODAL)
  // ---------------------------------------------------------------------------
  if (section === 'resources') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Medical Resource Allocation & Stock Monitoring" description="Forecasted hospital beds, ORS packets, IV fluids, and emergency transport across Jorhat District." />
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((r) => (
            <Card key={r.resource} className="glass-card shadow-lg transition-all hover:border-primary/40">
              <CardHeader className="pb-2 border-b border-border/40">
                <CardTitle className="text-base font-extrabold">{r.resource}</CardTitle>
                <CardDescription className="text-xs font-semibold">Target Requirement: {r.required} {r.unit}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="text-3xl font-black text-foreground flex items-baseline justify-between">
                  <span>{r.current}</span>
                  <span className="text-xs text-muted-foreground font-bold">{r.unit} available</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase">
                    <span>Reserve Capacity</span>
                    <span>{Math.round((r.current / r.required) * 100)}%</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500", (r.current / r.required) < 0.5 ? "bg-rose-500" : "bg-primary")}
                      style={{ width: `${Math.min(100, Math.round((r.current / r.required) * 100))}%` }}
                    />
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full text-xs gap-1.5 font-extrabold border-primary/30 text-primary hover:bg-primary/10 rounded-xl cursor-pointer"
                  onClick={() => handleOpenReallocate(r)}
                >
                  <Truck className="size-3.5 text-primary" /> Reallocate Stock
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* INTERACTIVE REALLOCATION DIALOG MODAL */}
        <Dialog open={reallocateModalOpen} onOpenChange={setReallocateModalOpen}>
          <DialogContent className="max-w-md glass-card border-primary/30">
            <DialogHeader>
              <DialogTitle className="text-base font-black flex items-center gap-2">
                <Truck className="size-5 text-primary" /> Reallocate {selectedResource?.resource}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Transfer reserve inventory to high-risk outbreak sub-divisions.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConfirmReallocate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="font-bold text-xs">Source Reserve</Label>
                <Input value={`Jorhat Central District Reserve (${selectedResource?.current} ${selectedResource?.unit} available)`} disabled className="h-9 text-xs bg-muted/40 font-semibold" />
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-xs">Destination Facility / Sub-Division</Label>
                <Select value={targetFacility} onValueChange={(v) => v && setTargetFacility(v)}>
                  <SelectTrigger className="h-9 text-xs rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Majuli CHC" className="text-xs">Majuli Community Health Center</SelectItem>
                    <SelectItem value="Teok PHC" className="text-xs">Teok Primary Health Center</SelectItem>
                    <SelectItem value="Titabor PHC" className="text-xs">Titabor Primary Health Center</SelectItem>
                    <SelectItem value="Mariani PHC" className="text-xs">Mariani Primary Health Center</SelectItem>
                    <SelectItem value="Kamalabari Field Clinic" className="text-xs">Kamalabari Outbreak Camp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="font-bold text-xs">Reallocation Quantity ({selectedResource?.unit})</Label>
                <Input
                  type="number"
                  min="1"
                  max={selectedResource?.current || 100}
                  value={reallocateQty}
                  onChange={(e) => setReallocateQty(e.target.value)}
                  required
                  className="h-9 text-xs rounded-xl font-bold"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setReallocateModalOpen(false)} className="text-xs font-bold rounded-xl cursor-pointer">
                  Cancel
                </Button>
                <Button type="submit" className="text-xs font-black gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer shadow-md">
                  <Truck className="size-3.5" /> Dispatch Transfer Order
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // SECTION 5: APPROVE ALERTS (DEDICATED ADVISORY BROADCAST HUB)
  // ---------------------------------------------------------------------------
  if (section === 'alerts' || section === 'approve-alerts') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Approve District Health Alerts & Advisories" description="Authorize pending health advisories and broadcast emergency directives across SMS, Portal, and IDSP." />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT: Create New Public Advisory (5 Cols) */}
          <div className="lg:col-span-5">
            <Card className="glass-card shadow-lg border-primary/20">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base flex items-center gap-2 font-extrabold">
                  <Siren className="size-4 text-primary" /> Issue Official Advisory
                </CardTitle>
                <CardDescription className="text-xs">Broadcast urgent directives directly to citizens or staff.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleCreateAdvisory} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Advisory Title</Label>
                    <Input
                      placeholder="e.g. Boil Water Order — Majuli"
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                      required
                      className="h-9 text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Directives & Public Notice</Label>
                    <Textarea
                      placeholder="Boil all drinking water for at least 1 minute. Free chlorine tablets available at Garamur PHC."
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      rows={3}
                      required
                      className="text-xs rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs">Target Audience</Label>
                    <Select value={customAudience} onValueChange={(v: any) => v && setCustomAudience(v)}>
                      <SelectTrigger className="h-9 text-xs rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="citizen" className="text-xs">Public Citizens (SMS & Citizen Portal)</SelectItem>
                        <SelectItem value="government" className="text-xs">Official Health Staff (ASHA, Doctors, Lab)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-10 rounded-xl cursor-pointer">
                    <Send className="size-4" /> Authorize & Broadcast
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Alert Approval Ledger (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base font-extrabold flex items-center gap-2">
                    <Bell className="size-4 text-amber-500" /> Active & Pending Alert Queue
                  </CardTitle>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/30 font-extrabold text-xs">
                    {alerts.length} Total
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {alerts.map((a) => (
                  <div key={a.id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2.5 transition-all hover:border-primary/30">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <p className="font-extrabold text-sm text-foreground">{a.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.body}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full shrink-0",
                          a.severity === 'high' ? "bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                        )}
                      >
                        {a.severity === 'high' ? 'PENDING APPROVAL' : 'AUTHORIZED'}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground pt-2 border-t border-border/40">
                      <span>Audience: {a.audience.toUpperCase()} · Time: {a.time}</span>
                      {a.severity === 'high' && (
                        <Button
                          size="sm"
                          variant="default"
                          className="h-7 text-xs font-black gap-1.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl cursor-pointer"
                          onClick={() => handleApproveAlert(a.id, a.title)}
                        >
                          <CheckCircle2 className="size-3.5" /> Authorize & Broadcast
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // ---------------------------------------------------------------------------
  // SECTION 6: REPORTS (DEDICATED DISTRICT SURVEILLANCE REPORTS HUB)
  // ---------------------------------------------------------------------------
  if (section === 'reports') {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="District Epidemiological & Water Quality Reports"
          description="Consolidated registry of verified disease cases, water contamination logs, and laboratory outcomes."
          action={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 font-bold shadow-xs cursor-pointer"
              onClick={() => toast.success('Exporting Official District Report (PDF/CSV)...', { description: 'Generated SHA-256 verified epidemiological summary.' })}
            >
              <Download className="size-4 text-primary" /> Export District Surveillance Report
            </Button>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Disease Case Reports Table (7 Cols) */}
          <div className="lg:col-span-7">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <FileText className="size-4 text-primary" /> Clinical Disease Reports Registry
                </CardTitle>
                <CardDescription className="text-xs">Live feeds from Citizen, ASHA, and Hospital portals.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {reports.map((r) => (
                  <div key={r.id} className="rounded-2xl border border-border bg-muted/10 p-3.5 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-extrabold text-sm text-foreground">{r.patient}</p>
                        <p className="text-xs text-muted-foreground">{r.village} · Reported {r.reportedAt} by {r.source}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                          r.status === 'confirmed' ? "bg-rose-500/10 text-rose-600 border-rose-500/30" : "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        )}
                      >
                        {r.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                      <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md text-[11px]">{r.disease}</span>
                      <span className="text-muted-foreground font-semibold">Symptoms: {r.symptoms.join(', ')}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Water Source Testing Logs (5 Cols) */}
          <div className="lg:col-span-5">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold flex items-center gap-2">
                  <Droplets className="size-4 text-cyan-500" /> PHED Water Source Test Ledger
                </CardTitle>
                <CardDescription className="text-xs">Bacterial count (CFU) & residual chlorine.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {waterSources.map((w) => (
                  <div key={w.id} className="rounded-2xl border border-border bg-muted/10 p-3.5 space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-extrabold text-sm text-foreground">{w.name}</p>
                      <Badge
                        variant="outline"
                        className={w.risk === 'high' ? "bg-rose-500/10 text-rose-600 border-rose-500/30 font-bold text-xs" : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 font-bold text-xs"}
                      >
                        {w.bacteria} CFU
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold text-muted-foreground">
                      <div>pH: <b className="text-foreground">{w.ph}</b></div>
                      <div>Turb: <b className="text-foreground">{w.turbidity} NTU</b></div>
                      <div>Chlor: <b className="text-foreground">{w.chlorine} mg/L</b></div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  // Fallback View
  return (
    <div className="space-y-6">
      <SectionHeader title="District Health Officer Dashboard" description="Surveillance analytics and administrative control." />
      <CasesByBlockChart />
    </div>
  )
}
