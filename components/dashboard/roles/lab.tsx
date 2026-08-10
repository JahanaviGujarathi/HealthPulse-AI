'use client'

import { useState } from 'react'
import {
  Beaker,
  CheckCircle2,
  Droplets,
  FileText,
  FlaskConical,
  Microscope,
  PlusCircle,
  Search,
  Upload,
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

export function LabDashboard({ section }: { section: string }) {
  const [waterSamples, setWaterSamples] = useState<WaterSource[]>(WATER_SOURCES)
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={FlaskConical} label="Samples Tested Today" value="38" hint="Stool & water swabs" tone="default" />
          <StatCard icon={Microscope} label="Confirmed Pathogens" value="12" hint="V. cholerae & S. typhi" tone="danger" />
          <StatCard icon={Droplets} label="Water Samples Analyzed" value="6" hint="High bacterial count" tone="warning" />
          <StatCard icon={CheckCircle2} label="Verification Rate" value="98.4%" hint="ISO 15189 Certified" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Upload className="size-4 text-primary" /> Upload Lab Test Verification
              </CardTitle>
              <CardDescription>Record confirmed pathogen lab results into surveillance system</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUploadLabReport} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Sample Barcode / ID</Label>
                    <Input placeholder="e.g. LAB-8841" value={sampleId} onChange={(e) => setSampleId(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Patient / Source Name</Label>
                    <Input placeholder="e.g. Household #241" value={patient} onChange={(e) => setPatient(e.target.value)} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Diagnostic Assay / Test</Label>
                  <Select value={testType} onValueChange={(v) => v && setTestType(v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stool Culture & PCR">Stool Culture & Real-Time PCR</SelectItem>
                      <SelectItem value="Water Microbiology Assay">Water Membrane Filtration (CFU)</SelectItem>
                      <SelectItem value="Typhidot Rapid Test">Typhidot IgM / IgG Assay</SelectItem>
                      <SelectItem value="Hepatitis Serology">HBsAg / Anti-HAV IgM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Identified Organism</Label>
                    <Input value={pathogen} onChange={(e) => setPathogen(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Assay Outcome</Label>
                    <Select value={result} onValueChange={(v) => v && setResult(v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Positive">POSITIVE (Pathogen Detected)</SelectItem>
                        <SelectItem value="Negative">NEGATIVE (Clear)</SelectItem>
                        <SelectItem value="Inconclusive">Inconclusive (Retest)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full gap-2 font-bold shadow-md">
                  <Microscope className="size-4" /> Certify & Submit Lab Result
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Microbiological Water Test Log</CardTitle>
              <CardDescription>Bacterial culture counts across water sources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {waterSamples.map((w) => (
                <div key={w.id} className="rounded-lg border border-border p-3 space-y-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-sm">{w.name}</p>
                    <Badge variant="outline" className={w.risk === 'high' ? 'bg-destructive/10 text-destructive' : 'bg-emerald-500/10 text-emerald-600'}>
                      {w.bacteria} CFU / 100ml
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Village: {w.village} · pH: {w.ph} · Tested: {w.testedAt}
                  </p>
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
      <SectionHeader title="Laboratory Management" description="Pathology testing and report verification." />
      <Card className="p-6 text-center text-muted-foreground text-sm">
        Select a laboratory section from the sidebar to process samples and certify pathogen tests.
      </Card>
    </div>
  )
}
