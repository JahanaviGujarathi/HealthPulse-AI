import Link from 'next/link'
import { Brand } from '@/components/brand'
import { Lock, ShieldCheck, HeartPulse, ExternalLink, ArrowUpRight, Activity } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

export function SiteFooter() {
  return (
    <footer className="border-t border-[#DCE4F0] bg-white pt-14 pb-10 text-xs text-[#64748B] dark:bg-[#0D1525] dark:border-[#1E2D45] dark:text-[#94A3B8]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5 pb-12 border-b border-[#E8EDF5] dark:border-[#1E2D45]">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-3.5">
            <Link href="/" className="inline-block transition-transform duration-200 hover:scale-[1.01]">
              <Brand size="md" />
            </Link>
            <p className="text-xs leading-relaxed text-[#64748B] max-w-sm dark:text-[#94A3B8]">
              HealthPulse AI is an early warning surveillance network designed for water quality monitoring, field symptom reporting, and automated clinical dispatch across rural and urban districts.
            </p>
            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#A7F3D0] bg-[#EAF8F1] px-2.5 py-1 text-[11px] font-semibold text-[#3BAA72]">
                <ShieldCheck className="size-3.5" />
                <span>OWASP Standardized Architecture</span>
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div className="space-y-3">
            <p className="font-bold text-[#172554] text-xs uppercase tracking-wider dark:text-[#F1F5F9]">Platform</p>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>Home Overview</span>
                </Link>
              </li>
              <li>
                <Link href="#how" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>How It Works</span>
                </Link>
              </li>
              <li>
                <Link href="#ai" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>Safety Capabilities</span>
                </Link>
              </li>
              <li>
                <Link href="#disease-map" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>India Outbreak Map</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical & Field Roles */}
          <div className="space-y-3">
            <p className="font-bold text-[#172554] text-xs uppercase tracking-wider dark:text-[#F1F5F9]">Field Portals</p>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/dashboard/citizen" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>Citizen Portal</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/asha" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>ASHA Worker Hub</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/doctor" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>Doctor Diagnostics</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/lab" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>Water Testing Lab</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/water-officer" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>PHED Water Control</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Governance & Operations */}
          <div className="space-y-3">
            <p className="font-bold text-[#172554] text-xs uppercase tracking-wider dark:text-[#F1F5F9]">Governance</p>
            <ul className="space-y-2 font-medium">
              <li>
                <Link href="/dashboard/dho" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>District Health Officer</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/collector" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>District Collector</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/dashboard/state-admin" className="hover:text-[#3157D5] transition-colors inline-flex items-center gap-1 group">
                  <span>State Admin & Audit</span>
                  <ArrowUpRight className="size-3 text-[#94A3B8] opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/login" className="inline-flex items-center gap-1 rounded-md bg-[#EEF3FF] px-2 py-1 text-xs font-semibold text-[#3157D5] hover:bg-[#3157D5] hover:text-white transition-all dark:bg-[#172554] dark:text-[#EEF3FF]">
                  <span>Sign In to Portal</span>
                  <ArrowUpRight className="size-3" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Trust & Legal Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-normal text-[11px]">
          <p>© {new Date().getFullYear()} HealthPulse AI. Public health surveillance and epidemic early warning system.</p>
          <div className="flex items-center gap-4 text-[#94A3B8]">
            <span className="flex items-center gap-1 text-[#3BAA72] font-medium">
              <Lock className="size-3" /> AES-256 Encrypted
            </span>
            <span>·</span>
            <span>Aadhaar Authenticated</span>
            <span>·</span>
            <span>Real-time Telemetry</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
