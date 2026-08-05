'use client'

import { useState } from 'react'
import { Sparkles, Play, RefreshCw, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type { AiPrediction, RiskLevel } from '@/lib/data'
import { toast } from 'sonner'

function levelFor(pct: number): RiskLevel {
  if (pct >= 70) return 'high'
  if (pct >= 45) return 'medium'
  return 'low'
}

const ring: Record<RiskLevel, string> = {
  high: 'text-destructive',
  medium: 'text-amber-500',
  low: 'text-emerald-500',
}

const track: Record<RiskLevel, string> = {
  high: 'stroke-destructive',
  medium: 'stroke-amber-500',
  low: 'stroke-emerald-500',
}

export function AiPredictionCard({ prediction }: { prediction: AiPrediction }) {
  const [currentRisk, setCurrentRisk] = useState(prediction.riskPercent)
  const [rainfall, setRainfall] = useState([75])
  const [chlorine, setChlorine] = useState([0.15])
  const [isSimulating, setIsSimulating] = useState(false)

  const level = levelFor(currentRisk)
  const radius = 34
  const circumference = 2 * Math.PI * radius
  const offset = circumference * (1 - currentRisk / 100)

  const handleRunSimulation = () => {
    setIsSimulating(true)
    setTimeout(() => {
      // Calculate simulated risk score
      const newRisk = Math.min(
        99,
        Math.max(12, Math.round(rainfall[0] * 0.7 + (1.0 - chlorine[0]) * 35)),
      )
      setCurrentRisk(newRisk)
      setIsSimulating(false)
      toast.success('AI Model Simulation complete!', {
        description: `Recalculated risk score for ${prediction.village}: ${newRisk}%`,
      })
    }, 600)
  }

  return (
    <Card className="overflow-hidden border-primary/20 shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 bg-primary/5">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="size-4" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              AI Outbreak Risk Engine
            </CardTitle>
            <CardDescription className="text-xs">
              Predictive neural model v2.4
            </CardDescription>
          </div>
        </div>

        <Dialog>
          <DialogTrigger
            render={
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Play className="size-3 text-primary fill-primary" /> Simulate Risk
              </Button>
            }
          />
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" /> Outbreak Risk Simulation Engine
              </DialogTitle>
              <DialogDescription>
                Adjust environmental parameters to simulate AI risk forecast for {prediction.village}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 py-3">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Forecast Rainfall Index (mm/day)</span>
                  <span className="text-primary font-bold">{rainfall[0]} mm</span>
                </div>
                <Slider
                  value={rainfall}
                  onValueChange={setRainfall}
                  min={10}
                  max={150}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-medium">
                  <span>Water Supply Chlorination (mg/L)</span>
                  <span className="text-primary font-bold">{chlorine[0]} mg/L</span>
                </div>
                <Slider
                  value={chlorine}
                  onValueChange={setChlorine}
                  min={0.0}
                  max={1.0}
                  step={0.05}
                />
              </div>

              <div className="rounded-lg bg-muted/60 p-3 flex items-center justify-between text-xs">
                <span>Simulated Output Risk:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-bold text-sm px-2.5 py-0.5',
                    currentRisk >= 70 ? 'bg-destructive/10 text-destructive border-destructive/30' : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  )}
                >
                  {currentRisk}% Outbreak Risk
                </Badge>
              </div>

              <Button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="w-full gap-2"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="size-4 animate-spin" /> Running Neural Inference...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" /> Recalculate Risk Forecast
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row gap-5 p-5">
        <div className="relative grid size-24 shrink-0 place-items-center mx-auto sm:mx-0">
          <svg viewBox="0 0 80 80" className="size-24 -rotate-90">
            <circle cx="40" cy="40" r={radius} className="stroke-muted" strokeWidth="8" fill="none" />
            <circle
              cx="40"
              cy="40"
              r={radius}
              className={cn(track[level], 'transition-all duration-700 ease-out')}
              strokeWidth="8"
              strokeLinecap="round"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute text-center">
            <span className={cn('text-2xl font-bold tracking-tight', ring[level])}>
              {currentRisk}%
            </span>
            <span className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Risk
            </span>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold text-base text-foreground">
              {prediction.disease} Outbreak Risk · {prediction.village}
            </p>
            <Badge variant="outline" className="text-xs font-normal">
              {prediction.confidence}% confidence score
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Window: <span className="font-semibold text-foreground">{prediction.window}</span>
          </p>

          <p className="mt-3 text-xs font-semibold text-foreground uppercase tracking-wider">
            Primary Risk Drivers:
          </p>
          <ul className="mt-1.5 grid grid-cols-1 gap-1">
            {prediction.drivers.map((d) => (
              <li key={d} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
