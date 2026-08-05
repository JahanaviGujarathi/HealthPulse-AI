'use client'

import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatCard, SectionHeader } from '@/components/dashboard/primitives'
import { AiPredictionCard } from '@/components/dashboard/ai-prediction-card'
import { CaseTrendChart, CasesByBlockChart } from '@/components/dashboard/charts'
import { HotspotMap } from '@/components/dashboard/map-panel'
import { AI_PREDICTIONS, NOTIFICATIONS, RESOURCE_FORECAST, TOTALS, VILLAGES } from '@/lib/data'
import { toast } from 'sonner'

export function HealthOfficerDashboard({ section }: { section: string }) {
  const [alerts, setAlerts] = useState(NOTIFICATIONS.filter((n) => n.severity === 'high'))
  const [isDeployingRRT, setIsDeployingRRT] = useState(false)

  const handleApproveAlert = (id: string, title: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    toast.success(`District Alert Approved & Broadcasted!`, {
      description: `Official advisory "${title}" authorized by DHO Dr. Arun Gogoi and dispatched via SMS & Portal.`,
    })
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

  if (section === 'overview' || !section) {
    return (
      <div className="space-y-6">
        <SectionHeader
          title="District Health Surveillance Center — Dr. Arun Gogoi (DHO)"
          description="Jorhat District. Comprehensive epidemiology surveillance, AI outbreak prediction models, and emergency response management."
          action={
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeployingRRT}
              className="gap-1.5 font-bold shadow-md"
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
                    {alerts.length} pending
                  </Badge>
                </CardTitle>
                <CardDescription>Authorize high-priority district health advisories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {alerts.length === 0 ? (
                  <div className="py-4 text-center text-xs text-muted-foreground">
                    <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1" />
                    All district alerts reviewed & approved.
                  </div>
                ) : (
                  alerts.map((a) => (
                    <div key={a.id} className="rounded-lg border border-border p-3 space-y-2">
                      <p className="font-semibold text-xs text-foreground">{a.title}</p>
                      <p className="text-[11px] text-muted-foreground">{a.body}</p>
                      <Button
                        size="sm"
                        variant="default"
                        className="w-full h-7 text-xs font-bold gap-1"
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
                {RESOURCE_FORECAST.slice(0, 3).map((r) => (
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

  if (section === 'resources') {
    return (
      <div className="space-y-6">
        <SectionHeader title="Medical Resource Allocation & Stock Monitoring" description="Forecasted hospital beds, ORS packets, IV fluids, and emergency transport." />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCE_FORECAST.map((r) => (
            <Card key={r.resource}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{r.resource}</CardTitle>
                <CardDescription>Required: {r.required} {r.unit}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-2xl font-bold text-foreground">
                  {r.current} <span className="text-xs text-muted-foreground font-normal">{r.unit} available</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-destructive transition-all"
                    style={{ width: `${Math.round((r.current / r.required) * 100)}%` }}
                  />
                </div>
                <Button size="sm" variant="outline" className="w-full text-xs gap-1 font-bold">
                  <Truck className="size-3" /> Reallocate Stock
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="District Health Officer Dashboard" description="Surveillance analytics and administrative control." />
      <CasesByBlockChart />
    </div>
  )
}
