'use client'

import { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Droplets,
  FlaskConical,
  Microscope,
  PlusCircle,
  Upload,
  Activity,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { WATER_SOURCES, type WaterSource } from '@/lib/data'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export function LabDashboard({ section }: { section: string }) {
  const [waterSamples, setWaterSamples] = useState<WaterSource[]>(WATER_SOURCES)

  useEffect(() => {
    let active = true
    const fetchWaterTests = async () => {
      try {
        const res = await fetch('/api/water-tests')
        const data = await res.json()
        if (active && res.ok && data.waterSources) {
          setWaterSamples(data.waterSources)
        }
      } catch (err) {
        console.error('Error fetching lab water tests:', err)
      }
    }
    fetchWaterTests()
    return () => {
      active = false
    }
  }, [])

  const [sampleId, setSampleId] = useState('')
  const [patient, setPatient] = useState('')
  const [testType, setTestType] = useState('Stool Culture & PCR')
  const [pathogen, setPathogen] = useState('Vibrio cholerae O1')
  const [result, setResult] = useState('Positive')

  const handleUploadLabReport = (e: React.FormEvent) => {
    e.preventDefault()
    if (!sampleId) {
      toast.error('Please enter sample barcode / ID')
      return
    }

    toast.success('Lab Test Report Verified & Uploaded!', {
      description: `Sample #${sampleId}: ${result} for ${pathogen}. Notification dispatched to DHO & Doctor.`,
    })
    setSampleId('')
    setPatient('')
  }

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="District Diagnostic Laboratory Portal"
          description="Jorhat Central Health Lab. Upload microbiological reports, confirm bacterial strains, and test community water samples."
        />

        {/* Dynamic Metric cards with sparklines & targets */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={FlaskConical}
            label="Samples Tested Today"
            value="38"
            hint="Stool & water swabs"
            tone="default"
            sparklineData={[30, 32, 35, 34, 38, 38]}
            progress={76}
          />
          <StatCard
            icon={Microscope}
            label="Confirmed Pathogens"
            value="12"
            hint="V. cholerae & S. typhi"
            tone="danger"
            sparklineData={[8, 10, 9, 12, 11, 12]}
          />
          <StatCard
            icon={Droplets}
            label="Water Samples Analyzed"
            value="6"
            hint="High bacterial count"
            tone="warning"
            sparklineData={[2, 3, 4, 3, 5, 6]}
          />
          <StatCard
            icon={CheckCircle2}
            label="Verification Rate"
            value="98.4%"
            hint="ISO 15189 Certified"
            tone="success"
            progress={98}
          />
        </div>

        {/* DIAGNOSTIC LAB WORKSTATION LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT PANEL: Laboratory Assay Machine (Intake - 6 Cols) */}
          <div className="lg:col-span-6">
            <Card className="glass-card shadow-lg border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base flex items-center gap-2 font-extrabold">
                  <Upload className="size-4 text-primary" /> Laboratory Assay Intake
                </CardTitle>
                <CardDescription className="text-xs">Submit certified microbiological outcomes to Jorhat District registry.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleUploadLabReport} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-bold text-xs text-muted-foreground">Sample Barcode / ID</Label>
                      <Input placeholder="e.g. LAB-8841" value={sampleId} onChange={(e) => setSampleId(e.target.value)} required className="h-10 text-xs rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold text-xs text-muted-foreground">Patient / Source</Label>
                      <Input placeholder="e.g. Household #241" value={patient} onChange={(e) => setPatient(e.target.value)} className="h-10 text-xs rounded-xl" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="font-bold text-xs text-muted-foreground">Diagnostic Assay / Test</Label>
                    <Select value={testType} onValueChange={(v) => v && setTestType(v)}>
                      <SelectTrigger className="h-10 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Stool Culture & PCR" className="text-xs">Stool Culture & Real-Time PCR</SelectItem>
                        <SelectItem value="Water Microbiology Assay" className="text-xs">Water Membrane Filtration (CFU)</SelectItem>
                        <SelectItem value="Typhidot Rapid Test" className="text-xs">Typhidot IgM / IgG Assay</SelectItem>
                        <SelectItem value="Hepatitis Serology" className="text-xs">HBsAg / Anti-HAV IgM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="font-bold text-xs text-muted-foreground">Identified Organism</Label>
                      <Input value={pathogen} onChange={(e) => setPathogen(e.target.value)} className="h-10 text-xs rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-bold text-xs text-muted-foreground">Assay Outcome</Label>
                      <Select value={result} onValueChange={(v) => v && setResult(v)}>
                        <SelectTrigger className="h-10 text-xs rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Positive" className="text-xs">POSITIVE (Detected)</SelectItem>
                          <SelectItem value="Negative" className="text-xs">NEGATIVE (Clear)</SelectItem>
                          <SelectItem value="Inconclusive" className="text-xs">Inconclusive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button type="submit" className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer">
                    <Microscope className="size-4 animate-pulse" /> Certify & Submit Assay Result
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT PANEL: Bacterial Water Quality Log (Ledger - 6 Cols) */}
          <div className="lg:col-span-6">
            <Card className="glass-card shadow-lg border-border/80">
              <CardHeader className="pb-3 border-b border-border/60">
                <CardTitle className="text-base font-extrabold flex items-center gap-1.5">
                  <Activity className="size-4 text-primary" />
                  Water Source Microbiology Log
                </CardTitle>
                <CardDescription className="text-xs">Real-time bacterial colony counts (CFU) across local water wells.</CardDescription>
              </CardHeader>
              
              <CardContent className="pt-4 space-y-3">
                {waterSamples.map((w) => (
                  <div key={w.id} className="rounded-2xl border border-border bg-muted/10 p-4 space-y-2 transition-all hover:border-primary/30">
                    <div className="flex justify-between items-center gap-1">
                      <div>
                        <p className="font-bold text-sm text-foreground">{w.name}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">Village: {w.village} &middot; pH: {w.ph}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={w.risk === 'high' ? 'bg-destructive/10 text-destructive border-destructive/20 font-bold text-xs' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs'}>
                          {w.bacteria} CFU / 100ml
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
                      <span>Tested Date: {w.testedAt}</span>
                      <span className={w.risk === 'high' ? 'text-destructive animate-pulse' : 'text-emerald-500'}>
                        {w.risk === 'high' ? '⚠️ High Outbreak Danger' : '✓ Safe supply'}
                      </span>
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

  return (
    <div className="space-y-6">
      <SectionHeader title="Laboratory Management" description="Pathology testing and report verification." />
      <Card className="p-8 text-center text-muted-foreground text-sm glass-card">
        Select a laboratory section from the sidebar to process samples and certify pathogen tests.
      </Card>
    </div>
  )
}
