'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { AlertTriangle, ShieldAlert, Activity, ArrowUpRight } from 'lucide-react'

export function OutbreakToastBroadcaster() {
  useEffect(() => {
    // Broadcast initial live real-time outbreak alert toast after 2.5s
    const timer = setTimeout(() => {
      toast.custom((t) => (
        <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-card p-4 shadow-2xl backdrop-blur-xl transition-all">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="size-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-rose-600 dark:text-rose-400">
                  LIVE OUTBREAK ALERT
                </span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-extrabold text-rose-600">
                  Delhi NCR
                </span>
              </div>
              <p className="text-xs font-bold text-foreground">
                High Dengue (DEN-2) vector density cluster detected.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t)
              const mapElem = document.getElementById('disease-map')
              if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' })
            }}
            className="flex shrink-0 items-center gap-1 rounded-xl bg-rose-500 px-3 py-1.5 text-xs font-extrabold text-white transition-transform hover:scale-105"
          >
            <span>Focus</span>
            <ArrowUpRight className="size-3.5" />
          </button>
        </div>
      ), { duration: 8000 })
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
