'use client'

import { useState, useEffect } from 'react'
import {
  AlertTriangle,
  Beaker,
  CheckCircle2,
  Droplets,
  MapPin,
  PlusCircle,
  Send,
  Sparkles,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { WaterQualityChart } from '@/components/dashboard/charts'
import { WATER_SOURCES, type WaterSource } from '@/lib/data'
import { toast } from 'sonner'
import { sanitizeInput } from '@/lib/security'

export function WaterDashboard({ section }: { section: string }) {
  const [sources, setSources] = useState<WaterSource[]>(WATER_SOURCES)

  useEffect(() => {
    let active = true
    const fetchWaterTests = async () => {
      try {
        const res = await fetch('/api/water-tests')
        const data = await res.json()
        if (active && res.ok && data.waterSources) {
          setSources(data.waterSources)
        }
      } catch (err) {
        console.error('Error fetching water tests:', err)
      }
    }
    fetchWaterTests()
    return () => {
      active = false
    }
  }, [])

  // Form state
  const [name, setName] = useState('')
  const [village, setVillage] = useState('Kamalabari')
  const [ph, setPh] = useState('6.2')
  const [turbidity, setTurbidity] = useState('11.5')
  const [chlorine, setChlorine] = useState('0.10')
  const [bacteria, setBacteria] = useState('450')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleUploadTest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      toast.error('Please enter water source name')
      return
    }

    setIsSubmitting(true)

    // OWASP A03 Input Sanitization
    const cleanName = sanitizeInput(name)
    const cleanVillage = sanitizeInput(village)

    try {
      const res = await fetch('/api/water-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cleanName,
          village: cleanVillage,
          ph: Number(ph),
          turbidity: Number(turbidity),
          chlorine: Number(chlorine),
          bacteria: Number(bacteria),
          role: 'water-officer',
          testerName: 'Priya Sen (PHED)',
        }),
      })

      const data = await res.json()
      if (res.ok && data.waterSource) {
        setSources([data.waterSource, ...sources])
        toast.success('Water Test Uploaded & Analyzed!', {
          description: `Logged sample for ${data.waterSource.name}. Risk status: ${data.waterSource.risk.toUpperCase()}`,
        })
        setName('')
      } else {
        toast.error(data.error || 'Failed to record water test')
      }
    } catch (err) {
      toast.error('Network error uploading test')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDispatchChlorination = (sourceName: string) => {
    toast.success(`Chlorination Unit Dispatched to ${sourceName}!`, {
      description: 'PHED Mobile Chemical Decontamination vehicle dispatched with bleaching powder & chlorine tablets.',
    })
  }

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="Water Quality & Safety Operations — Priya Sen"
          description="Public Health Engineering Department (PHED), Jorhat. Monitor pH, turbidity, residual chlorine, and bacterial contamination."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Droplets} label="Water Sources Monitored" value={sources.length} hint="Community wells & intakes" tone="default" />
          <StatCard icon={AlertTriangle} label="Contaminated Sources" value={sources.filter((s) => s.risk === 'high').length} hint="Exceeds safety thresholds" tone="danger" />
          <StatCard icon={Beaker} label="Avg Residual Chlorine" value="0.3 mg/L" hint="Min target: 0.5 mg/L" tone="warning" />
          <StatCard icon={CheckCircle2} label="Chlorination Dispatched" value="5 Units" hint="Active mobile teams" tone="success" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <WaterQualityChart />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="size-4 text-destructive" /> Critical Source Alerts
              </CardTitle>
              <CardDescription>Sources requiring immediate decontamination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sources
                .filter((s) => s.risk === 'high')
                .map((s) => (
                  <div key={s.id} className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-sm text-destructive">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.village} · {s.testedAt}</p>
                      </div>
                      <Badge variant="destructive" className="text-[10px]">
                        HIGH RISK
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[11px] text-muted-foreground">
                      <span>Bacteria: <b className="text-destructive">{s.bacteria} CFU</b></span>
                      <span>Chlorine: <b className="text-destructive">{s.chlorine} mg/L</b></span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="w-full h-7 text-xs gap-1.5 font-bold"
                      onClick={() => handleDispatchChlorination(s.name)}
                    >
                      <Truck className="size-3" /> Dispatch Chlorination Unit
                    </Button>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (section === 'test') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <SectionHeader title="Upload Water Quality Test" description="Log physical, chemical, and microbiological readings from field testing kits." />

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-base flex items-center gap-2">
              <Beaker className="size-5 text-primary" /> PHED Water Field Intake Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUploadTest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Water Source Name</Label>
                  <Input placeholder="e.g. Kamalabari Well #2" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Village / Block</Label>
                  <Input value={village} onChange={(e) => setVillage(e.target.value)} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label>pH Level</Label>
                  <Input value={ph} onChange={(e) => setPh(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Turbidity (NTU)</Label>
                  <Input value={turbidity} onChange={(e) => setTurbidity(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Free Chlorine (mg/L)</Label>
                  <Input value={chlorine} onChange={(e) => setChlorine(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Bacteria (CFU/100ml)</Label>
                  <Input value={bacteria} onChange={(e) => setBacteria(e.target.value)} />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 py-5 font-bold shadow-md">
                <Send className="size-4" /> Log Water Test & Trigger AI Evaluation
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Water Testing Section" description="Quality monitoring and risk predictions." />
      <WaterQualityChart />
    </div>
  )
}
