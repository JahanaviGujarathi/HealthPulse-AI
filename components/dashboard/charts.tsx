'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { CASES_BY_BLOCK, CASE_TREND, DISEASES, WATER_TREND } from '@/lib/data'

const diseaseColors = ['chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5']

const caseConfig: ChartConfig = DISEASES.reduce((acc, d, i) => {
  acc[d] = { label: d, color: `var(--color-${diseaseColors[i]})` }
  return acc
}, {} as ChartConfig)

export function CaseTrendChart({
  compact = false,
  title = 'Disease case trend',
  description = 'Reported cases over the last 14 days',
}: {
  compact?: boolean
  title?: string
  description?: string
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={caseConfig} className={compact ? 'h-[200px] w-full' : 'h-[280px] w-full'}>
          <AreaChart data={CASE_TREND} margin={{ left: -12, right: 8, top: 4 }}>
            <defs>
              {DISEASES.map((d, i) => (
                <linearGradient key={d} id={`fill-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={`var(--color-${diseaseColors[i]})`} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={`var(--color-${diseaseColors[i]})`} stopOpacity={0.02} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} interval={compact ? 3 : 1} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {!compact && <ChartLegend content={<ChartLegendContent />} />}
            {DISEASES.map((d, i) => (
              <Area
                key={d}
                type="monotone"
                dataKey={d}
                stroke={`var(--color-${diseaseColors[i]})`}
                fill={`url(#fill-${i})`}
                strokeWidth={2}
                stackId={compact ? '1' : undefined}
              />
            ))}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const blockConfig: ChartConfig = {
  cases: { label: 'Active cases', color: 'var(--color-chart-1)' },
  recovered: { label: 'Recovered', color: 'var(--color-chart-2)' },
}

export function CasesByBlockChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cases by block</CardTitle>
        <CardDescription>Active vs recovered across blocks</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={blockConfig} className="h-[260px] w-full">
          <BarChart data={CASES_BY_BLOCK} margin={{ left: -12, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="block" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="cases" fill="var(--color-cases)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="recovered" fill="var(--color-recovered)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

const waterConfig: ChartConfig = {
  ph: { label: 'pH', color: 'var(--color-chart-1)' },
  turbidity: { label: 'Turbidity (NTU)', color: 'var(--color-chart-3)' },
  chlorine: { label: 'Chlorine (mg/L)', color: 'var(--color-chart-2)' },
}

export function WaterQualityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Water quality trend</CardTitle>
        <CardDescription>Last 12 readings — Kamalabari Community Well</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={waterConfig} className="h-[260px] w-full">
          <LineChart data={WATER_TREND} margin={{ left: -12, right: 8 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="reading" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
            <YAxis tickLine={false} axisLine={false} fontSize={11} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line type="monotone" dataKey="ph" stroke="var(--color-ph)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="turbidity" stroke="var(--color-turbidity)" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="chlorine" stroke="var(--color-chlorine)" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
