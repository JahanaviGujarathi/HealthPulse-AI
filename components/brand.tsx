import { Activity } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Brand({
  className,
  showText = true,
  size = 'md',
}: {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const box = size === 'sm' ? 'size-7' : size === 'lg' ? 'size-11' : 'size-9'
  const icon = size === 'sm' ? 'size-4' : size === 'lg' ? 'size-6' : 'size-5'
  const text = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-2xl' : 'text-lg'

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div
        className={cn(
          'grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm',
          box,
        )}
        aria-hidden="true"
      >
        <Activity className={icon} strokeWidth={2.5} />
      </div>
      {showText && (
        <span className={cn('font-semibold tracking-tight text-foreground', text)}>
          HealthPulse<span className="text-primary"> AI</span>
        </span>
      )}
    </div>
  )
}
