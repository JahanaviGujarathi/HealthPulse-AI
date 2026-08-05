import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/data'

const dotColor: Record<RiskLevel, string> = {
  high: 'bg-destructive',
  medium: 'bg-warning',
  low: 'bg-success',
}

const badgeClass: Record<RiskLevel, string> = {
  high: 'border-destructive/30 bg-destructive/10 text-destructive',
  medium: 'border-warning/40 bg-warning/15 text-warning-foreground',
  low: 'border-success/30 bg-success/10 text-success',
}

const label: Record<RiskLevel, string> = {
  high: 'High',
  medium: 'Medium',
  low: 'Low',
}

export function severityColorVar(severity: RiskLevel): string {
  switch (severity) {
    case 'high':
      return '--destructive'
    case 'medium':
      return '--warning'
    case 'low':
    default:
      return '--success'
  }
}

export function SeverityDot({ level, className }: { level: RiskLevel; className?: string }) {
  return (
    <span
      className={cn('inline-block size-2 shrink-0 rounded-full', dotColor[level], className)}
      aria-hidden="true"
    />
  )
}

export function RiskBadge({
  level,
  children,
  className,
}: {
  level: RiskLevel
  children?: React.ReactNode
  className?: string
}) {
  return (
    <Badge variant="outline" className={cn('gap-1.5 font-medium', badgeClass[level], className)}>
      <span className={cn('size-1.5 rounded-full', dotColor[level])} aria-hidden="true" />
      {children ?? `${label[level]} risk`}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'border-destructive/30 bg-destructive/10 text-destructive',
    verified: 'border-primary/30 bg-primary/10 text-primary',
    pending: 'border-warning/40 bg-warning/15 text-warning-foreground',
    rejected: 'border-border bg-muted text-muted-foreground',
    active: 'border-success/30 bg-success/10 text-success',
    training: 'border-warning/40 bg-warning/15 text-warning-foreground',
  }
  return (
    <Badge variant="outline" className={cn('capitalize', map[status] ?? 'bg-muted')}>
      {status}
    </Badge>
  )
}
