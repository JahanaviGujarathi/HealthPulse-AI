// Central mock dataset for the HealthPulse AI prototype.
// Replace these exports with real API / database calls when live data is available.

export type RiskLevel = 'high' | 'medium' | 'low'
export type ReportStatus = 'pending' | 'verified' | 'confirmed' | 'rejected'

export const DISEASES = ['Cholera', 'Typhoid', 'Diarrhea', 'Dysentery', 'Hepatitis A'] as const
export type Disease = (typeof DISEASES)[number]

export interface Village {
  id: string
  name: string
  block: string
  lat: number
  lng: number
  population: number
  activeCases: number
  risk: RiskLevel
  waterRisk: RiskLevel
}

export interface Hospital {
  id: string
  name: string
  lat: number
  lng: number
  beds: number
  bedsAvailable: number
  type: 'CHC' | 'PHC' | 'Civil Hospital'
}

export interface WaterSource {
  id: string
  name: string
  village: string
  lat: number
  lng: number
  ph: number
  turbidity: number // NTU
  chlorine: number // mg/L
  bacteria: number // CFU/100ml
  risk: RiskLevel
  testedAt: string
}

export interface DiseaseReport {
  id: string
  patient: string
  village: string
  disease: Disease | 'Suspected'
  symptoms: string[]
  status: ReportStatus
  source: 'Citizen' | 'ASHA' | 'Doctor'
  reportedAt: string
  severity: RiskLevel
}

export interface Notification {
  id: string
  title: string
  body: string
  type: 'outbreak' | 'water' | 'awareness' | 'resource' | 'emergency'
  severity: RiskLevel
  time: string
  audience: 'citizen' | 'government'
}

export interface AiPrediction {
  id: string
  village: string
  disease: Disease
  riskPercent: number
  confidence: number
  window: string
  drivers: string[]
}

// ---------------------------------------------------------------------------
// Region: Jorhat & Majuli, Assam
// ---------------------------------------------------------------------------

export const REGION_CENTER: [number, number] = [26.75, 94.2]

export const VILLAGES: Village[] = [
  { id: 'v1', name: 'Kamalabari', block: 'Majuli', lat: 26.95, lng: 94.17, population: 5400, activeCases: 42, risk: 'high', waterRisk: 'high' },
  { id: 'v2', name: 'Garamur', block: 'Majuli', lat: 27.0, lng: 94.22, population: 4100, activeCases: 28, risk: 'high', waterRisk: 'medium' },
  { id: 'v3', name: 'Dakhinpat', block: 'Majuli', lat: 26.9, lng: 94.13, population: 3200, activeCases: 11, risk: 'medium', waterRisk: 'medium' },
  { id: 'v4', name: 'Titabor', block: 'Titabor', lat: 26.6, lng: 94.2, population: 8900, activeCases: 6, risk: 'low', waterRisk: 'low' },
  { id: 'v5', name: 'Teok', block: 'Teok', lat: 26.83, lng: 94.4, population: 6700, activeCases: 19, risk: 'medium', waterRisk: 'high' },
  { id: 'v6', name: 'Mariani', block: 'Mariani', lat: 26.66, lng: 94.32, population: 7300, activeCases: 3, risk: 'low', waterRisk: 'low' },
  { id: 'v7', name: 'Jorhat Town', block: 'Jorhat', lat: 26.75, lng: 94.2, population: 15300, activeCases: 24, risk: 'medium', waterRisk: 'medium' },
  { id: 'v8', name: 'Cinnamora', block: 'Jorhat', lat: 26.7, lng: 94.15, population: 4800, activeCases: 8, risk: 'low', waterRisk: 'medium' },
]

export const HOSPITALS: Hospital[] = [
  { id: 'h1', name: 'Jorhat Civil Hospital', lat: 26.75, lng: 94.21, beds: 320, bedsAvailable: 54, type: 'Civil Hospital' },
  { id: 'h2', name: 'Majuli CHC', lat: 26.96, lng: 94.18, beds: 60, bedsAvailable: 6, type: 'CHC' },
  { id: 'h3', name: 'Titabor PHC', lat: 26.6, lng: 94.2, beds: 30, bedsAvailable: 18, type: 'PHC' },
  { id: 'h4', name: 'Teok PHC', lat: 26.83, lng: 94.4, beds: 24, bedsAvailable: 4, type: 'PHC' },
]

export const WATER_SOURCES: WaterSource[] = [
  { id: 'w1', name: 'Kamalabari Community Well', village: 'Kamalabari', lat: 26.951, lng: 94.171, ph: 5.9, turbidity: 12.4, chlorine: 0.1, bacteria: 480, risk: 'high', testedAt: '2 hours ago' },
  { id: 'w2', name: 'Garamur Tube Well #3', village: 'Garamur', lat: 27.001, lng: 94.221, ph: 6.4, turbidity: 7.8, chlorine: 0.2, bacteria: 210, risk: 'medium', testedAt: '5 hours ago' },
  { id: 'w3', name: 'Teok River Intake', village: 'Teok', lat: 26.831, lng: 94.401, ph: 6.1, turbidity: 15.2, chlorine: 0.05, bacteria: 620, risk: 'high', testedAt: '1 hour ago' },
  { id: 'w4', name: 'Jorhat Municipal Supply', village: 'Jorhat Town', lat: 26.751, lng: 94.201, ph: 7.1, turbidity: 2.1, chlorine: 0.6, bacteria: 20, risk: 'low', testedAt: '3 hours ago' },
  { id: 'w5', name: 'Titabor Piped Supply', village: 'Titabor', lat: 26.601, lng: 94.201, ph: 7.3, turbidity: 1.4, chlorine: 0.7, bacteria: 8, risk: 'low', testedAt: '6 hours ago' },
  { id: 'w6', name: 'Dakhinpat Pond', village: 'Dakhinpat', lat: 26.901, lng: 94.131, ph: 6.6, turbidity: 9.1, chlorine: 0.15, bacteria: 260, risk: 'medium', testedAt: '4 hours ago' },
]

export const DISEASE_REPORTS: DiseaseReport[] = [
  { id: 'r1', patient: 'K. R. Hazarika', village: 'Kamalabari', disease: 'Suspected', symptoms: ['Watery diarrhea', 'Vomiting', 'Dehydration'], status: 'pending', source: 'Citizen', reportedAt: '18 min ago', severity: 'high' },
  { id: 'r2', patient: 'B. Hazarika', village: 'Kamalabari', disease: 'Cholera', symptoms: ['Severe diarrhea', 'Cramps'], status: 'confirmed', source: 'Doctor', reportedAt: '1 hour ago', severity: 'high' },
  { id: 'r3', patient: 'P. Boro', village: 'Garamur', disease: 'Suspected', symptoms: ['Fever', 'Abdominal pain'], status: 'verified', source: 'ASHA', reportedAt: '2 hours ago', severity: 'medium' },
  { id: 'r4', patient: 'M. Pegu', village: 'Teok', disease: 'Typhoid', symptoms: ['Prolonged fever', 'Weakness'], status: 'confirmed', source: 'Doctor', reportedAt: '3 hours ago', severity: 'medium' },
  { id: 'r5', patient: 'J. Kalita', village: 'Dakhinpat', disease: 'Suspected', symptoms: ['Loose stools'], status: 'pending', source: 'Citizen', reportedAt: '4 hours ago', severity: 'low' },
  { id: 'r6', patient: 'R. Saikia', village: 'Jorhat Town', disease: 'Hepatitis A', symptoms: ['Jaundice', 'Fatigue', 'Nausea'], status: 'confirmed', source: 'Doctor', reportedAt: '6 hours ago', severity: 'medium' },
  { id: 'r7', patient: 'S. Saikia', village: 'Garamur', disease: 'Suspected', symptoms: ['Dysentery', 'Blood in stool'], status: 'verified', source: 'ASHA', reportedAt: '7 hours ago', severity: 'high' },
  { id: 'r8', patient: 'M. Nath', village: 'Cinnamora', disease: 'Suspected', symptoms: ['Mild fever'], status: 'rejected', source: 'Citizen', reportedAt: '9 hours ago', severity: 'low' },
]

// 14-day case trend by disease
export const CASE_TREND = Array.from({ length: 14 }).map((_, i) => {
  const day = i + 1
  return {
    day: `Day ${day}`,
    Cholera: Math.round(4 + i * 1.6 + (i > 8 ? (i - 8) * 3 : 0)),
    Typhoid: Math.round(3 + i * 0.8),
    Diarrhea: Math.round(6 + i * 1.1 + (i > 6 ? (i - 6) * 1.5 : 0)),
    Dysentery: Math.round(2 + i * 0.5),
    'Hepatitis A': Math.round(1 + i * 0.4),
  }
})

// Water quality trend (last 12 readings for a monitored source)
export const WATER_TREND = Array.from({ length: 12 }).map((_, i) => ({
  reading: `R${i + 1}`,
  ph: +(7.2 - i * 0.11 + (i % 3 === 0 ? 0.05 : 0)).toFixed(2),
  turbidity: +(2 + i * 1.05).toFixed(1),
  chlorine: +(0.7 - i * 0.05).toFixed(2),
}))

export const CASES_BY_BLOCK = [
  { block: 'Majuli', cases: 81, recovered: 39 },
  { block: 'Teok', cases: 19, recovered: 11 },
  { block: 'Jorhat', cases: 32, recovered: 22 },
  { block: 'Titabor', cases: 6, recovered: 5 },
  { block: 'Mariani', cases: 3, recovered: 3 },
]

export const AI_PREDICTIONS: AiPrediction[] = [
  { id: 'p1', village: 'Kamalabari', disease: 'Cholera', riskPercent: 87, confidence: 91, window: 'Next 7 days', drivers: ['Bacterial contamination 480 CFU', 'Low chlorine 0.1 mg/L', '42 active cases', 'Heavy rainfall forecast'] },
  { id: 'p2', village: 'Teok', disease: 'Diarrhea', riskPercent: 64, confidence: 82, window: 'Next 7 days', drivers: ['River intake turbidity 15.2 NTU', 'Rising case count', 'Monsoon runoff'] },
  { id: 'p3', village: 'Garamur', disease: 'Typhoid', riskPercent: 48, confidence: 76, window: 'Next 14 days', drivers: ['Tube well pH 6.4', 'Cluster of suspected cases'] },
]

export const NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Boil Water Advisory — Kamalabari', body: 'Confirmed contamination in the community well. Boil all drinking water for at least 1 minute.', type: 'water', severity: 'high', time: '20 min ago', audience: 'citizen' },
  { id: 'n2', title: 'Cholera outbreak risk: Kamalabari', body: 'AI predicts 87% outbreak risk in the next 7 days. Pre-position ORS and IV fluids.', type: 'outbreak', severity: 'high', time: '25 min ago', audience: 'government' },
  { id: 'n3', title: 'Resource shortage: Majuli CHC', body: 'Only 6 of 60 beds available. Recommend transfer capacity to Jorhat Civil Hospital.', type: 'resource', severity: 'medium', time: '1 hour ago', audience: 'government' },
  { id: 'n4', title: 'Vaccination camp this weekend', body: 'Free Hepatitis A vaccination at Garamur PHC, Sat–Sun 9 AM–4 PM.', type: 'awareness', severity: 'low', time: '3 hours ago', audience: 'citizen' },
  { id: 'n5', title: 'Water contamination: Teok River Intake', body: 'Turbidity and bacterial levels exceed safe limits. Chlorination dispatched.', type: 'water', severity: 'high', time: '4 hours ago', audience: 'government' },
]

export const RESOURCE_FORECAST = [
  { resource: 'Hospital beds', current: 82, required: 140, unit: 'beds' },
  { resource: 'Doctors', current: 24, required: 34, unit: 'staff' },
  { resource: 'ORS packets', current: 4200, required: 9000, unit: 'packets' },
  { resource: 'IV fluids', current: 620, required: 1500, unit: 'units' },
  { resource: 'Ambulances', current: 7, required: 11, unit: 'vehicles' },
]

export const AWARENESS = [
  { id: 'a1', title: 'Preventing Cholera', body: 'Drink only boiled or treated water, wash hands with soap, and eat freshly cooked food.', tag: 'Water Safety' },
  { id: 'a2', title: 'Recognising Dehydration', body: 'Watch for dry mouth, sunken eyes, and reduced urination. Start ORS immediately and seek care.', tag: 'Symptoms' },
  { id: 'a3', title: 'Safe Water Storage', body: 'Store treated water in clean, covered containers and use a ladle instead of dipping hands.', tag: 'Water Safety' },
  { id: 'a4', title: 'When to Visit a Hospital', body: 'Seek urgent care for persistent vomiting, high fever, blood in stool, or signs of severe dehydration.', tag: 'Care' },
]

export const PENDING_USERS = [
  { id: 'u1', name: 'Dr. Ritu Bora', role: 'Doctor', org: 'Mariani PHC', submitted: '2 hours ago', status: 'pending' as const },
  { id: 'u2', name: 'Lakhi Doley', role: 'ASHA Worker', org: 'Majuli Block', submitted: '5 hours ago', status: 'pending' as const },
  { id: 'u3', name: 'Assam Diagnostics', role: 'Laboratory', org: 'Private Lab', submitted: '1 day ago', status: 'pending' as const },
  { id: 'u4', name: 'Bhaskar Nath', role: 'Water Officer', org: 'PHED Teok', submitted: '1 day ago', status: 'pending' as const },
]

export const AUDIT_LOGS = [
  { id: 'l1', actor: 'Dr. Arun Gogoi', action: 'Approved outbreak alert for Kamalabari', time: '20 min ago', level: 'info' as const },
  { id: 'l2', actor: 'System', action: 'AI model v2.4 generated 3 predictions', time: '25 min ago', level: 'info' as const },
  { id: 'l3', actor: 'Priya Sen', action: 'Uploaded water test for Teok River Intake', time: '1 hour ago', level: 'info' as const },
  { id: 'l4', actor: 'Kavya Reddy', action: 'Allocated 40 beds to Jorhat Civil Hospital', time: '2 hours ago', level: 'warning' as const },
  { id: 'l5', actor: 'System', action: 'Duplicate report detected & merged (#241/#239)', time: '3 hours ago', level: 'warning' as const },
]

export const AI_MODELS = [
  { id: 'm1', name: 'Outbreak Prediction', version: 'v2.4', accuracy: 91, status: 'active' as const, lastTrained: '2 days ago' },
  { id: 'm2', name: 'Water Risk Classifier', version: 'v1.8', accuracy: 88, status: 'active' as const, lastTrained: '5 days ago' },
  { id: 'm3', name: 'Hotspot Detection', version: 'v3.1', accuracy: 93, status: 'active' as const, lastTrained: '1 day ago' },
  { id: 'm4', name: 'Anomaly & Misinformation Classifier', version: 'v1.2', accuracy: 84, status: 'training' as const, lastTrained: 'in progress' },
]

// ---------------------------------------------------------------------------
// Aggregate helpers
// ---------------------------------------------------------------------------

export const TOTALS = {
  activeCases: VILLAGES.reduce((s, v) => s + v.activeCases, 0),
  villagesMonitored: VILLAGES.length,
  highRiskVillages: VILLAGES.filter((v) => v.risk === 'high').length,
  waterSourcesTested: WATER_SOURCES.length,
  contaminatedSources: WATER_SOURCES.filter((w) => w.risk === 'high').length,
  pendingReports: DISEASE_REPORTS.filter((r) => r.status === 'pending').length,
  population: VILLAGES.reduce((s, v) => s + v.population, 0),
}

export const riskLabel: Record<RiskLevel, string> = {
  high: 'High risk',
  medium: 'Medium risk',
  low: 'Low / safe',
}
