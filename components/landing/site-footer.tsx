import Link from 'next/link'
import { Brand } from '@/components/brand'
import { Lock, ShieldCheck, HeartPulse, ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card/60 pt-16 pb-12 text-xs text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-border/60">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Brand size="md" />
            <p className="text-xs leading-relaxed text-muted-foreground max-w-sm">
              HealthPulse AI is an AI-powered public health surveillance platform designed for early prediction, real-time reporting, and emergency response to water-borne disease outbreaks across districts.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px] gap-1 px-2.5 py-1">
                <ShieldCheck className="size-3.5 text-emerald-500" /> OWASP Top 10 Compliant Architecture
              </Badge>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <p className="font-bold text-foreground text-xs uppercase tracking-wider">Navigation</p>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="#how" className="hover:text-primary transition-colors">Surveillance Workflow</Link>
              </li>
              <li>
                <Link href="#ai" className="hover:text-primary transition-colors">AI Prediction Engine</Link>
              </li>
              <li>
                <Link href="#roles" className="hover:text-primary transition-colors">8 Role Portals</Link>
              </li>
            </ul>
          </div>

          {/* Role Dashboards */}
          <div className="space-y-3">
            <p className="font-bold text-foreground text-xs uppercase tracking-wider">Field & Clinical</p>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/dashboard/citizen" className="hover:text-primary transition-colors">Citizen Portal</Link>
              </li>
              <li>
                <Link href="/dashboard/asha" className="hover:text-primary transition-colors">ASHA Worker Hub</Link>
              </li>
              <li>
                <Link href="/dashboard/doctor" className="hover:text-primary transition-colors">Doctor Clinical Portal</Link>
              </li>
              <li>
                <Link href="/dashboard/lab" className="hover:text-primary transition-colors">Lab Diagnostic Portal</Link>
              </li>
              <li>
                <Link href="/dashboard/water-officer" className="hover:text-primary transition-colors">Water Officer Portal</Link>
              </li>
            </ul>
          </div>

          {/* Governance & Admin */}
          <div className="space-y-3">
            <p className="font-bold text-foreground text-xs uppercase tracking-wider">Government</p>
            <ul className="space-y-2.5 font-medium">
              <li>
                <Link href="/dashboard/dho" className="hover:text-primary transition-colors">DHO Surveillance</Link>
              </li>
              <li>
                <Link href="/dashboard/collector" className="hover:text-primary transition-colors">Collector Emergency Board</Link>
              </li>
              <li>
                <Link href="/dashboard/state-admin" className="hover:text-primary transition-colors">State Admin & Audit</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-primary transition-colors font-bold text-primary">Sign In / Register</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Trust Line */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-medium">
          <p>© {new Date().getFullYear()} HealthPulse AI. Built for public health emergency response and district disease surveillance.</p>
          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Lock className="size-3 text-emerald-500" /> End-to-End Encrypted
            </span>
            <span>·</span>
            <span>RBAC Permissioned</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
