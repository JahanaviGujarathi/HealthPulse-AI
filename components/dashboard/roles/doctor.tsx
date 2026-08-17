'use client'

import { useState, useEffect } from 'react'
import {
  Activity,
  BarChart3,
  Bell,
  CheckCircle2,
  ClipboardList,
  FilePlus,
  Home,
  PlusCircle,
  Stethoscope,
  UserCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { CaseTrendChart } from '@/components/dashboard/charts'
import { DISEASE_REPORTS, DISEASES, HOSPITALS, type DiseaseReport } from '@/lib/data'
import { toast } from 'sonner'

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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Stethoscope} label="Confirmed Cases Today" value="14" hint="Uploaded to registry" tone="danger" />
          <StatCard icon={Activity} label="Hospital Bed Occupancy" value="83%" hint="266 of 320 beds filled" tone="warning" />
          <StatCard icon={UserCheck} label="Recoveries This Week" value="39" hint="Discharged patients" tone="success" />
          <StatCard icon={Bell} label="Active Outbreak Alerts" value="2" hint="Kamalabari & Teok" tone="danger" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <CaseTrendChart title="Clinical Disease Outbreak Trend" description="14-day confirmed disease trajectories" />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hospital Capacity</CardTitle>
              <CardDescription>Emergency bed status in block hospitals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {HOSPITALS.map((h) => (
                <div key={h.id} className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{h.name}</p>
                    <Badge variant="outline">{h.bedsAvailable} beds free</Badge>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${Math.round(((h.beds - h.bedsAvailable) / h.beds) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (section === 'cases') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Log Confirmed Disease Case" description="Record verified clinical diagnoses to update district outbreak models." />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1 border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <PlusCircle className="size-4 text-primary" /> Confirmed Case Entry
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddCase} className="space-y-4">
                <div className="space-y-2">
                  <Label>Patient Name / ID</Label>
                  <Input placeholder="e.g. Biren Saikia (Pt #904)" value={patient} onChange={(e) => setPatient(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Diagnosed Disease</Label>
                  <Select value={disease} onValueChange={(v) => v && setDisease(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DISEASES.map((d) => (
                        <SelectItem key={d} value={d}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Patient Village</Label>
                  <Input value={village} onChange={(e) => setVillage(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Clinical Severity</Label>
                  <Select value={severity} onValueChange={(v: any) => v && setSeverity(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High (Admitted to ICU / IV fluids)</SelectItem>
                      <SelectItem value="medium">Medium (General Ward)</SelectItem>
                      <SelectItem value="low">Low (Outpatient ORS)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full gap-2 font-bold">
                  <FilePlus className="size-4" /> Upload Confirmed Case
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Confirmed Cases Ledger</CardTitle>
              <CardDescription>Recent clinical submissions in Jorhat District</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {cases.map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <p className="font-semibold text-sm">{c.patient}</p>
                    <p className="text-xs text-muted-foreground">{c.village} · {c.reportedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-bold text-primary">{c.disease}</Badge>
                    <Badge variant="outline" className={c.severity === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-amber-500/10 text-amber-600'}>
                      {c.severity} severity
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Doctor Clinical View" description="Clinical analytics and trends." />
      <CaseTrendChart />
    </div>
  )
}
