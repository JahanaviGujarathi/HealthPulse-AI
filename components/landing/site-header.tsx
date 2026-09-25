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
  Activity,
  ShieldCheck,
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
  const [activeTab, setActiveTab] = useState<string>('#disease-map')

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
      setScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('auth_session_change', handleAuthChange)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const triggerLiveAlert = () => {
    toast.warning('LIVE SURVEILLANCE ALERT: High Dengue & Waterborne Outbreak in Delhi & West Bengal', {
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
      <div
        className={`w-full transition-all duration-300 ${
          scrolled
            ? 'border-b border-[#DCE4F0] bg-white/95 shadow-sm backdrop-blur-md py-1 dark:bg-[#111A2B]/95 dark:border-[#1E2D45]'
            : 'border-b border-[#E8EDF5] bg-white/90 backdrop-blur-xs py-2 dark:bg-[#0D1525]/90 dark:border-[#1E2D45]'
        }`}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo with gentle scale transition */}
          <Link
            href="/"
            aria-label="HealthPulse AI home"
            className="flex items-center gap-2 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <Brand size="md" />
          </Link>

          {/* Center Navigation Links (Clean Active / Inactive states with subtle pill animation) */}
          <nav
            className="hidden items-center gap-1 rounded-full border border-[#DCE4F0] bg-[#F7F9FE] p-1 shadow-2xs lg:flex dark:border-[#1E2D45] dark:bg-[#111A2B]"
            aria-label="Primary Navigation"
          >
            {navLinks.map((l) => {
              const isActive = activeTab === l.href
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setActiveTab(l.href)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-[#3157D5] text-white shadow-xs scale-100'
                      : 'text-[#64748B] hover:text-[#172033] hover:bg-[#EEF3FF] dark:text-[#94A3B8] dark:hover:text-white dark:hover:bg-[#172554]'
                  }`}
                >
                  {l.label}
                </a>
              )
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Multi-Language Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1.5 rounded-lg border border-[#DCE4F0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#172033] transition-all duration-200 hover:bg-[#F7F9FE] hover:border-[#B8C8F5] active:scale-95 dark:border-[#1E2D45] dark:bg-[#111A2B] dark:text-[#F1F5F9]"
                aria-label="Select Language"
              >
                <Globe className="size-3.5 text-[#3157D5]" />
                <span className="uppercase text-[11px]">{currentLang}</span>
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl border border-[#DCE4F0] bg-white p-1 shadow-lg z-50 animate-in fade-in-50 zoom-in-95 duration-150 dark:border-[#1E2D45] dark:bg-[#111A2B]">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code)
                        setIsLangMenuOpen(false)
                        toast.success(`Language set to ${lang.label}`)
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                        currentLang === lang.code
                          ? 'bg-[#3157D5] text-white'
                          : 'text-[#172033] hover:bg-[#F7F9FE] dark:text-[#F1F5F9] dark:hover:bg-[#172554]'
                      }`}
                    >
                      <span>{lang.nativeName}</span>
                      <span className="text-sm">{lang.flag}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Semantic Emergency Helpline */}
            <a
              href="tel:108"
              className="flex items-center gap-1.5 rounded-lg border border-[#FFB7C0] bg-[#FFF0F2] px-2.5 py-1.5 text-xs font-semibold text-[#E5485D] transition-all duration-200 hover:bg-[#FFE4E8] hover:border-[#E5485D] active:scale-95"
              title="24/7 National Emergency Ambulance Helpline"
            >
              <PhoneCall className="size-3 text-[#E5485D] animate-subtle-pulse" />
              <span className="text-[11px]">108 SOS</span>
            </a>

            {/* Quick Report Download */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => generateEpidemiologyReport()}
              className="hidden sm:flex items-center gap-1.5 rounded-lg border-[#DCE4F0] text-xs font-semibold text-[#172033] hover:bg-[#F7F9FE] hover:border-[#3157D5] hover:text-[#3157D5] h-8 transition-all duration-200 active:scale-95"
              title="Download Epidemiological Surveillance Report"
            >
              <FileSpreadsheet className="size-3.5 text-[#3157D5]" />
              <span>Report</span>
            </Button>

            {/* Restrained Alert Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={triggerLiveAlert}
              className="h-8 w-8 rounded-lg text-[#64748B] hover:text-[#E5485D] hover:bg-[#FFF0F2] transition-colors duration-200"
              title="View Real-time Outbreak Broadcast"
            >
              <BellRing className="size-4" />
            </Button>

            {/* Theme Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-8 w-8 rounded-lg text-[#64748B] hover:text-[#3157D5] hover:bg-[#EEF3FF] transition-colors duration-200"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="size-4 text-[#D99A24]" />
                ) : (
                  <Moon className="size-4 text-[#3157D5]" />
                )}
              </Button>
            )}

            {/* Auth Action Buttons with smooth hover */}
            {session ? (
              <Button
                size="sm"
                onClick={() => router.push(`/dashboard/${session.role}`)}
                className="gap-1.5 bg-[#3157D5] hover:bg-[#243FA8] text-white font-semibold text-xs rounded-lg px-3.5 h-8 shadow-xs transition-all duration-200 hover:shadow-sm active:scale-95"
              >
                <LayoutDashboard className="size-3.5" />
                <span>Portal ({session.name.split(' ')[0]})</span>
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => router.push('/login')}
                className="gap-1.5 font-semibold text-xs bg-[#3157D5] hover:bg-[#243FA8] text-white rounded-lg px-3.5 h-8 shadow-xs transition-all duration-200 hover:shadow-sm hover:translate-x-0.5 active:scale-95"
              >
                <span>{t.openPortals}</span>
                <ArrowRight className="size-3.5" />
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden rounded-lg p-1.5 text-[#64748B] hover:bg-[#F7F9FE] transition-colors"
            >
              {isMobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#DCE4F0] bg-white px-4 py-3 space-y-2 animate-in slide-in-from-top-2 duration-150 dark:bg-[#111A2B] dark:border-[#1E2D45]">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => {
                  setActiveTab(l.href)
                  setIsMobileMenuOpen(false)
                }}
                className={`block rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                  activeTab === l.href
                    ? 'bg-[#3157D5] text-white'
                    : 'text-[#64748B] hover:bg-[#F7F9FE] dark:text-[#94A3B8]'
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  )
}
