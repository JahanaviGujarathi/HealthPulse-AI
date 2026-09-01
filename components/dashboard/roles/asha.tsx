'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  HeartPulse,
  RefreshCw,
  Send,
  UserCheck,
  XCircle,
  AlertTriangle,
  User,
  MapPin,
  Clock,
  BriefcaseMedical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { DISEASE_REPORTS, VILLAGES, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function AshaDashboard({ section }: { section: string }) {
  const [pendingReports, setPendingReports] = useState<DiseaseReport[]>(
    DISEASE_REPORTS.filter((r) => r.status === 'pending'),
  )

  useEffect(() => {
    let active = true
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports?role=asha')
        const data = await res.json()
        if (active && res.ok && data.reports) {
          setPendingReports(data.reports.filter((r: any) => r.status === 'pending'))
        }
      } catch (err) {
        console.error('Error fetching ASHA pending reports:', err)
      }
    }
    fetchReports()
    return () => {
      active = false
    }
  }, [])

  const [offlineCount, setOfflineCount] = useState(2)
  const [isSyncing, setIsSyncing] = useState(false)
  const [expandedReportId, setExpandedReportId] = useState<string | null>(null)

  // Survey state
  const [headName, setHeadName] = useState('')
  const [village, setVillage] = useState('Kamalabari')
  const [familyMembers, setFamilyMembers] = useState('5')
  const [feverCases, setFeverCases] = useState('1')
  const [waterSource, setWaterSource] = useState('Community Tube Well')

  const handleVerify = async (id: string, approve: boolean) => {
    try {
      const res = await fetch('/api/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: approve ? 'confirmed' : 'rejected',
        }),
      })

      if (res.ok) {
        setPendingReports((prev) => prev.filter((r) => r.id !== id))
        if (expandedReportId === id) setExpandedReportId(null)
        toast.success(approve ? 'Report verified & forwarded to Doctor' : 'Report flagged as rejected', {
          description: `Report #${id} processed by ASHA Worker.`,
        })
      } else {
        toast.error('Failed to update report status in database')
      }
    } catch (err) {
      toast.error('Network error processing verification')
    }
  }

  const handleSyncOffline = () => {
    setIsSyncing(true)
    setTimeout(() => {
      setOfflineCount(0)
      setIsSyncing(false)
      toast.success('Offline records synced with central database successfully!')
    }, 800)
  }

  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOfflineCount(offlineCount + 1)
    toast.success('Household Survey Saved Offline!', {
      description: `Survey for ${headName || 'Household'} recorded in local offline buffer.`,
    })
    setHeadName('')
    setFeverCases('0')
  }

  if (section === 'overview') {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="ASHA Field Operations Hub"
          description="Assigned area: 4 villages in Jorhat District. Monitor health surveys, verify citizen reports, and sync offline records."
        />

        {/* Dynamic Metric Cards with inline weekly sparklines & target progress indicators */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={ClipboardList}
            label="Surveys This Week"
            value="48"
            hint="Target: 60 households"
            tone="default"
            sparklineData={[35, 38, 40, 42, 45, 48]}
            progress={80}
          />
          <StatCard
            icon={UserCheck}
            label="Pending Verifications"
            value={pendingReports.length}
            hint="Reports awaiting field check"
            tone="warning"
            sparklineData={[12, 10, 8, 9, 6, pendingReports.length]}
          />
          <StatCard
            icon={Activity}
            label="Offline Records Queued"
            value={offlineCount}
            hint="Saved locally on device"
            tone={offlineCount > 0 ? "danger" : "success"}
            sparklineData={[0, 1, 3, 2, offlineCount]}
          />
          <StatCard
            icon={HeartPulse}
            label="High-Risk Households"
            value="9"
            hint="ORS & Zinc distributed"
            tone="danger"
            sparklineData={[4, 6, 8, 7, 9, 9]}
            progress={90}
          />
        </div>

        {/* 3-COLUMN WORKSTATION LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* COLUMN 1: Verification Hub (Left - 5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-extrabold flex items-center gap-1.5">
                    <UserCheck className="size-4 text-primary" />
                    Symptom Verification Hub
                  </CardTitle>
                  <Badge variant="outline" className="border-primary/30 text-primary bg-primary/5 font-black text-xs">
                    {pendingReports.length} reports
                  </Badge>
                </div>
                <CardDescription className="text-xs">Click any entry to inspect diagnostic details and verification actions.</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-3">
                {pendingReports.length === 0 ? (
                  <div className="text-center py-10 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-10 mx-auto text-emerald-500 mb-2 animate-bounce" />
                    <p className="font-extrabold text-foreground">All citizen reports verified!</p>
                    <p className="text-muted-foreground mt-0.5">No pending items in your district block.</p>
                  </div>
                ) : (
                  pendingReports.map((r) => {
                    const isExpanded = expandedReportId === r.id
                    return (
                      <div 
                        key={r.id} 
                        className={cn(
                          "rounded-2xl border transition-all duration-300 p-4 space-y-3 cursor-pointer",
                          isExpanded 
                            ? "bg-card border-primary/40 shadow-md ring-1 ring-primary/20" 
                            : "bg-muted/10 border-border/80 hover:border-primary/20 hover:bg-muted/30"
                        )}
                        onClick={() => setExpandedReportId(isExpanded ? null : r.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                              <User className="size-4" />
                            </div>
                            <div>
                              <p className="font-extrabold text-sm text-foreground">{r.patient}</p>
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5 font-bold">
                                <MapPin className="size-3" /> {r.village}
                              </p>
                            </div>
                          </div>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                              r.severity === 'high' 
                                ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                            )}
                          >
                            {r.severity} severity
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground font-semibold">
                          Symptoms: <span className="text-foreground">{r.symptoms.join(', ')}</span>
                        </p>

                        {/* Collapsible expanded medical drawer */}
                        {isExpanded && (
                          <div className="pt-3 border-t border-border/60 space-y-3 text-xs animate-in fade-in" onClick={(e) => e.stopPropagation()}>
                            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-muted-foreground">
                              <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <span>Reported: {r.reportedAt}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <BriefcaseMedical className="size-3.5" />
                                <span>Source: Aadhaar Portal</span>
                              </div>
                            </div>
                            
                            <div className="p-2.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold leading-relaxed">
                              💡 ASHA Instruction: Visit household, check for dehydration symptoms, distribute ORS, and certify.
                            </div>

                            <div className="flex gap-2 pt-1">
                              <Button 
                                size="sm" 
                                className="h-8 text-xs gap-1 font-black bg-primary hover:bg-primary/95 text-primary-foreground rounded-xl flex-1 cursor-pointer"
                                onClick={() => handleVerify(r.id, true)}
                              >
                                <CheckCircle2 className="size-3.5" /> Verify & Forward
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-8 text-xs gap-1 font-black text-destructive hover:bg-destructive/10 border-destructive/20 rounded-xl cursor-pointer"
                                onClick={() => handleVerify(r.id, false)}
                              >
                                <XCircle className="size-3.5" /> Reject
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </CardContent>
            </Card>
          </div>

          {/* COLUMN 2: Village Health Grid (Middle - 4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-base font-extrabold">Village Surveillance Grid</CardTitle>
                <CardDescription className="text-xs">Active infections and critical resource needs.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {VILLAGES.slice(0, 4).map((v) => (
                  <div key={v.id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-3 transition-all hover:border-primary/30">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-sm text-foreground">{v.name}</p>
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                          v.risk === 'high' 
                            ? 'bg-rose-500/10 text-rose-600 border-rose-500/30 animate-pulse'
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        )}
                      >
                        {v.risk} risk
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-bold uppercase">Active Cases</span>
                        <span className="font-black text-foreground">{v.activeCases} Cases</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-muted-foreground block font-bold uppercase">ORS Stock</span>
                        <span className={cn(
                          "font-black",
                          v.activeCases > 5 ? "text-destructive" : "text-emerald-500"
                        )}>
                          {v.activeCases > 5 ? "LOW" : "OK"}
                        </span>
                      </div>
                    </div>

                    {/* Progress to safety target */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] text-muted-foreground font-bold uppercase">
                        <span>Safe Water Index</span>
                        <span className="text-foreground">{v.risk === 'high' ? '45%' : '84%'}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full transition-all",
                            v.risk === 'high' ? 'bg-rose-500' : 'bg-emerald-500'
                          )}
                          style={{ width: v.risk === 'high' ? '45%' : '84%' }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* COLUMN 3: Clipboard Survey & Sync Telemetry (Right - 3 Cols) */}
          <div className="lg:col-span-3 space-y-4">
            
            {/* Telemetry Sync Station */}
            <Card className="glass-card shadow-lg bg-primary/5">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-extrabold flex items-center gap-1.5">
                  <Activity className="size-4 text-primary animate-pulse" />
                  Sync Telemetry
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4 text-center">
                <div className="space-y-1 text-xs">
                  <span className="text-2xl font-black text-foreground">{offlineCount}</span>
                  <p className="text-muted-foreground font-bold text-[10px] uppercase">Queued locally on device</p>
                </div>
                <Button 
                  onClick={handleSyncOffline} 
                  disabled={isSyncing || offlineCount === 0} 
                  className="w-full gap-2 font-black text-xs h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/20"
                >
                  {isSyncing ? <RefreshCw className="size-3.5 animate-spin" /> : <RefreshCw className="size-3.5" />}
                  Sync Records
                </Button>
              </CardContent>
            </Card>

            {/* Clipboard Survey Form */}
            <Card className="glass-card shadow-lg">
              <CardHeader className="pb-3 border-b border-border/40">
                <CardTitle className="text-sm font-extrabold">Medical Clipboard</CardTitle>
                <CardDescription className="text-xs">File offline household survey.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleSurveySubmit} className="space-y-3.5">
                  <div className="space-y-1.5">
                    <Label className="font-bold text-[10px] text-muted-foreground uppercase">Household Head</Label>
                    <Input placeholder="e.g. Biren Hazarika" value={headName} onChange={(e) => setHeadName(e.target.value)} required className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-[10px] text-muted-foreground uppercase">Active Fever Cases</Label>
                    <Input type="number" value={feverCases} onChange={(e) => setFeverCases(e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-bold text-[10px] text-muted-foreground uppercase">Water Source</Label>
                    <Input value={waterSource} onChange={(e) => setWaterSource(e.target.value)} className="h-9 text-xs rounded-xl" />
                  </div>
                  <Button type="submit" className="w-full gap-1.5 font-black text-xs h-10 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground rounded-xl cursor-pointer">
                    <Send className="size-3.5" /> Save Record
                  </Button>
                </form>
              </CardContent>
            </Card>

          </div>

        </div>
      </div>
    )
  }

  // Survey View
  if (section === 'surveys') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <SectionHeader title="Household Health Survey Form" description="Record door-to-door survey details. Works offline." />
        <Card className="glass-card shadow-lg">
          <CardHeader>
            <CardTitle className="text-base font-extrabold">Field Intake Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSurveySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-muted-foreground">Head of Household Name</Label>
                  <Input placeholder="e.g. Biren Hazarika" value={headName} onChange={(e) => setHeadName(e.target.value)} required className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-muted-foreground">Village</Label>
                  <Input value={village} onChange={(e) => setVillage(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-muted-foreground">Family Size</Label>
                  <Input type="number" value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="font-bold text-xs text-muted-foreground">Active Fever / Diarrhea Cases</Label>
                  <Input type="number" value={feverCases} onChange={(e) => setFeverCases(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-xs text-muted-foreground">Primary Water Source Used</Label>
                <Input value={waterSource} onChange={(e) => setWaterSource(e.target.value)} className="h-10 text-xs rounded-xl" />
              </div>
              <Button type="submit" className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer">
                <Send className="size-4" /> Save Survey Record
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Sync View
  if (section === 'sync') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-center">
        <SectionHeader title="Offline Data Synchronization" description="Sync locally saved field surveys when internet connectivity is available." />
        <Card className="p-8 space-y-6 glass-card shadow-lg">
          <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary mx-auto animate-pulse-glow">
            <Activity className="size-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-lg font-black text-foreground">Offline Queue Status</h3>
            <p className="text-xs text-muted-foreground">
              You have <span className="font-bold text-foreground bg-primary/15 px-2 py-0.5 rounded-md">{offlineCount}</span> survey records stored locally on your mobile device.
            </p>
          </div>
          <Button onClick={handleSyncOffline} disabled={isSyncing || offlineCount === 0} className="gap-2 font-black px-8 h-11 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl cursor-pointer shadow-md shadow-primary/15">
            {isSyncing ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Sync Offline Records Now
          </Button>
        </Card>
      </div>
    )
  }

  // ORS & Zinc Distribution Section View
  if (section === 'ors-distribution' || section === 'inventory') {
    return (
      <div className="space-y-6">
        <SectionHeader title="ORS & Medical Inventory Distribution" description="Track Oral Rehydration Salts, Zinc tablets, and chlorine solution stocks assigned to your block." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card shadow-md p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-bold uppercase">ORS Packets In Hand</p>
            <p className="text-2xl font-black text-emerald-500">120 Packets</p>
            <p className="text-[11px] text-muted-foreground">30 distributed today in Kamalabari</p>
          </Card>
          <Card className="glass-card shadow-md p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-bold uppercase">Zinc Tablets Stock</p>
            <p className="text-2xl font-black text-primary">450 Strips</p>
            <p className="text-[11px] text-muted-foreground font-semibold">Ready for pediatric cases</p>
          </Card>
          <Card className="glass-card shadow-md p-4 space-y-2">
            <p className="text-xs text-muted-foreground font-bold uppercase">Chlorine Tablets</p>
            <p className="text-2xl font-black text-cyan-500">800 Tablets</p>
            <p className="text-[11px] text-muted-foreground font-semibold">For household well purification</p>
          </Card>
        </div>

        <Card className="glass-card shadow-lg p-6 space-y-4">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <HeartPulse className="size-4 text-primary" /> Active Household Distribution Queue
          </h3>
          <div className="space-y-3">
            <div className="rounded-2xl border border-border bg-muted/10 p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Garamur Village — Household #118</p>
                <p className="text-xs text-muted-foreground">5 ORS packets & 2 Zinc strips provided</p>
              </div>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs">DELIVERED</Badge>
            </div>
            <div className="rounded-2xl border border-border bg-muted/10 p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">Kamalabari Village — Household #241</p>
                <p className="text-xs text-muted-foreground">10 ORS packets & 5 Chlorine tablets required</p>
              </div>
              <Button size="sm" variant="default" className="text-xs font-bold gap-1 cursor-pointer" onClick={() => toast.success('ORS & Chlorine Delivered!')}>
                <CheckCircle2 className="size-3.5" /> Deliver Supplies
              </Button>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // Fallback ASHA View
  return (
    <div className="space-y-6">
      <SectionHeader title="ASHA Worker Section" description="Manage assigned village health monitoring." />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Pending Verifications</p>
          <p className="text-2xl font-black text-amber-500">{pendingReports.length} Reports</p>
          <p className="text-[11px] text-muted-foreground font-semibold">Awaiting field check</p>
        </Card>
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Offline Queue</p>
          <p className="text-2xl font-black text-primary">{offlineCount} Surveys</p>
          <p className="text-[11px] text-muted-foreground font-semibold">Stored locally</p>
        </Card>
        <Card className="glass-card shadow-md p-4 space-y-2">
          <p className="text-xs text-muted-foreground font-bold uppercase">Village Coverage</p>
          <p className="text-2xl font-black text-emerald-500">4 / 4 Villages</p>
          <p className="text-[11px] text-muted-foreground font-semibold">Surveillance active</p>
        </Card>
      </div>
    </div>
  )
}
