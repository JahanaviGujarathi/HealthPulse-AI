'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, Lock, ShieldCheck, UserCheck, LayoutDashboard } from 'lucide-react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { getAuthSession, type UserSession } from '@/lib/auth'
import { Badge } from '@/components/ui/badge'

const links = [
  { label: 'How it works', href: '#how' },
  { label: 'AI Engine', href: '#ai' },
  { label: 'Role Portals', href: '#roles' },
]

export function SiteHeader() {
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setSession(getAuthSession())
    const handleAuthChange = () => setSession(getAuthSession())
    window.addEventListener('auth_session_change', handleAuthChange)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('auth_session_change', handleAuthChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Warm Peach Gradient Accent Bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-amber-400 to-emerald-400" />

      <div
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? 'border-border/80 bg-background/95 shadow-lg backdrop-blur-2xl py-1'
            : 'border-border/40 bg-background/80 backdrop-blur-xl py-2'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo (Enlarged) */}
          <Link href="/" aria-label="HealthPulse AI home" className="flex items-center gap-3 group">
            <Brand size="lg" />
          </Link>

          {/* Center Navigation Links (Spacious Pill Bar) */}
          <nav
            className="hidden items-center gap-2 rounded-full border border-primary/20 bg-card/80 px-4 py-1.5 shadow-sm backdrop-blur-md md:flex"
            aria-label="Primary Navigation"
          >
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-5 py-2 text-sm font-bold text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Action CTAs (Enlarged Buttons) */}
          <div className="flex items-center gap-3.5">
            <Badge
              variant="outline"
              className="hidden lg:inline-flex items-center gap-1.5 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-xs px-3 py-1.5"
            >
              <ShieldCheck className="size-4 text-emerald-500" /> System Secured
            </Badge>

            {session ? (
              <Button
                size="lg"
                onClick={() => router.push(`/dashboard/${session.role}`)}
                className="gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-sm shadow-lg shadow-primary/20 rounded-xl px-6 h-11"
              >
                <LayoutDashboard className="size-4" />
                <span>Go to Portal ({session.name.split(' ')[0]})</span>
              </Button>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push('/login')}
                  className="text-sm font-bold text-muted-foreground hover:text-foreground h-11 px-4"
                >
                  Sign in
                </Button>

                <Button
                  size="lg"
                  onClick={() => router.push('/login')}
                  className="gap-2 font-extrabold shadow-lg shadow-primary/25 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 h-11 transition-all duration-200 hover:scale-105"
                >
                  <span>Open Portals</span>
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
