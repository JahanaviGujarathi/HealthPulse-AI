'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChevronsUpDown, LogOut, Moon, Sun, ShieldCheck, Lock, ArrowRight } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Brand } from '@/components/brand'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { ROLE_ORDER, ROLES, type RoleDefinition, type RoleId } from '@/lib/roles'
import { Button } from '@/components/ui/button'

export function DashboardSidebar({
  role,
  active,
  onNavigate,
}: {
  role: RoleDefinition
  active: string
  onNavigate: (anchor: string) => void
}) {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const isCitizen = role.id === 'citizen'

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <Link href="/" className="px-2 py-1">
          <Brand size="sm" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {isCitizen ? 'Community Menu' : `${role.short} Menu`}
          </SidebarGroupLabel>
          <SidebarMenu>
            {role.nav.map((item) => (
              <SidebarMenuItem key={item.anchor}>
                <SidebarMenuButton
                  isActive={active === item.anchor}
                  onClick={() => onNavigate(item.anchor)}
                  tooltip={item.label}
                  className="font-medium"
                >
                  <item.icon className="size-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Official Staff Portal Switcher — HIDDEN FOR CITIZENS, SHOWN FOR OFFICIAL STAFF */}
        {!isCitizen ? (
          <>
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Health Staff Portals
              </SidebarGroupLabel>
              <SidebarMenu>
                {ROLE_ORDER.filter((id) => id !== 'citizen' && id !== role.id).map((id) => {
                  const r = ROLES[id as RoleId]
                  return (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => router.push(`/dashboard/${id}`)}
                        tooltip={r.name}
                      >
                        <r.icon className="size-4" />
                        <span className="truncate">{r.name}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>

            {/* Official System Verification Badge */}
            <SidebarGroup className="mt-auto p-3">
              <div className="rounded-2xl p-3 text-[11px] space-y-1.5 glass-card bg-primary/5 border-primary/20">
                <div className="flex items-center justify-between text-foreground font-black">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-emerald-500" />
                    IDSP Grid Active
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    LIVE
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground font-semibold leading-relaxed">
                  Real-time encrypted epidemiological surveillance pipeline active.
                </p>
              </div>
            </SidebarGroup>
          </>
        ) : (
          /* For Citizens: Friendly Card to access Official Portal */
          <SidebarGroup className="mt-auto p-3">
            <div className="rounded-2xl p-3 text-xs space-y-2 glass-card border-primary/10">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <Lock className="size-3.5 text-primary" /> Official Health Staff?
              </div>
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                ASHA workers, Doctors, Lab staff, and Government Officers can log in via the official admin portal.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/login?portal=admin')}
                className="w-full h-8 text-[11px] font-bold border-primary/30 text-primary hover:bg-primary/10 gap-1 mt-1"
              >
                Official Staff Sign In <ArrowRight className="size-3" />
              </Button>
            </div>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary font-bold">
                      <role.icon className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">{role.sampleUser}</span>
                      <span className="truncate text-xs text-muted-foreground">{role.name}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" align="start" className="w-60 p-2">
                <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
                  {role.scope}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                  Interface Theme
                </DropdownMenuLabel>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light" className="text-xs">
                    <Sun className="mr-2 size-3.5" /> Light Theme
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark" className="text-xs">
                    <Moon className="mr-2 size-3.5" /> Dark Theme
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/login')} className="text-xs text-destructive focus:bg-destructive/10 font-semibold">
                  <LogOut className="mr-2 size-3.5" /> Sign out of Portal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
