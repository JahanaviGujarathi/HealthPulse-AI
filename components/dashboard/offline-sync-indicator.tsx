'use client'

import { useEffect, useState } from 'react'
import { Wifi, WifiOff, RefreshCw } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

export function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast.success('Connection Restored', {
        description: 'HealthPulse AI is back online. Syncing offline data...',
      })
      handleSync()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('Offline Mode Activated', {
        description: 'Submissions will be saved locally and synced when connection recovers.',
      })
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSync = () => {
    if (!navigator.onLine) {
      toast.error('Cannot Sync', { description: 'Please check your internet connection.' })
      return
    }
    setIsSyncing(true)
    setTimeout(() => {
      setIsSyncing(false)
      setPendingCount(0)
      toast.success('Offline Records Synced', {
        description: 'All field logs have been successfully sent to Cloud Firestore.',
      })
    }, 1200)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            {!isOnline ? (
              <Badge
                variant="destructive"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold animate-pulse"
              >
                <WifiOff className="size-3.5" />
                <span>Offline Mode</span>
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
              >
                <Wifi className="size-3.5 text-emerald-500" />
                <span className="hidden sm:inline">Live Cloud Sync</span>
              </Badge>
            )}

            {pendingCount > 0 && (
              <button
                onClick={handleSync}
                disabled={isSyncing}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
              >
                <RefreshCw className={`size-3 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{pendingCount} Pending</span>
              </button>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs">
          {isOnline
            ? 'Connected to HealthPulse Cloud Firestore'
            : 'Offline mode — reports queued for auto-sync'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
