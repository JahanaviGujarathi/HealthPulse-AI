'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  User,
  Stethoscope,
  FlaskConical,
  Droplets,
  Building2,
  Landmark,
  Shield,
  PhoneCall,
  MapPin,
  Bot,
  Sun,
  Moon,
  FileText,
  Command,
  ArrowRight,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  // Global Keyboard Listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const commandGroups = [
    {
      category: 'Stakeholder Role Portals',
      items: [
        { id: 'citizen', name: 'Citizen Self-Reporting Portal', scope: 'Public Health', icon: User, path: '/dashboard/citizen' },
        { id: 'asha', name: 'ASHA Worker Survey Workstation', scope: 'Field Operations', icon: Stethoscope, path: '/dashboard/asha' },
        { id: 'doctor', name: 'Doctor Clinical Workstation', scope: 'Hospital Care', icon: Stethoscope, path: '/dashboard/doctor' },
        { id: 'lab', name: 'Lab Tech Diagnostics Portal', scope: 'Pathology Lab', icon: FlaskConical, path: '/dashboard/lab' },
        { id: 'water', name: 'Water Quality Telemetry Command', scope: 'PHED Department', icon: Droplets, path: '/dashboard/water-officer' },
        { id: 'dho', name: 'District Health Officer (DHO) Command', scope: 'District Admin', icon: Building2, path: '/dashboard/dho' },
        { id: 'collector', name: 'District Collector Emergency Command', scope: 'IAS Executive', icon: Landmark, path: '/dashboard/collector' },
        { id: 'admin', name: 'State Admin Audit & Security Portal', scope: 'State Command', icon: Shield, path: '/dashboard/state-admin' },
      ],
    },
    {
      category: 'Emergency & Surveillance Actions',
      items: [
        {
          id: 'sos',
          name: 'Dispatch 108 Medical SOS Emergency',
          scope: 'Urgent Action',
          icon: PhoneCall,
          action: () => {
            toast.error('108 Emergency SOS Triggered', {
              description: 'Geo-location broadcast sent to nearest mobile ambulance dispatch team.',
            })
            setOpen(false)
          },
        },
        {
          id: 'map',
          name: 'View Live GIS Outbreak & Contamination Map',
          scope: 'Surveillance',
          icon: MapPin,
          path: '/#map',
        },
        {
          id: 'ai-chat',
          name: 'Open Gemini AI Epidemiological Assistant',
          scope: 'AI Guidance',
          icon: Bot,
          action: () => {
            router.push('/dashboard/citizen?section=chat')
            setOpen(false)
          },
        },
        {
          id: 'toggle-theme',
          name: `Switch Theme (Current: ${theme === 'dark' ? 'Dark' : 'Light'})`,
          scope: 'Preferences',
          icon: theme === 'dark' ? Sun : Moon,
          action: () => {
            setTheme(theme === 'dark' ? 'light' : 'dark')
            toast.info(`Theme switched to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`)
            setOpen(false)
          },
        },
      ],
    },
  ]

  const filteredGroups = commandGroups
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.name.toLowerCase().includes(query.toLowerCase()) ||
          item.scope.toLowerCase().includes(query.toLowerCase()),
      ),
    }))
    .filter((group) => group.items.length > 0)

  const handleSelect = (item: any) => {
    if (item.action) {
      item.action()
    } else if (item.path) {
      router.push(item.path)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all shadow-sm">
            <Search className="size-3.5 text-primary" />
            <span className="hidden sm:inline-block">Search portals, tools...</span>
            <span className="sm:hidden">Search...</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground ml-2">
              <Command className="size-2.5" />K
            </kbd>
          </button>
        }
      />
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden glass-card shadow-2xl border-border/80 rounded-2xl">
        <DialogHeader className="p-4 border-b border-border/60 pb-3">
          <DialogTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
            <Command className="size-4 text-primary" /> HealthPulse AI Global Command Palette
          </DialogTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a portal, action, or command (e.g. Doctor, Water, SOS)..."
              className="pl-9 bg-background/60 text-xs h-9 border-border/60 focus-visible:ring-primary"
              autoFocus
            />
          </div>
        </DialogHeader>

        <div className="max-h-[360px] overflow-y-auto p-2 space-y-4 text-xs">
          {filteredGroups.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No matching commands or portals found for &quot;{query}&quot;
            </div>
          ) : (
            filteredGroups.map((group) => (
              <div key={group.category} className="space-y-1">
                <div className="px-2 py-1 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  {group.category}
                </div>
                {group.items.map((item) => {
                  const IconComponent = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-primary/10 hover:text-primary transition-all text-left group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="size-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          <IconComponent className="size-3.5" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-foreground group-hover:text-primary truncate">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{item.scope}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary">
                        <span className="text-[11px] font-medium">Open</span>
                        <ArrowRight className="size-3" />
                      </div>
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <div className="p-2.5 border-t border-border/60 bg-muted/30 text-[11px] text-muted-foreground flex items-center justify-between px-4">
          <span>Press <kbd className="px-1.5 py-0.5 bg-background border rounded text-[10px]">Esc</kbd> to close</span>
          <span className="flex items-center gap-1">
            <Badge variant="outline" className="text-[10px] py-0 border-primary/30 text-primary">
              Instant Navigation
            </Badge>
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
