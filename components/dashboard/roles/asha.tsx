'use client'

import { useState } from 'react'
import {
  Activity,
  CheckCircle2,
  ClipboardList,
  FileCheck,
  HeartPulse,
  Home,
  MapPin,
  RefreshCw,
  Send,
  UserCheck,
  XCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { DISEASE_REPORTS, VILLAGES, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'

export function AshaDashboard({ section }: { section: string }) {
  const [pendingReports, setPendingReports] = useState<DiseaseReport[]>(
    DISEASE_REPORTS.filter((r) => r.status === 'pending'),
  )
  const [offlineCount, setOfflineCount] = useState(2)
  const [isSyncing, setIsSyncing] = useState(false)

  // Survey state
  const [headName, setHeadName] = useState('')
  const [village, setVillage] = useState('Kamalabari')
  const [familyMembers, setFamilyMembers] = useState('5')
  const [feverCases, setFeverCases] = useState('1')
  const [waterSource, setWaterSource] = useState('Community Tube Well')

  const handleVerify = (id: string, approve: boolean) => {
    setPendingReports((prev) => prev.filter((r) => r.id !== id))
    toast.success(approve ? 'Report verified & forwarded to Doctor' : 'Report flagged as rejected', {
      description: `Report #${id} processed by ASHA Worker.`,
    })
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
    toast.success('Household Survey Saved!', {
      description: `Survey for ${headName || 'Household'} recorded in local offline registry.`,
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={ClipboardList} label="Surveys This Week" value="48" hint="Target: 60 households" tone="default" />
          <StatCard icon={UserCheck} label="Pending Verifications" value={pendingReports.length} hint="Reports awaiting field check" tone="warning" />
          <StatCard icon={Activity} label="Offline Records Queued" value={offlineCount} hint="Saved locally on device" tone="danger" />
          <StatCard icon={HeartPulse} label="High-Risk Households" value="9" hint="ORS & Zinc distributed" tone="danger" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Citizen Reports Pending Verification</span>
                <Badge variant="outline">{pendingReports.length} pending</Badge>
              </CardTitle>
              <CardDescription>Verify symptoms reported by villagers in your assigned block</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingReports.length === 0 ? (
                <div className="text-center py-6 text-xs text-muted-foreground">
                  <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2" />
                  All citizen reports verified! No pending items.
                </div>
              ) : (
                pendingReports.map((r) => (
                  <div key={r.id} className="rounded-lg border border-border p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm">{r.patient}</p>
                        <p className="text-xs text-muted-foreground">{r.village} · {r.reportedAt}</p>
                      </div>
                      <Badge variant="outline" className="border-amber-500/30 text-amber-600 bg-amber-500/10">
                        {r.severity} severity
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reported Symptoms: <span className="font-medium text-foreground">{r.symptoms.join(', ')}</span>
                    </p>
                    <div className="flex gap-2 pt-1">
                      <Button size="sm" variant="default" className="h-7 text-xs gap-1" onClick={() => handleVerify(r.id, true)}>
                        <CheckCircle2 className="size-3" /> Verify & Forward
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs gap-1 text-destructive hover:bg-destructive/10" onClick={() => handleVerify(r.id, false)}>
                        <XCircle className="size-3" /> Reject Report
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Assigned Villages Status</CardTitle>
              <CardDescription>Health surveillance status across assigned villages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {VILLAGES.slice(0, 4).map((v) => (
                <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-semibold text-sm">{v.name}</p>
                    <p className="text-xs text-muted-foreground">{v.activeCases} active cases · Population {v.population}</p>
                  </div>
                  <Badge variant="outline" className={v.risk === 'high' ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}>
                    {v.risk} risk
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (section === 'surveys') {
    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <SectionHeader title="Household Health Survey Form" description="Record door-to-door survey details. Works offline." />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Field Intake Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSurveySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Head of Household Name</Label>
                  <Input placeholder="e.g. Biren Hazarika" value={headName} onChange={(e) => setHeadName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Village</Label>
                  <Input value={village} onChange={(e) => setVillage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Family Size</Label>
                  <Input type="number" value={familyMembers} onChange={(e) => setFamilyMembers(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Active Fever / Diarrhea Cases</Label>
                  <Input type="number" value={feverCases} onChange={(e) => setFeverCases(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Primary Water Source Used</Label>
                <Input value={waterSource} onChange={(e) => setWaterSource(e.target.value)} />
              </div>
              <Button type="submit" className="w-full gap-2 font-bold">
                <Send className="size-4" /> Save Survey Record
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (section === 'sync') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto text-center">
        <SectionHeader title="Offline Data Synchronization" description="Sync locally saved field surveys when internet connectivity is available." />
        <Card className="p-6 space-y-4">
          <div className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary mx-auto">
            <Activity className="size-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Offline Queue Status</h3>
            <p className="text-xs text-muted-foreground mt-1">
              You have <span className="font-bold text-foreground">{offlineCount}</span> survey records stored locally on your mobile device.
            </p>
          </div>
          <Button onClick={handleSyncOffline} disabled={isSyncing || offlineCount === 0} className="gap-2 font-bold px-6">
            {isSyncing ? <RefreshCw className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
            Sync Offline Records Now
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="ASHA Worker Section" description="Manage assigned village health monitoring." />
      <Card className="p-6 text-center text-muted-foreground text-sm">
        Select a section from the left sidebar to manage field surveys, report verifications, and offline sync.
      </Card>
    </div>
  )
}
