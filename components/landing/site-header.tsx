'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  LayoutDashboard,
  Sun,
  Moon,
  Globe,
  BellRing,
  Menu,
  X,
  FileSpreadsheet,
  PhoneCall,
} from 'lucide-react'
import { Brand } from '@/components/brand'
import { Button } from '@/components/ui/button'
import { getAuthSession, type UserSession } from '@/lib/auth'
import { useTheme } from 'next-themes'
import { LANGUAGES, type SupportedLanguage, TRANSLATIONS } from '@/lib/i18n'
import { generateEpidemiologyReport } from '@/lib/report-generator'
import { toast } from 'sonner'

export function SiteHeader() {
  const router = useRouter()
  const [session, setSession] = useState<UserSession | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>('en')
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en

  const navLinks = [
    { label: t.diseaseMap, href: '#disease-map' },
    { label: t.howItWorks, href: '#how' },
    { label: t.safetyFeatures, href: '#ai' },
    { label: t.rolePortals, href: '#roles' },
  ]

  useEffect(() => {
    setMounted(true)
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

  const triggerLiveAlert = () => {
    toast.warning('🚨 LIVE SURVEILLANCE ALERT: High Dengue & Waterborne Outbreak Alert in Delhi & West Bengal', {
      description: 'Central Health Emergency Team dispatched. Real-time vector indices updated.',
      action: {
        label: 'View Map',
        onClick: () => {
          const mapElem = document.getElementById('disease-map')
          if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' })
        },
      },
    })
  }

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Vibrant Gradient Accent Top Bar */}
      <div className="h-[3px] w-full bg-gradient-to-r from-cyan-500 via-primary to-emerald-400" />

      <div
        className={`w-full border-b transition-all duration-300 ${
          scrolled
            ? 'border-border/80 bg-background/90 shadow-xl backdrop-blur-2xl py-1.5'
            : 'border-border/40 bg-background/70 backdrop-blur-xl py-2.5'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <Link href="/" aria-label="HealthPulse AI home" className="flex items-center gap-3 group">
            <Brand size="lg" />
          </Link>

          {/* Center Navigation Links (Spacious Pill Bar) */}
          <nav
            className="hidden items-center gap-1.5 rounded-full border border-primary/20 bg-card/75 px-4 py-1.5 shadow-sm backdrop-blur-md lg:flex"
            aria-label="Primary Navigation"
          >
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-4 py-1.5 text-xs font-extrabold text-muted-foreground transition-all duration-200 hover:bg-primary/10 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Controls (Language Selector + Report Export + Theme Toggle + Auth CTAs) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multi-Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-bold text-foreground transition-all hover:bg-accent/40"
                aria-label="Select Language"
              >
                <Globe className="size-3.5 text-primary" />
                <span className="uppercase">{currentLang}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-2xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-xl z-50">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setIsLangMenuOpen(false)
                        toast.success(`Language set to ${lang.label}`)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                        currentLang === lang.code
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-sm">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 1-Click Interactive Emergency Call Helpline */}
            <a
              href="tel:108"
              className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-black text-rose-600 dark:text-rose-400 shadow-sm transition-all hover:bg-rose-500/20 hover:scale-105"
              title="24/7 Free National Medical Ambulance Helpline"
            >
              <PhoneCall className="size-3.5 animate-pulse" />
              <span>Call 108</span>
            </a>

            {/* Quick Report Download Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateEpidemiologyReport()}
              className="hidden sm:flex items-center gap-1.5 rounded-full border-primary/30 text-xs font-bold text-primary hover:bg-primary/10"
              title="One-Click Epidemiological Summary Report"
            >
              <FileSpreadsheet className="size-3.5" />
              <span>Report</span>
            </Button>

            {/* Real-time Alert Trigger Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={triggerLiveAlert}
              className="h-9 w-9 rounded-full text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all"
              title="Trigger Real-time Outbreak Broadcast"
            >
              <BellRing className="size-4 animate-bounce" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="size-4 text-amber-400" />
                ) : (
                  <Moon className="size-4 text-primary" />
                )}
              </Button>
            )}

            {/* Auth Action Buttons */}
            {session ? (
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/${session.role}`)}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 font-extrabold text-xs shadow-md rounded-full px-4 h-9"
              >
                <LayoutDashboard className="size-3.5" />
                <span>Portal ({session.name.split(' ')[0]})</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => router.push('/login')}
                  className="gap-1.5 font-extrabold shadow-md text-xs bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 h-9 transition-all hover:scale-105"
                >
                  <span>{t.openPortals}</span>
                  <ArrowRight className="size-3.5" />
                </Button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-full p-2 text-foreground hover:bg-muted"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 px-4 py-4 backdrop-blur-2xl space-y-3">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-sm font-extrabold text-foreground hover:bg-primary/10 hover:text-primary"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 border-t border-border flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => generateEpidemiologyReport()}
                className="w-full gap-2 rounded-xl text-xs font-bold"
              >
                <FileSpreadsheet className="size-4 text-primary" />
                <span>Download Report</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
