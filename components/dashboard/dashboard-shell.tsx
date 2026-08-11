'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Bell, ShieldCheck, CheckCircle2, Lock, LogOut, User } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar'
import { NOTIFICATIONS } from '@/lib/data'
import { getRole, type RoleDefinition } from '@/lib/roles'
import { SeverityDot } from '@/components/dashboard/severity'
import { clearAuthSession, getAuthSession, isAuthenticated, type UserSession } from '@/lib/auth'
import { toast } from 'sonner'

import { ThemeToggle } from '@/components/theme-toggle'

export function DashboardShell({
  role,
  activeSection,
  children,
}: {
  role: string | RoleDefinition
  activeSection?: string
  children: React.ReactNode | ((active: string) => React.ReactNode)
}) {
  const roleDef = typeof role === 'string' ? getRole(role) : role
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSection = activeSection || searchParams.get('section') || roleDef.nav[0].anchor

  const [active, setActive] = useState(initialSection)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const [unreadCount, setUnreadCount] = useState(3)
  const [session, setSession] = useState<UserSession | null>(null)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Enforce Dashboard Protection Guard
  useEffect(() => {
    const currentSession = getAuthSession()
    if (!currentSession) {
      toast.error('Authentication Required', {
        description: 'Please sign in to access the HealthPulse AI portal.',
      })
      router.push(`/login?redirect=/dashboard/${roleDef.id}`)
    } else {
      setSession(currentSession)
      setIsCheckingAuth(false)
    }
  }, [roleDef.id, router])

  useEffect(() => {
    if (activeSection) {
      setActive(activeSection)
    }
  }, [activeSection])

  const handleNavigate = (anchor: string) => {
    setActive(anchor)
    router.push(`/dashboard/${roleDef.id}?section=${anchor}`, { scroll: false })
  }

  const handleSignOut = () => {
    clearAuthSession()
    toast.success('Signed out successfully')
    router.push('/login')
  }

  const handleClearNotifs = () => {
    setUnreadCount(0)
  }

  const filteredNotifs = notifs.filter((n) =>
    roleDef.group === 'government' ? true : n.audience === 'citizen',
  )

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background p-6 text-center">
        <div className="space-y-3">
          <div className="size-10 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-muted-foreground">Verifying authentication session...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <DashboardSidebar role={roleDef} active={active} onNavigate={handleNavigate} />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b border-border bg-background/85 px-4 backdrop-blur transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-1 h-4" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {roleDef.name} Portal
                </h1>
                <Badge variant="outline" className="hidden sm:inline-flex items-center gap-1 border-primary/30 bg-primary/5 text-[11px] text-primary">
                  <Lock className="size-3" /> Authenticated Session
                </Badge>
              </div>
              <p className="truncate text-xs text-muted-foreground">{roleDef.scope}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {role !== 'citizen' && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button variant="outline" size="sm" className="hidden md:flex gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5">
                      <ShieldCheck className="size-3.5 text-emerald-500" />
                      <span>Access Verified</span>
                    </Button>
                  }
                />
                <DropdownMenuContent align="end" className="w-64 p-3 text-xs space-y-1.5">
                  <div className="font-semibold text-foreground flex items-center gap-1">
                    <CheckCircle2 className="size-3.5 text-emerald-500" /> Security Standards Enforced
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    Inputs sanitized (A03), strict access controls active (A01), request rate limits applied (A04), and tamper-evident audit logs enabled (A09).
                  </p>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="size-4" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-destructive text-[10px] font-semibold text-destructive-foreground animate-pulse">
                        {unreadCount}
                      </span>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-80 sm:w-96">
                <DropdownMenuLabel className="flex items-center justify-between py-2">
                  <span>Notifications</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {filteredNotifs.length} total
                    </Badge>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleClearNotifs}
                        className="text-[11px] text-primary hover:underline font-normal"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto divide-y divide-border/50">
                  {filteredNotifs.map((n) => (
                    <div key={n.id} className="flex gap-3 px-3 py-2.5 text-sm hover:bg-muted/40 transition-colors">
                      <SeverityDot level={n.severity} className="mt-1.5" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium leading-tight text-foreground">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="gap-1.5 text-xs text-destructive border-destructive/20 hover:bg-destructive/10"
            >
              <LogOut className="size-3.5" /> Sign out
            </Button>
          </div>
        </header>

        <main className="flex-1 bg-muted/30 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto w-full max-w-7xl">
            {typeof children === 'function' ? children(active) : children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
