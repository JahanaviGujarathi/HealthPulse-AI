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
  Activity,
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
import { cn } from '@/lib/utils'

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

        {/* Dynamic Metric cards with sparklines */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Droplets}
            label="Water Sources Monitored"
            value={sources.length}
            hint="Community wells & intakes"
            tone="default"
            sparklineData={[12, 12, 14, 15, 15, sources.length]}
          />
          <StatCard
            icon={AlertTriangle}
            label="Contaminated Sources"
            value={sources.filter((s) => s.risk === 'high').length}
            hint="Exceeds safety thresholds"
            tone="danger"
            sparklineData={[3, 4, 3, 2, 3, sources.filter((s) => s.risk === 'high').length]}
          />
          <StatCard
            icon={Beaker}
            label="Avg Residual Chlorine"
            value="0.3 mg/L"
            hint="Min target: 0.5 mg/L"
            tone="warning"
            sparklineData={[0.35, 0.32, 0.30, 0.28, 0.29, 0.30]}
          />
          <StatCard
            icon={CheckCircle2}
            label="Chlorination Dispatched"
            value="5 Units"
            hint="Active mobile teams"
            tone="success"
            sparklineData={[2, 3, 4, 5, 5, 5]}
          />
        </div>

        {/* WATER CONTROL ROOM WORKSTATION */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
          
          {/* LEFT PANE: Water Quality Chart (8 Cols) */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-1.5 overflow-hidden shadow-xl border-border/80">
            <WaterQualityChart />
          </div>

          {/* RIGHT PANE: Critical Source Alerts (4 Cols) */}
          <div className="lg:col-span-4">
            <Card className="glass-card shadow-xl border-border/80">
              <CardHeader className="pb-3 border-b border-border/40 bg-destructive/5">
                <CardTitle className="text-base flex items-center gap-2 font-extrabold text-destructive">
                  <AlertTriangle className="size-4 animate-pulse" /> Critical Source Alerts
                </CardTitle>
                <CardDescription className="text-xs">Water wells requiring immediate chlorine dosage stabilization.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 max-h-[420px] overflow-y-auto pr-1">
                {sources.filter((s) => s.risk === 'high').length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-8 mx-auto text-emerald-500 mb-2 animate-bounce" />
                    All water sources clean! No active alarms.
                  </div>
                ) : (
                  sources
                    .filter((s) => s.risk === 'high')
                    .map((s) => (
                      <div key={s.id} className="rounded-2xl border border-destructive/20 bg-destructive/10 p-4 space-y-3 transition-all hover:border-destructive/40 animate-glow-red">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-extrabold text-sm text-foreground">{s.name}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5 font-bold uppercase">{s.village} · Tested: {s.testedAt}</p>
                          </div>
                          <Badge variant="destructive" className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                            HIGH RISK
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 text-xs font-bold text-muted-foreground border-y border-destructive/10 py-2">
                          <span>Bacteria: <b className="text-destructive font-black">{s.bacteria} CFU</b></span>
                          <span>Chlorine: <b className="text-destructive font-black">{s.chlorine} mg/L</b></span>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          className="w-full h-8 text-xs gap-1.5 font-black shadow-md rounded-xl cursor-pointer"
                          onClick={() => handleDispatchChlorination(s.name)}
                        >
                          <Truck className="size-3.5 text-white animate-bounce" /> Dispatch Chlorination Unit
                        </Button>
                      </div>
                    ))
                )}
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    )
  }

  // Upload Water test form view
  if (section === 'test') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <SectionHeader title="Upload Water Quality Test" description="Log physical, chemical, and microbiological readings from field testing kits." />

        <Card className="glass-card shadow-lg border-primary/20">
          <CardHeader className="pb-3 border-b border-border/40">
            <CardTitle className="text-base flex items-center gap-2 font-extrabold">
              <Beaker className="size-5 text-primary" /> PHED Water Field Intake Form
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5">
            <form onSubmit={handleUploadTest} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">Water Source Name</Label>
                  <Input placeholder="e.g. Kamalabari Well #2" value={name} onChange={(e) => setName(e.target.value)} required className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">Village / Block</Label>
                  <Input value={village} onChange={(e) => setVillage(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">pH Level</Label>
                  <Input value={ph} onChange={(e) => setPh(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">Turbidity (NTU)</Label>
                  <Input value={turbidity} onChange={(e) => setTurbidity(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">Free Chlorine (mg/L)</Label>
                  <Input value={chlorine} onChange={(e) => setChlorine(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label className="font-bold text-xs text-muted-foreground uppercase">Bacteria (CFU)</Label>
                  <Input value={bacteria} onChange={(e) => setBacteria(e.target.value)} className="h-10 text-xs rounded-xl" />
                </div>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full gap-2 font-black shadow-md shadow-primary/20 bg-gradient-to-r from-primary to-accent hover:from-primary/95 hover:to-accent/95 text-primary-foreground h-11 rounded-xl cursor-pointer">
                <Send className="size-4 animate-pulse" /> Log Water Test & Trigger AI Evaluation
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
      <div className="glass-card rounded-3xl p-3 shadow-lg border-border/80">
        <WaterQualityChart />
      </div>
    </div>
  )
}
