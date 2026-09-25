'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { ROLE_GROUPS, ROLE_ORDER, ROLES } from '@/lib/roles'
import { Badge } from '@/components/ui/badge'

export function RolesSection() {
  const router = useRouter()

  return (
    <section id="roles" className="border-b border-[#DCE4F0] bg-white py-14 sm:py-20 dark:bg-[#0D1525] dark:border-[#1E2D45]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#3157D5] bg-[#EEF3FF] px-3 py-1 rounded-full border border-[#DCE5FF] dark:bg-[#172554] dark:border-[#243FA8] dark:text-[#EEF3FF]">
            Role-Based Access
          </span>
          <h2 className="mt-3 text-balance text-2xl sm:text-3xl font-bold tracking-tight text-[#172554] dark:text-[#F1F5F9]">
            Dedicated Portals for Every Public Health Stakeholder
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8]">
            Each operational role has tailored dashboards, RBAC permissions, and actionable intervention controls.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-10">
          {ROLE_GROUPS.map((group) => (
            <div key={group.id}>
              <div className="mb-4 flex items-center gap-2">
                <span className="h-3.5 w-1 rounded-full bg-[#3157D5]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8]">
                  {group.label}
                </h3>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {ROLE_ORDER.filter((id) => ROLES[id].group === group.id).map((id) => {
                  const role = ROLES[id]
                  return (
                    <div
                      key={id}
                      onClick={() => router.push(`/login?redirect=/dashboard/${id}`)}
                      className="group flex flex-col justify-between rounded-2xl border border-[#DCE4F0] bg-[#F7F9FE] p-5 interactive-card hover:bg-white cursor-pointer dark:bg-[#111A2B] dark:border-[#1E2D45] dark:hover:bg-[#162032]"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="grid size-10 place-items-center rounded-xl bg-[#EEF3FF] text-[#3157D5] transition-colors group-hover:bg-[#3157D5] group-hover:text-white dark:bg-[#172554] dark:text-[#EEF3FF]">
                            <role.icon className="size-5" />
                          </div>
                          <Badge variant="outline" className="text-[10px] font-semibold border-[#DCE4F0] bg-white text-[#64748B] dark:bg-[#162032] dark:border-[#1E2D45] dark:text-[#94A3B8]">
                            {role.short}
                          </Badge>
                        </div>

                        <div className="mt-3.5">
                          <h4 className="text-base font-bold text-[#172554] flex items-center gap-1 group-hover:text-[#3157D5] transition-colors dark:text-[#F1F5F9]">
                            {role.name}
                            <ArrowUpRight className="size-3.5 text-[#94A3B8] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#3157D5]" />
                          </h4>
                          <p className="mt-0.5 text-xs font-semibold text-[#3157D5]">{role.tagline}</p>
                          <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 border-t border-[#E8EDF5] pt-3 flex items-center justify-between text-xs text-[#64748B] dark:border-[#1E2D45] dark:text-[#94A3B8]">
                        <span className="truncate text-[11px]">{role.sampleUser}</span>
                        <span className="font-semibold text-xs text-[#3157D5] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Enter Portal <ArrowRight className="size-3" />
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
