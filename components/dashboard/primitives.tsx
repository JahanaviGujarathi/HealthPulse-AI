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
  onClick,
}: {
  icon: LucideIcon
  label: string
  value: string | number
  hint?: string
  trend?: { value: string; direction: 'up' | 'down'; good?: boolean }
  tone?: 'default' | 'danger' | 'success' | 'warning'
  onClick?: () => void
}) {
  const toneRing: Record<string, string> = {
    default: 'bg-primary/10 text-primary border-primary/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    success: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20',
  }

  return (
    <Card
      className={cn(
        'group transition-all duration-200 hover:shadow-md hover:border-primary/30',
        onClick && 'cursor-pointer',
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-start justify-between gap-3 p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
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
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {value}
          </p>
          {trend && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
                  trend.good
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-destructive/10 text-destructive',
                )}
              >
                {trend.direction === 'up' ? (
                  <ArrowUpRight className="size-3.5" />
                ) : (
                  <ArrowDownRight className="size-3.5" />
                )}
                {trend.value}
              </span>
              <span className="text-[11px] text-muted-foreground">vs last week</span>
            </div>
          )}
        </div>

        <div
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-xl border transition-transform group-hover:scale-105',
            toneRing[tone],
          )}
        >
          <Icon className="size-5" />
        </div>
      </CardContent>
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
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  )
}
