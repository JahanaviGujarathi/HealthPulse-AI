import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getRole, roleConfigs } from '@/lib/roles'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { RoleDashboard } from '@/components/dashboard/role-dashboard'

export function generateStaticParams() {
  return Object.keys(roleConfigs).map((role) => ({ role }))
}

export default async function DashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ role: string }>
  searchParams: Promise<{ section?: string }>
}) {
  const { role } = await params
  const { section } = await searchParams

  if (!(role in roleConfigs)) {
    notFound()
  }

  const roleDef = getRole(role)
  const activeSection =
    section && roleDef.sections.some((s) => s.id === section)
      ? section
      : roleDef.sections[0].id

  return (
    <Suspense fallback={<div className="grid min-h-dvh place-items-center bg-background text-xs text-muted-foreground">Loading portal dashboard...</div>}>
      <DashboardShell role={role} activeSection={activeSection}>
        <RoleDashboard role={role} section={activeSection} />
      </DashboardShell>
    </Suspense>
  )
}
