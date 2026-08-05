'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  Landmark,
  Megaphone,
  Send,
  ShieldCheck,
  Siren,
  Truck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { CasesByBlockChart, CaseTrendChart } from '@/components/dashboard/charts'
import { HotspotMap } from '@/components/dashboard/map-panel'
import { RESOURCE_FORECAST, TOTALS } from '@/lib/data'
import { toast } from 'sonner'
import { sanitizeInput } from '@/lib/security'

export function CollectorDashboard({ section }: { section: string }) {
  const [advisoryTitle, setAdvisoryTitle] = useState('Emergency Water Supply & Boil Advisory — Majuli Sub-Division')
  const [advisoryBody, setAdvisoryBody] = useState(
    'All public tube wells in Kamalabari and Garamur are temporarily sealed pending chlorination. Clean water tankers dispatched.',
  )
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublishOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (!advisoryTitle) return

    setIsPublishing(true)
    setTimeout(() => {
      // OWASP A03 Input Sanitization
      const cleanTitle = sanitizeInput(advisoryTitle)
      toast.success('District Emergency Order Published & Dispatched!', {
        description: `Executive order "${cleanTitle}" issued by Collector Kavya Reddy, IAS to all Departments.`,
      })
      setIsPublishing(false)
    }, 600)
  }

  const handleAllocateTanker = (block: string) => {
    toast.success(`Mobile Water Tankers Dispatched to ${block}!`, {
      description: 'PHED & Disaster Management fleet deployed with purified drinking water.',
    })
  }

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="District Emergency Command Center — Kavya Reddy, IAS"
          description="Office of the District Collector, Jorhat. Inter-departmental coordination, emergency fund deployment, and public safety orders."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Landmark} label="Emergency Status" value="LEVEL 2" hint="Outbreak Response Active" tone="danger" />
          <StatCard icon={Truck} label="Water Tankers Deployed" value="14 Fleet" hint="Majuli & Teok blocks" tone="warning" />
          <StatCard icon={ShieldCheck} label="Emergency Relief Funds" value="₹ 45,000,00" hint="Sanctioned for healthcare" tone="success" />
          <StatCard icon={Megaphone} label="Public Advisories" value="3 Orders" hint="Active boil water alerts" tone="default" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <CasesByBlockChart />
            <HotspotMap height={320} zoom={9} center={[26.75, 94.2]} />
          </div>

          <div className="space-y-6">
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-destructive flex items-center gap-2">
                  <Siren className="size-5 animate-pulse" /> High Priority Emergency Board
                </CardTitle>
                <CardDescription>Direct Collector intervention required</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                  <p className="font-bold text-xs">Majuli Sub-Division Water Contamination</p>
                  <p className="text-[11px] text-muted-foreground">
                    Kamalabari community well bacterial count 480 CFU. 42 active cholera cases.
                  </p>
                  <Button size="sm" variant="destructive" className="w-full h-7 text-xs font-bold gap-1" onClick={() => handleAllocateTanker('Majuli')}>
                    <Truck className="size-3" /> Authorize Water Tanker Fleet
                  </Button>
                </div>
                <div className="rounded-lg border border-border bg-background p-3 space-y-2">
                  <p className="font-bold text-xs">Jorhat Civil Hospital ICU Capacity</p>
                  <p className="text-[11px] text-muted-foreground">
                    83% bed occupancy reached. Transfer 20 non-critical patients to Titabor PHC.
                  </p>
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs font-bold gap-1" onClick={() => toast.success('Patient Re-allocation Order Executed!')}>
                    <Building2 className="size-3" /> Execute Patient Re-allocation
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resource Pre-positioning Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {RESOURCE_FORECAST.map((r) => (
                  <div key={r.resource} className="flex justify-between items-center text-xs">
                    <span className="font-medium text-foreground">{r.resource}</span>
                    <Badge variant="outline" className="font-bold">
                      {r.current} / {r.required}
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

  if (section === 'notifications' || section === 'emergency') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <SectionHeader title="Issue District Emergency Advisory & Orders" description="Publish executive public orders across local news, SMS, and portal." />

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-primary/5">
            <CardTitle className="text-base flex items-center gap-2">
              <Megaphone className="size-5 text-primary" /> District Executive Order Form
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handlePublishOrder} className="space-y-4">
              <div className="space-y-2">
                <Label>Advisory / Order Title</Label>
                <Input value={advisoryTitle} onChange={(e) => setAdvisoryTitle(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Executive Order Details & Directives</Label>
                <Textarea value={advisoryBody} onChange={(e) => setAdvisoryBody(e.target.value)} rows={4} required />
              </div>
              <Button type="submit" disabled={isPublishing} className="w-full gap-2 py-5 font-bold shadow-md">
                <Send className="size-4" /> Publish District Executive Order
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="District Collector Dashboard" description="Emergency management overview." />
      <CaseTrendChart />
    </div>
  )
}
