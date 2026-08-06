'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowUpRight, Lock, ShieldCheck } from 'lucide-react'
import { ROLE_GROUPS, ROLE_ORDER, ROLES } from '@/lib/roles'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function RolesSection() {
  const router = useRouter()

  return (
    <section id="roles" className="border-b border-border bg-card/40 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="max-w-3xl">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            Role-Based Portals
          </span>
          <h2 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            One platform, eight specialized role portals
          </h2>
          <p className="mt-2 text-sm sm:text-base text-muted-foreground">
            Each role receives a purpose-built dashboard with secure permission controls. Select any role to log in and inspect the workflow.
          </p>
        </div>

        <div className="mt-12 flex flex-col gap-12">
          {ROLE_GROUPS.map((group) => (
            <div key={group.id}>
              <div className="mb-5 flex items-center gap-2">
                <span className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.label}
                </h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {ROLE_ORDER.filter((id) => ROLES[id].group === group.id).map((id) => {
                  const role = ROLES[id]
                  return (
                    <div
                      key={id}
                      onClick={() => router.push(`/login?redirect=/dashboard/${id}`)}
                      className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/10 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="grid size-12 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                            <role.icon className="size-6 transition-colors" />
                          </div>
                          <Badge variant="outline" className="text-[10px] font-medium border-primary/20 bg-primary/5 text-primary">
                            {role.short}
                          </Badge>
                        </div>

                        <div className="mt-4">
                          <h4 className="text-lg font-bold text-foreground flex items-center gap-1 transition-colors group-hover:text-primary">
                            {role.name}
                            <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" />
                          </h4>
                          <p className="mt-1 text-xs font-semibold text-primary">{role.tagline}</p>
                          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                            {role.description}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 border-t border-border/50 pt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate">{role.sampleUser}</span>
                        <span className="font-semibold text-primary flex items-center gap-1 transition-all duration-300 group-hover:translate-x-1">
                          Sign In & Access <ArrowRight className="size-3" />
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
