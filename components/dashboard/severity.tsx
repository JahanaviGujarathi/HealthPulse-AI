import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { RiskLevel } from '@/lib/data'

const dotColor: Record<RiskLevel, string> = {
  high: 'bg-[#E5485D]',
  medium: 'bg-[#D99A24]',
  low: 'bg-[#3BAA72]',
}

const badgeClass: Record<RiskLevel, string> = {
  high: 'border-[#FFB7C0] bg-[#FFF0F2] text-[#E5485D]',
  medium: 'border-[#FDE68A] bg-[#FFF7E5] text-[#D99A24]',
  low: 'border-[#A7F3D0] bg-[#EAF8F1] text-[#3BAA72]',
}

const label: Record<RiskLevel, string> = {
  high: 'High Risk',
  medium: 'Medium Risk',
  low: 'Safe / Low',
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
    <Badge variant="outline" className={cn('gap-1.5 font-medium px-2 py-0.5 rounded-full text-[11px]', badgeClass[level], className)}>
      <span className={cn('size-1.5 rounded-full', dotColor[level])} aria-hidden="true" />
      {children ?? label[level]}
    </Badge>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    confirmed: 'border-[#FFB7C0] bg-[#FFF0F2] text-[#E5485D]',
    verified: 'border-[#DCE5FF] bg-[#EEF3FF] text-[#3157D5]',
    pending: 'border-[#FDE68A] bg-[#FFF7E5] text-[#D99A24]',
    rejected: 'border-[#DCE4F0] bg-[#F7F9FE] text-[#64748B]',
    active: 'border-[#A7F3D0] bg-[#EAF8F1] text-[#3BAA72]',
    training: 'border-[#FDE68A] bg-[#FFF7E5] text-[#D99A24]',
  }
  return (
    <Badge variant="outline" className={cn('capitalize font-medium text-[11px] px-2 py-0.5 rounded-full', map[status] ?? 'bg-muted text-muted-foreground')}>
      {status}
    </Badge>
  )
}
