import { CitizenDashboard } from '@/components/dashboard/roles/citizen'
import { AshaDashboard } from '@/components/dashboard/roles/asha'
import { DoctorDashboard } from '@/components/dashboard/roles/doctor'
import { LabDashboard } from '@/components/dashboard/roles/lab'
import { WaterDashboard } from '@/components/dashboard/roles/water'
import { HealthOfficerDashboard } from '@/components/dashboard/roles/health-officer'
import { CollectorDashboard } from '@/components/dashboard/roles/collector'
import { StateAdminDashboard } from '@/components/dashboard/roles/state-admin'

export function RoleDashboard({ role, section }: { role: string; section: string }) {
  switch (role) {
    case 'citizen':
      return <CitizenDashboard section={section} />
    case 'asha':
      return <AshaDashboard section={section} />
    case 'doctor':
      return <DoctorDashboard section={section} />
    case 'lab':
      return <LabDashboard section={section} />
    case 'water':
    case 'water-officer':
      return <WaterDashboard section={section} />
    case 'dho':
    case 'health-officer':
      return <HealthOfficerDashboard section={section} />
    case 'collector':
      return <CollectorDashboard section={section} />
    case 'state-admin':
      return <StateAdminDashboard section={section} />
    default:
      return <CitizenDashboard section={section} />
  }
}
