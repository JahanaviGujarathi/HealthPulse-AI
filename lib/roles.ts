import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BarChart3,
  Beaker,
  Bell,
  BookOpen,
  Building2,
  ClipboardList,
  Droplets,
  FileText,
  FlaskConical,
  HeartPulse,
  Home,
  Landmark,
  Map,
  Microscope,
  ShieldCheck,
  Siren,
  Sparkles,
  Stethoscope,
  Truck,
  UserCheck,
  Users,
} from 'lucide-react'

export type RoleId =
  | 'citizen'
  | 'asha'
  | 'doctor'
  | 'lab'
  | 'water-officer'
  | 'dho'
  | 'collector'
  | 'state-admin'

export type RoleAlias = 'water' | 'health-officer'

export type RoleKey = RoleId | RoleAlias

export interface RoleNavItem {
  id: string
  label: string
  anchor: string
  icon: LucideIcon
}

export interface RoleDefinition {
  id: RoleId
  alias?: RoleAlias
  name: string
  short: string
  icon: LucideIcon
  tagline: string
  description: string
  sampleUser: string
  scope: string
  nav: RoleNavItem[]
  sections: RoleNavItem[]
  group: 'field' | 'clinical' | 'government'
}

export const ROLES: Record<RoleId, RoleDefinition> = {
  citizen: {
    id: 'citizen',
    name: 'Citizen & Community Hub',
    short: 'Citizen',
    icon: Users,
    group: 'field',
    tagline: 'Your local society health & water bulletin',
    description:
      'Check local water safety, report illness or contamination, request clean water tankers, and view nearby open clinics.',
    sampleUser: 'Rahul Das',
    scope: 'Majuli Village · Assam',
    nav: [
      { id: 'overview', label: 'Society Bulletin', anchor: 'overview', icon: Home },
      { id: 'report', label: 'Report Issue / Symptoms', anchor: 'report', icon: ClipboardList },
      { id: 'map', label: 'Clean Water & Clinics', anchor: 'map', icon: Map },
      { id: 'reports', label: 'My Family Reports', anchor: 'reports', icon: FileText },
      { id: 'awareness', label: 'Water Safety Tips', anchor: 'awareness', icon: BookOpen },
    ],
    sections: [
      { id: 'overview', label: 'Society Bulletin', anchor: 'overview', icon: Home },
      { id: 'report', label: 'Report Issue / Symptoms', anchor: 'report', icon: ClipboardList },
      { id: 'map', label: 'Clean Water & Clinics', anchor: 'map', icon: Map },
      { id: 'reports', label: 'My Family Reports', anchor: 'reports', icon: FileText },
      { id: 'awareness', label: 'Water Safety Tips', anchor: 'awareness', icon: BookOpen },
    ],
  },
  asha: {
    id: 'asha',
    name: 'ASHA Worker',
    short: 'ASHA',
    icon: HeartPulse,
    group: 'field',
    tagline: 'Field surveys & village monitoring',
    description:
      'Collect household surveys, verify citizen reports, upload suspected cases, and monitor assigned villages — even offline.',
    sampleUser: 'Anjali Boro',
    scope: '4 assigned villages · Jorhat',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'surveys', label: 'Household Surveys', anchor: 'surveys', icon: ClipboardList },
      { id: 'verify', label: 'Verify Reports', anchor: 'verify', icon: UserCheck },
      { id: 'villages', label: 'Village Health', anchor: 'villages', icon: Map },
      { id: 'sync', label: 'Offline Sync', anchor: 'sync', icon: Activity },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'surveys', label: 'Household Surveys', anchor: 'surveys', icon: ClipboardList },
      { id: 'verify', label: 'Verify Reports', anchor: 'verify', icon: UserCheck },
      { id: 'villages', label: 'Village Health', anchor: 'villages', icon: Map },
      { id: 'sync', label: 'Offline Sync', anchor: 'sync', icon: Activity },
    ],
  },
  doctor: {
    id: 'doctor',
    name: 'Doctor',
    short: 'Doctor',
    icon: Stethoscope,
    group: 'clinical',
    tagline: 'Confirmed cases & treatment',
    description:
      'Upload confirmed disease cases, update treatment status, track daily patient statistics, and monitor disease trends.',
    sampleUser: 'Dr. Meera Nair',
    scope: 'Jorhat Civil Hospital',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'cases', label: 'Confirmed Cases', anchor: 'cases', icon: ClipboardList },
      { id: 'stats', label: 'Patient Stats', anchor: 'stats', icon: BarChart3 },
      { id: 'trends', label: 'Disease Trends', anchor: 'trends', icon: Activity },
      { id: 'alerts', label: 'Alerts', anchor: 'alerts', icon: Bell },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'cases', label: 'Confirmed Cases', anchor: 'cases', icon: ClipboardList },
      { id: 'stats', label: 'Patient Stats', anchor: 'stats', icon: BarChart3 },
      { id: 'trends', label: 'Disease Trends', anchor: 'trends', icon: Activity },
      { id: 'alerts', label: 'Alerts', anchor: 'alerts', icon: Bell },
    ],
  },
  lab: {
    id: 'lab',
    name: 'Laboratory Staff',
    short: 'Lab',
    icon: FlaskConical,
    group: 'clinical',
    tagline: 'Lab reports & confirmations',
    description:
      'Upload laboratory reports, confirm diseases, process water sample tests, and manage report verification.',
    sampleUser: 'Sanjay Kalita',
    scope: 'District Diagnostic Lab · Jorhat',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'reports', label: 'Lab Reports', anchor: 'reports', icon: Microscope },
      { id: 'confirm', label: 'Disease Confirmation', anchor: 'confirm', icon: UserCheck },
      { id: 'water', label: 'Water Samples', anchor: 'water', icon: Droplets },
      { id: 'history', label: 'Test History', anchor: 'history', icon: FileText },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'reports', label: 'Lab Reports', anchor: 'reports', icon: Microscope },
      { id: 'confirm', label: 'Disease Confirmation', anchor: 'confirm', icon: UserCheck },
      { id: 'water', label: 'Water Samples', anchor: 'water', icon: Droplets },
      { id: 'history', label: 'Test History', anchor: 'history', icon: FileText },
    ],
  },
  'water-officer': {
    id: 'water-officer',
    alias: 'water',
    name: 'Water Testing Officer',
    short: 'Water',
    icon: Droplets,
    group: 'field',
    tagline: 'Water quality monitoring',
    description:
      'Upload water quality reports (pH, turbidity, chlorine, bacteria), map water sources, and generate contamination reports.',
    sampleUser: 'Priya Sen',
    scope: 'PHED · Jorhat Division',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'test', label: 'Upload Water Test', anchor: 'test', icon: Beaker },
      { id: 'sources', label: 'Water Sources', anchor: 'sources', icon: Map },
      { id: 'trends', label: 'Quality Trends', anchor: 'trends', icon: BarChart3 },
      { id: 'risk', label: 'Risk Predictions', anchor: 'risk', icon: Sparkles },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'test', label: 'Upload Water Test', anchor: 'test', icon: Beaker },
      { id: 'sources', label: 'Water Sources', anchor: 'sources', icon: Map },
      { id: 'trends', label: 'Quality Trends', anchor: 'trends', icon: BarChart3 },
      { id: 'risk', label: 'Risk Predictions', anchor: 'risk', icon: Sparkles },
    ],
  },
  dho: {
    id: 'dho',
    alias: 'health-officer',
    name: 'District Health Officer',
    short: 'DHO',
    icon: ShieldCheck,
    group: 'government',
    tagline: 'District surveillance & AI predictions',
    description:
      'Monitor the district dashboard, view hotspots and AI outbreak predictions, manage resources, and approve alerts.',
    sampleUser: 'Dr. Arun Gogoi',
    scope: 'Jorhat District Health Office',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'map', label: 'Hotspot Map', anchor: 'map', icon: Map },
      { id: 'ai', label: 'AI Predictions', anchor: 'ai', icon: Sparkles },
      { id: 'resources', label: 'Resources', anchor: 'resources', icon: Truck },
      { id: 'alerts', label: 'Approve Alerts', anchor: 'alerts', icon: Siren },
      { id: 'reports', label: 'Reports', anchor: 'reports', icon: FileText },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'map', label: 'Hotspot Map', anchor: 'map', icon: Map },
      { id: 'ai', label: 'AI Predictions', anchor: 'ai', icon: Sparkles },
      { id: 'resources', label: 'Resources', anchor: 'resources', icon: Truck },
      { id: 'alerts', label: 'Approve Alerts', anchor: 'alerts', icon: Siren },
      { id: 'reports', label: 'Reports', anchor: 'reports', icon: FileText },
    ],
  },
  collector: {
    id: 'collector',
    name: 'District Collector',
    short: 'Collector',
    icon: Landmark,
    group: 'government',
    tagline: 'Emergency response & allocation',
    description:
      'Oversee the emergency dashboard, allocate resources, review district analytics, and issue high-priority notifications.',
    sampleUser: 'Kavya Reddy, IAS',
    scope: 'Office of the District Collector · Jorhat',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'emergency', label: 'Emergency Board', anchor: 'emergency', icon: Siren },
      { id: 'allocation', label: 'Resource Allocation', anchor: 'allocation', icon: Truck },
      { id: 'analytics', label: 'District Analytics', anchor: 'analytics', icon: BarChart3 },
      { id: 'notifications', label: 'Notifications', anchor: 'notifications', icon: Bell },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'emergency', label: 'Emergency Board', anchor: 'emergency', icon: Siren },
      { id: 'allocation', label: 'Resource Allocation', anchor: 'allocation', icon: Truck },
      { id: 'analytics', label: 'District Analytics', anchor: 'analytics', icon: BarChart3 },
      { id: 'notifications', label: 'Notifications', anchor: 'notifications', icon: Bell },
    ],
  },
  'state-admin': {
    id: 'state-admin',
    name: 'State Administrator',
    short: 'State Admin',
    icon: Building2,
    group: 'government',
    tagline: 'Platform governance & AI models',
    description:
      'Verify users, approve organizations, manage AI models, monitor the system, and review audit logs across all districts.',
    sampleUser: 'Dr. N. Sharma',
    scope: 'State Health Department · Assam',
    nav: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'users', label: 'User Verification', anchor: 'users', icon: UserCheck },
      { id: 'models', label: 'AI Models', anchor: 'models', icon: Sparkles },
      { id: 'system', label: 'System Monitoring', anchor: 'system', icon: Activity },
      { id: 'audit', label: 'Audit Logs', anchor: 'audit', icon: FileText },
    ],
    sections: [
      { id: 'overview', label: 'Overview', anchor: 'overview', icon: Home },
      { id: 'users', label: 'User Verification', anchor: 'users', icon: UserCheck },
      { id: 'models', label: 'AI Models', anchor: 'models', icon: Sparkles },
      { id: 'system', label: 'System Monitoring', anchor: 'system', icon: Activity },
      { id: 'audit', label: 'Audit Logs', anchor: 'audit', icon: FileText },
    ],
  },
}

export const roleConfigs: Record<string, RoleDefinition> = {
  ...ROLES,
  water: ROLES['water-officer'],
  'health-officer': ROLES['dho'],
}

export const ROLE_ORDER: RoleId[] = [
  'citizen',
  'asha',
  'doctor',
  'lab',
  'water-officer',
  'dho',
  'collector',
  'state-admin',
]

export const ROLE_GROUPS: { id: RoleDefinition['group']; label: string }[] = [
  { id: 'field', label: 'Field & Community' },
  { id: 'clinical', label: 'Clinical & Laboratory' },
  { id: 'government', label: 'Government & Administration' },
]

export function normalizeRole(role: string): RoleId {
  if (role === 'water') return 'water-officer'
  if (role === 'health-officer') return 'dho'
  if (role in ROLES) return role as RoleId
  return 'citizen'
}

export function getRole(id: string): RoleDefinition {
  const norm = normalizeRole(id)
  return ROLES[norm] || ROLES.citizen
}
