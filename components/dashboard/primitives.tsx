'use client'

import type { LucideIcon } from 'lucide-react'
import { ArrowDownRight, ArrowUpRight, HelpCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  trend,
  tone = 'default',
  progress,
  sparklineData,
  onClick,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  trend?: { value: string; direction: 'up' | 'down'; good?: boolean }
  tone?: 'default' | 'danger' | 'success' | 'warning'
  progress?: number
  sparklineData?: number[]
  onClick?: () => void
}) {
  const toneRing: Record<string, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
  }

  // Calculate sparkline points if data exists
  const width = 120
  const height = 30
  let points = ''
  if (sparklineData && sparklineData.length > 1) {
    const minVal = Math.min(...sparklineData)
    const maxVal = Math.max(...sparklineData)
    const range = maxVal - minVal || 1
    points = sparklineData
      .map((val, idx) => {
        const x = (idx / (sparklineData.length - 1)) * width
        const y = height - ((val - minVal) / range) * (height - 6) - 3 // bounds padding
        return `${x},${y}`
      })
      .join(' ')
  }

  return (
    <Card
      className={cn(
        'group transition-all duration-300 glass-card glass-card-hover border-border/80 relative overflow-hidden',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
        
        {/* Top Info Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground truncate">{label}</p>
            {hint && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="size-3 text-muted-foreground/60 hover:text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="text-xs max-w-xs">{hint}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
          
          {/* Live Status indicator node */}
          <span className={cn(
            "relative flex size-2 shrink-0 rounded-full",
            tone === 'danger' && 'text-rose-500',
            tone === 'warning' && 'text-amber-500',
            tone === 'success' && 'text-emerald-500',
            tone === 'default' && 'text-primary'
          )}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current" />
            <span className="relative inline-flex rounded-full size-2 bg-current" />
          </span>
        </div>

        {/* Main Value & Sparkline Row */}
        <div className="mt-3 flex items-baseline justify-between gap-2 relative">
          <p className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>

          {/* Sparkline Visualization */}
          {points && (
            <div className="h-8 w-24 opacity-50 group-hover:opacity-90 transition-opacity pointer-events-none self-end">
              <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
                <polyline
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  className={cn(
                    tone === 'danger' && 'text-destructive',
                    tone === 'success' && 'text-emerald-500',
                    tone === 'warning' && 'text-amber-500',
                    tone === 'default' && 'text-primary'
                  )}
                />
              </svg>
            </div>
          )}
        </div>

        {/* Trend indicator details */}
        {trend && (
          <div className="mt-2 flex items-center gap-1.5">
            <span
              className={cn(
                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase',
                trend.good
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'bg-destructive/10 text-destructive',
              )}
            >
              {trend.direction === 'up' ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {trend.value}
            </span>
            <span className="text-[10px] text-muted-foreground font-bold">vs last week</span>
          </div>
        )}

        {/* Target Progress Bar */}
        {progress !== undefined && (
          <div className="mt-4 space-y-1.5">
            <div className="flex justify-between text-[9px] text-muted-foreground font-black uppercase">
              <span>Target progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-500",
                  tone === 'danger' ? 'bg-destructive' : tone === 'success' ? 'bg-emerald-500' : tone === 'warning' ? 'bg-amber-500' : 'bg-primary'
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

      </CardContent>

      {/* Absolute Icon Background on Hover */}
      <div
        className={cn(
          'absolute -right-4 -bottom-4 size-16 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.07] transition-all duration-350 z-0 pointer-events-none text-foreground',
        )}
      >
        <Icon className="size-full" />
      </div>
    </Card>
  )
}

export function SectionHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-border/40 pb-4">
      <div>
        <h2 className="text-xl font-black tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground font-medium">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
