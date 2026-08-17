'use client'

import { useState } from 'react'
import {
  Sparkles,
  Send,
  Bot,
  User,
  AlertTriangle,
  ShieldCheck,
  Activity,
  MapPin,
  TrendingUp,
  Info,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  Search,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { generateEpidemiologyReport } from '@/lib/report-generator'
import { FormattedMarkdownText } from '@/components/ui/formatted-markdown'

export type RiskLevel = 'High Risk' | 'Medium Risk' | 'Low Risk'

export interface StateHealthData {
  id: string
  name: string
  code: string
  risk: RiskLevel
  primaryDiseases: string[]
  activeOutbreaks: number
  riskScore: number
  keySymptoms: string[]
  preventionTips: string[]
  aiSummary: string
  // Cartogram Grid Position: Row 1-8, Col 1-7
  gridPos: { row: number; col: number }
}

const INDIAN_STATES_DATA: Record<string, StateHealthData> = {
  LA: {
    id: 'LA',
    name: 'Ladakh',
    code: 'LA',
    risk: 'Low Risk',
    primaryDiseases: ['High Altitude Sickness', 'Respiratory Infections'],
    activeOutbreaks: 0,
    riskScore: 18,
    keySymptoms: ['Hypoxia', 'Cold Cough', 'Shortness of breath'],
    preventionTips: ['Acclimatization', 'Warm hydration', 'Thermal gear'],
    aiSummary: 'Ladakh shows minimal waterborne outbreak activity. Monitoring respiratory cases during extreme freeze conditions.',
    gridPos: { row: 1, col: 3 },
  },
  JK: {
    id: 'JK',
    name: 'Jammu & Kashmir',
    code: 'JK',
    risk: 'Low Risk',
    primaryDiseases: ['Seasonal Influenza', 'Waterborne Enteric Fever'],
    activeOutbreaks: 1,
    riskScore: 24,
    keySymptoms: ['Chills', 'Fever', 'Nausea'],
    preventionTips: ['Clean drinking water', 'Flu vaccination', 'Boil water advisories in flood zones'],
    aiSummary: 'Low surge in waterborne enteric fever in localized river valleys. General surveillance stable.',
    gridPos: { row: 1, col: 2 },
  },
  HP: {
    id: 'HP',
    name: 'Himachal Pradesh',
    code: 'HP',
    risk: 'Low Risk',
    primaryDiseases: ['Scrub Typhus', 'Gastroenteritis'],
    activeOutbreaks: 1,
    riskScore: 28,
    keySymptoms: ['Eschar rash', 'High fever', 'Body ache'],
    preventionTips: ['Insect repellents', 'Boil water during monsoons', 'Avoid tall grass'],
    aiSummary: 'Scrub Typhus vector surveillance active in rural hilly districts. Water quality checks ongoing.',
    gridPos: { row: 2, col: 3 },
  },
  PB: {
    id: 'PB',
    name: 'Punjab',
    code: 'PB',
    risk: 'Low Risk',
    primaryDiseases: ['Hepatitis E', 'Dengue'],
    activeOutbreaks: 2,
    riskScore: 35,
    keySymptoms: ['Jaundice', 'Abdominal pain', 'High fever'],
    preventionTips: ['Chlorinated canal water supply', 'Mosquito breeding control', 'Safe food handling'],
    aiSummary: 'Moderate surveillance on agricultural run-off canal water. Low-level vector density monitored.',
    gridPos: { row: 2, col: 2 },
  },
  UT: {
    id: 'UT',
    name: 'Uttarakhand',
    code: 'UT',
    risk: 'Low Risk',
    primaryDiseases: ['Acute Diarrheal Disease', 'Chikungunya'],
    activeOutbreaks: 1,
    riskScore: 32,
    keySymptoms: ['Joint pain', 'Dehydration', 'Fever'],
    preventionTips: ['Spring water filtration', 'Stagnant water clearance', 'ORS distribution'],
    aiSummary: 'Pilgrimage corridor health monitoring active. Water spring turbidity within safety thresholds.',
    gridPos: { row: 2, col: 4 },
  },
  HR: {
    id: 'HR',
    name: 'Haryana',
    code: 'HR',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Typhoid'],
    activeOutbreaks: 2,
    riskScore: 41,
    keySymptoms: ['High fever', 'Headache', 'Vomiting'],
    preventionTips: ['Anti-larval spray', 'Safe drinking water tanks', 'Early blood screening'],
    aiSummary: 'Peri-urban industrial zones under daily vector monitoring. Low risk classification maintained.',
    gridPos: { row: 3, col: 2 },
  },
  DL: {
    id: 'DL',
    name: 'Delhi NCR',
    code: 'DL',
    risk: 'High Risk',
    primaryDiseases: ['Dengue', 'Chikungunya', 'Respiratory Distress'],
    activeOutbreaks: 7,
    riskScore: 89,
    keySymptoms: ['High fever >103°F', 'Severe joint ache', 'Retro-orbital eye pain', 'Persistent cough'],
    preventionTips: [
      'Empty air cooler & pot water weekly',
      'Wear full-sleeves outdoors',
      'Use N95/Air purifiers during high AQI',
      'Seek early CBC platelet tests',
    ],
    aiSummary: '🚨 HIGH ALERT: Dense urban dengue & viral transmission cluster detected in Delhi-NCR. Multi-agency vector control activated.',
    gridPos: { row: 3, col: 3 },
  },
  UP: {
    id: 'UP',
    name: 'Uttar Pradesh',
    code: 'UP',
    risk: 'Low Risk',
    primaryDiseases: ['Japanese Encephalitis', 'Acute Diarrheal Disease', 'Dengue'],
    activeOutbreaks: 4,
    riskScore: 46,
    keySymptoms: ['High fever', 'Altered sensorium', 'Vomiting'],
    preventionTips: ['JE vaccination drive', 'Clean drinking water handpumps', 'Mosquito netting'],
    aiSummary: 'Eastern UP districts under seasonal JE/AES surveillance. Water pump chlorination ongoing.',
    gridPos: { row: 3, col: 4 },
  },
  SK: {
    id: 'SK',
    name: 'Sikkim',
    code: 'SK',
    risk: 'Low Risk',
    primaryDiseases: ['Hepatitis A', 'Seasonal Cold'],
    activeOutbreaks: 0,
    riskScore: 15,
    keySymptoms: ['Mild jaundice', 'Fatigue', 'Loss of appetite'],
    preventionTips: ['Boiled mountain water', 'Food hygiene in tourist spots'],
    aiSummary: 'Exceptional public health safety record. Zero active cluster outbreaks.',
    gridPos: { row: 3, col: 5 },
  },
  AR: {
    id: 'AR',
    name: 'Arunachal Pradesh',
    code: 'AR',
    risk: 'Low Risk',
    primaryDiseases: ['Falciparum Malaria', 'Gastroenteritis'],
    activeOutbreaks: 1,
    riskScore: 29,
    keySymptoms: ['High fever', 'Chills', 'Headache'],
    preventionTips: ['Long-lasting insecticidal nets (LLINs)', 'Spring water chlorination'],
    aiSummary: 'Border hill districts under LLIN bednet distribution. Low risk baseline.',
    gridPos: { row: 3, col: 7 },
  },
  RJ: {
    id: 'RJ',
    name: 'Rajasthan',
    code: 'RJ',
    risk: 'Low Risk',
    primaryDiseases: ['Malaria (Vivax)', 'Typhoid', 'Fluorosis'],
    activeOutbreaks: 3,
    riskScore: 42,
    keySymptoms: ['High fever with rigors', 'Joint weakness', 'Abdominal cramps'],
    preventionTips: ['Tanka water chlorination', 'Bednet usage in desert oases', 'Fluoride filter usage'],
    aiSummary: 'Arid reservoir monitoring active. Malaria cases stabilized in western districts.',
    gridPos: { row: 4, col: 1 },
  },
  MP: {
    id: 'MP',
    name: 'Madhya Pradesh',
    code: 'MP',
    risk: 'Low Risk',
    primaryDiseases: ['Scrub Typhus', 'Falciparum Malaria', 'Gastroenteritis'],
    activeOutbreaks: 3,
    riskScore: 45,
    keySymptoms: ['Fever with chills', 'Rashes', 'Splenomegaly'],
    preventionTips: ['IRS indoor residual spraying', 'Boil tribal well water', 'Early rapid diagnostic tests'],
    aiSummary: 'Forest corridor tribal districts under routine vector management. Water sources checked.',
    gridPos: { row: 4, col: 3 },
  },
  BR: {
    id: 'BR',
    name: 'Bihar',
    code: 'BR',
    risk: 'Low Risk',
    primaryDiseases: ['Kala-azar', 'Acute Diarrheal Disease'],
    activeOutbreaks: 3,
    riskScore: 48,
    keySymptoms: ['Prolonged fever', 'Weight loss', 'Anaemia', 'Watery stool'],
    preventionTips: ['Sandfly indoor spraying', 'Halogen tablet water treatment', 'Clean sanitation'],
    aiSummary: 'Floodplain surveillance post-monsoon active. Kala-azar elimination protocols enforced.',
    gridPos: { row: 4, col: 4 },
  },
  WB: {
    id: 'WB',
    name: 'West Bengal',
    code: 'WB',
    risk: 'High Risk',
    primaryDiseases: ['Dengue (DEN-3)', 'Cholera', 'Arsenicosis'],
    activeOutbreaks: 8,
    riskScore: 92,
    keySymptoms: ['Severe watery diarrhea', 'Platelet drop <50k', 'High fever', 'Severe dehydration'],
    preventionTips: [
      'Boil all municipal & tubewell water',
      'Use ORS & Zinc immediately for diarrhea',
      'Clean clogged urban drains daily',
      'Seek emergency hospitalization if fever >3 days',
    ],
    aiSummary: '🚨 HIGH RISK: Cholera alert in Gangetic delta & high dengue vector density in Kolkata metro.',
    gridPos: { row: 4, col: 5 },
  },
  AS: {
    id: 'AS',
    name: 'Assam',
    code: 'AS',
    risk: 'Low Risk',
    primaryDiseases: ['Japanese Encephalitis', 'Acute Diarrheal Disease'],
    activeOutbreaks: 4,
    riskScore: 49,
    keySymptoms: ['High fever', 'Confusion/Delirium', 'Dehydration'],
    preventionTips: ['Boil riverine well water', 'Piggery isolation from human habitations', 'JE vaccine drives'],
    aiSummary: 'Brahmaputra valley flood-plain surveillance ongoing. Majuli river island water safety active.',
    gridPos: { row: 4, col: 6 },
  },
  NL: {
    id: 'NL',
    name: 'Nagaland',
    code: 'NL',
    risk: 'Low Risk',
    primaryDiseases: ['Scrub Typhus', 'Malaria'],
    activeOutbreaks: 1,
    riskScore: 25,
    keySymptoms: ['Skin eschar', 'Fever', 'Muscle pain'],
    preventionTips: ['Protective clothing in forests', 'Insect repellent spray'],
    aiSummary: 'Hilly district surveillance normal. Vector density low.',
    gridPos: { row: 4, col: 7 },
  },
  GJ: {
    id: 'GJ',
    name: 'Gujarat',
    code: 'GJ',
    risk: 'Medium Risk',
    primaryDiseases: ['Chandipura Virus', 'Dengue', 'Hepatitis E'],
    activeOutbreaks: 5,
    riskScore: 68,
    keySymptoms: ['Acute encephalitis syndrome (AES)', 'High fever', 'Convulsions'],
    preventionTips: ['Sandfly control in rural houses', 'Boil municipal water'],
    aiSummary: '⚠️ MEDIUM RISK: Sandfly-borne Chandipura virus surveillance heightened in northern rural districts.',
    gridPos: { row: 5, col: 1 },
  },
  CG: {
    id: 'CG',
    name: 'Chhattisgarh',
    code: 'CG',
    risk: 'Low Risk',
    primaryDiseases: ['Malaria (Falciparum)', 'Gastroenteritis'],
    activeOutbreaks: 3,
    riskScore: 44,
    keySymptoms: ['Chills', 'Splenomegaly', 'High fever'],
    preventionTips: ['Bastar malaria Mukt Abhiyan', 'Chlorinated drinking water'],
    aiSummary: 'Tribal belt intensive malaria surveillance continuing with positive recovery trends.',
    gridPos: { row: 5, col: 3 },
  },
  JH: {
    id: 'JH',
    name: 'Jharkhand',
    code: 'JH',
    risk: 'Low Risk',
    primaryDiseases: ['Falciparum Malaria', 'Diarrheal Disease'],
    activeOutbreaks: 2,
    riskScore: 40,
    keySymptoms: ['Fever with rigors', 'Dehydration'],
    preventionTips: ['Tubewell chlorination', 'Indoor insecticide spray'],
    aiSummary: 'Mining & forest zones under routine vector & water surveillance.',
    gridPos: { row: 5, col: 4 },
  },
  TR: {
    id: 'TR',
    name: 'Tripura',
    code: 'TR',
    risk: 'Low Risk',
    primaryDiseases: ['Malaria', 'Diarrheal Infections'],
    activeOutbreaks: 1,
    riskScore: 30,
    keySymptoms: ['Fever', 'Chills', 'Nausea'],
    preventionTips: ['Clean drinking water', 'Mosquito repellant'],
    aiSummary: 'State health surveillance stable across all 8 districts.',
    gridPos: { row: 5, col: 6 },
  },
  MN: {
    id: 'MN',
    name: 'Manipur',
    code: 'MN',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Typhoid'],
    activeOutbreaks: 1,
    riskScore: 31,
    keySymptoms: ['Fever', 'Joint stiffness'],
    preventionTips: ['Stagnant water drainage around valley ponds'],
    aiSummary: 'Imphal valley vector surveillance maintained.',
    gridPos: { row: 5, col: 7 },
  },
  MH: {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH',
    risk: 'Medium Risk',
    primaryDiseases: ['Leptospirosis', 'Dengue', 'Swine Flu (H1N1)'],
    activeOutbreaks: 6,
    riskScore: 74,
    keySymptoms: ['Calf muscle pain', 'High fever', 'Conjunctival suffusion'],
    preventionTips: ['Avoid floodwater wading', 'Doxycycline prophylaxis post exposure'],
    aiSummary: '⚠️ MEDIUM RISK: Leptospirosis advisory in Mumbai-Konkan belt following monsoon waterlogging.',
    gridPos: { row: 6, col: 2 },
  },
  TG: {
    id: 'TG',
    name: 'Telangana',
    code: 'TG',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Typhoid', 'Chikungunya'],
    activeOutbreaks: 3,
    riskScore: 48,
    keySymptoms: ['Fever', 'Headache', 'Rash'],
    preventionTips: ['Hyderabad lake anti-larval spraying', 'Water tank cleaning'],
    aiSummary: 'Greater Hyderabad & district hospitals monitoring seasonal fever patient counts.',
    gridPos: { row: 6, col: 3 },
  },
  OR: {
    id: 'OR',
    name: 'Odisha',
    code: 'OR',
    risk: 'Low Risk',
    primaryDiseases: ['Malaria', 'Chikungunya', 'Diarrheal Disease'],
    activeOutbreaks: 3,
    riskScore: 47,
    keySymptoms: ['Joint pain', 'High fever', 'Weakness'],
    preventionTips: ['DAMAN mass malaria screening', 'Clean water supply post-cyclone'],
    aiSummary: 'Coastal & forest districts under proactive vector suppression.',
    gridPos: { row: 6, col: 4 },
  },
  MZ: {
    id: 'MZ',
    name: 'Mizoram',
    code: 'MZ',
    risk: 'Low Risk',
    primaryDiseases: ['Falciparum Malaria'],
    activeOutbreaks: 2,
    riskScore: 36,
    keySymptoms: ['High fever', 'Rigors', 'Anaemia'],
    preventionTips: ['LLIN mosquito nets', 'Early ACT malaria treatment'],
    aiSummary: 'Border forest malaria control active. Rapid testing available at primary health centers.',
    gridPos: { row: 6, col: 7 },
  },
  GA: {
    id: 'GA',
    name: 'Goa',
    code: 'GA',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Leptospirosis'],
    activeOutbreaks: 1,
    riskScore: 22,
    keySymptoms: ['Mild fever', 'Body pain'],
    preventionTips: ['Tourist zone water safety checks', 'Drain clearing'],
    aiSummary: 'Coastal sanitation high quality. Outbreak risk minimal.',
    gridPos: { row: 7, col: 1 },
  },
  KA: {
    id: 'KA',
    name: 'Karnataka',
    code: 'KA',
    risk: 'Medium Risk',
    primaryDiseases: ['Kyasanur Forest Disease (KFD)', 'Dengue'],
    activeOutbreaks: 5,
    riskScore: 65,
    keySymptoms: ['High fever', 'Severe muscle pain', 'Gastrointestinal bleeding'],
    preventionTips: ['DMP oil tick repellent in forests', 'KFD vaccination'],
    aiSummary: '⚠️ MEDIUM RISK: Kyasanur Forest Disease tick activity monitored in Western Ghats region.',
    gridPos: { row: 7, col: 2 },
  },
  AP: {
    id: 'AP',
    name: 'Andhra Pradesh',
    code: 'AP',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Acute Diarrheal Disease', 'Malaria'],
    activeOutbreaks: 3,
    riskScore: 45,
    keySymptoms: ['High fever', 'Body ache', 'Loose motions'],
    preventionTips: ['Dry day observance weekly', 'Chlorination of overhead tanks'],
    aiSummary: 'Rayalaseema & Coastal Andhra districts maintaining low outbreak indices.',
    gridPos: { row: 7, col: 3 },
  },
  KL: {
    id: 'KL',
    name: 'Kerala',
    code: 'KL',
    risk: 'Low Risk',
    primaryDiseases: ['Nipah Virus Surveillance', 'Leptospirosis', 'Dengue'],
    activeOutbreaks: 2,
    riskScore: 49,
    keySymptoms: ['Fever', 'Respiratory distress', 'Muscle soreness'],
    preventionTips: ['Avoid fallen bat-bitten fruits', 'Wear rubber boots in wet fields'],
    aiSummary: 'Statewide One Health surveillance active. Bat habitat monitoring ongoing.',
    gridPos: { row: 8, col: 2 },
  },
  TN: {
    id: 'TN',
    name: 'Tamil Nadu',
    code: 'TN',
    risk: 'Low Risk',
    primaryDiseases: ['Dengue', 'Chikungunya', 'Typhoid'],
    activeOutbreaks: 3,
    riskScore: 43,
    keySymptoms: ['High fever', 'Joint swellings', 'Headache'],
    preventionTips: ['Nilavembu Kudineer distribution', 'Tank chlorination'],
    aiSummary: 'Greater Chennai Corporation & district health teams running daily mosquito larva eradication.',
    gridPos: { row: 8, col: 3 },
  },
}

export function InteractiveDiseaseMapSection() {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL')
  const [hoveredStateCode, setHoveredStateCode] = useState<string | null>(null)
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'High Risk' | 'Medium Risk' | 'Low Risk'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [queryInput, setQueryInput] = useState('')
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      id: 'msg-init',
      sender: 'ai',
      text: "👋 Hi! I'm your AI Health Intelligence Assistant. Hover or click any state tile to inspect live outbreak status, or ask me any question!",
      time: '10:30 AM',
    },
  ])
  const [isAiThinking, setIsAiThinking] = useState(false)

  const selectedState = INDIAN_STATES_DATA[selectedStateCode] || INDIAN_STATES_DATA.DL
  const hoveredState = hoveredStateCode ? INDIAN_STATES_DATA[hoveredStateCode] : null

  const handleStateClick = (code: string) => {
    setSelectedStateCode(code)
    const st = INDIAN_STATES_DATA[code]
    if (!st) return

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    const promptMsg = `Selected ${st.name} (${st.risk})`
    const aiRespText = `📍 **${st.name} Health Intelligence Summary**:\n\n• **Risk Level**: ${st.risk} (Score: ${st.riskScore}/100)\n• **Primary Diseases**: ${st.primaryDiseases.join(', ')}\n• **Active Outbreak Clusters**: ${st.activeOutbreaks}\n\n💡 **AI Assessment**: ${st.aiSummary}\n\n🛡️ **Prevention**: ${st.preventionTips.slice(0, 2).join('; ')}.`

    setChatMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, sender: 'user', text: promptMsg, time },
      { id: `a-${Date.now()}`, sender: 'ai', text: aiRespText, time },
    ])
  }

  const handleSendChat = async (text: string) => {
    if (!text.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text, time }])
    setQueryInput('')
    setIsAiThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userQuery: text, stateContext: selectedState }),
      })

      const data = await res.json()
      const aiText = data.text || `🤖 State Summary: ${selectedState.name} (${selectedState.risk}) has ${selectedState.activeOutbreaks} active cluster(s).`
      setChatMessages((prev) => [...prev, { id: `a-${Date.now()}`, sender: 'ai', text: aiText, time }])
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'ai',
          text: `🤖 Health Advisory for **${selectedState.name}** (${selectedState.risk}):\n${selectedState.aiSummary}\n\nEmergency Helpline: 108`,
          time,
        },
      ])
    } finally {
      setIsAiThinking(false)
    }
  }

  const isStateVisible = (st: StateHealthData) => {
    if (activeTabFilter !== 'All' && st.risk !== activeTabFilter) return false
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase()
      return (
        st.name.toLowerCase().includes(q) ||
        st.code.toLowerCase().includes(q) ||
        st.primaryDiseases.some((d) => d.toLowerCase().includes(q))
      )
    }
    return true
  }

  // Create an 8-row x 7-column cartogram matrix
  const gridCells: Array<{ row: number; col: number; state?: StateHealthData }> = []
  for (let r = 1; r <= 8; r++) {
    for (let c = 1; c <= 7; c++) {
      const stateObj = Object.values(INDIAN_STATES_DATA).find(
        (s) => s.gridPos.row === r && s.gridPos.col === c
      )
      gridCells.push({ row: r, col: c, state: stateObj })
    }
  }

  return (
    <section id="disease-map" className="relative overflow-hidden py-12 lg:py-20 bg-muted/30">
      {/* Background Glow Blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-black text-primary mb-3">
              <Activity className="size-3.5 animate-pulse text-rose-500" />
              Live India Epidemiological Surveillance Map
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              🗺️ Interactive India State Disease Map
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Geographic state cartogram tracking disease transmission, vector hotspots, and live AI health intelligence. Click or hover any state tile for real-time analysis.
            </p>
          </div>

          {/* Filter Pills + Search Bar + Export Report CTA */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search state or disease..."
                className="h-10 text-xs w-48 rounded-2xl bg-card border-border px-3 font-bold"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-card p-1.5 rounded-2xl border border-border shadow-sm">
              <span className="text-[11px] font-bold text-muted-foreground px-2 flex items-center gap-1">
                <Filter className="size-3" /> Filter:
              </span>
              {(['All', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTabFilter(tab)}
                  className={cn(
                    'rounded-xl px-3 py-1.5 text-xs font-extrabold transition-all cursor-pointer',
                    activeTabFilter === tab
                      ? tab === 'High Risk'
                        ? 'bg-rose-500 text-white shadow-md'
                        : tab === 'Medium Risk'
                          ? 'bg-amber-500 text-white shadow-md'
                          : tab === 'Low Risk'
                            ? 'bg-emerald-600 text-white shadow-md'
                            : 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            <Button
              onClick={() => generateEpidemiologyReport(selectedState)}
              className="gap-2 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs h-10 px-4 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <FileSpreadsheet className="size-4" />
              <span>Export Report</span>
            </Button>
          </div>
        </div>

        {/* Main Grid: Left Map Cartogram (7 cols) + Right AI Assistant (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAP CONTAINER CARD (Perfect 7-Column Cartogram Grid) */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
            {/* Map Top Bar Legend */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Geographic State Tile Cartogram</span>
              </div>
              {/* Legend Badges */}
              <div className="flex items-center gap-3 text-xs font-extrabold">
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500 animate-pulse shadow-md shadow-rose-500/50" />
                  <span className="text-rose-600 dark:text-rose-400">High Risk</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-amber-500 shadow-md shadow-amber-500/40" />
                  <span className="text-amber-600 dark:text-amber-400">Medium</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Low Risk</span>
                </span>
              </div>
            </div>

            {/* CARTOGRAM GEOGRAPHIC TILE GRID */}
            <div className="my-4 p-3 bg-gradient-to-b from-muted/30 via-background to-muted/40 rounded-2xl border border-border/60">
              <div className="grid grid-cols-7 gap-2 sm:gap-2.5">
                {gridCells.map(({ row, col, state: st }) => {
                  if (!st) {
                    return <div key={`empty-${row}-${col}`} className="h-16 sm:h-20" />
                  }

                  const isSelected = st.code === selectedStateCode
                  const isHovered = st.code === hoveredStateCode
                  const visible = isStateVisible(st)

                  return (
                    <div
                      key={st.code}
                      onClick={() => handleStateClick(st.code)}
                      onMouseEnter={() => setHoveredStateCode(st.code)}
                      onMouseLeave={() => setHoveredStateCode(null)}
                      className={cn(
                        'relative flex flex-col justify-between p-2 rounded-2xl border transition-all duration-300 cursor-pointer select-none h-16 sm:h-20',
                        !visible && 'opacity-20 pointer-events-none',
                        st.risk === 'High Risk'
                          ? 'bg-rose-500/10 border-rose-500/40 hover:bg-rose-500/25 dark:bg-rose-500/20 shadow-md shadow-rose-500/10'
                          : st.risk === 'Medium Risk'
                            ? 'bg-amber-500/10 border-amber-500/40 hover:bg-amber-500/25 dark:bg-amber-500/20 shadow-md shadow-amber-500/10'
                            : 'bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500/20 dark:bg-emerald-500/15',
                        isSelected && 'ring-2 ring-primary border-primary shadow-xl scale-105 z-10 bg-card',
                        isHovered && !isSelected && 'scale-105 z-10 shadow-lg border-foreground/40'
                      )}
                    >
                      {/* Top Bar: Code + Risk Dot */}
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs sm:text-sm tracking-wider text-foreground">
                          {st.code}
                        </span>
                        <span
                          className={cn(
                            'size-2 rounded-full',
                            st.risk === 'High Risk'
                              ? 'bg-rose-500 animate-ping'
                              : st.risk === 'Medium Risk'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                          )}
                        />
                      </div>

                      {/* Middle: State Sublabel Name */}
                      <p className="text-[10px] sm:text-[11px] font-extrabold text-muted-foreground truncate leading-tight">
                        {st.name}
                      </p>

                      {/* Bottom: Risk Index Score */}
                      <div className="flex items-center justify-between text-[9px] font-black text-foreground">
                        <span className="text-muted-foreground">Score</span>
                        <span
                          className={cn(
                            st.risk === 'High Risk'
                              ? 'text-rose-600 dark:text-rose-400'
                              : st.risk === 'Medium Risk'
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-emerald-600 dark:text-emerald-400'
                          )}
                        >
                          {st.riskScore}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Bottom Selected State Spotlight Bar */}
            <div className="pt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/60">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-foreground">Active Focus:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-black text-xs px-3 py-1 rounded-full',
                    selectedState.risk === 'High Risk'
                      ? 'bg-rose-500/10 text-rose-600 border-rose-500/30'
                      : selectedState.risk === 'Medium Risk'
                        ? 'bg-amber-500/10 text-amber-600 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 border-emerald-500/30'
                  )}
                >
                  {selectedState.name} ({selectedState.code}) &middot; {selectedState.risk}
                </Badge>
              </div>

              <div className="hidden sm:flex items-center gap-3 font-extrabold text-foreground">
                <span>Active Clusters: <b className="text-primary">{selectedState.activeOutbreaks}</b></span>
                <span>Risk Index: <b className="text-primary">{selectedState.riskScore}/100</b></span>
              </div>
            </div>
          </div>

          {/* AI HEALTH ASSISTANT PANEL (5 cols - Rounded 3xl) */}
          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-2xl flex flex-col h-[600px] overflow-hidden">
            {/* AI Panel Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 via-cyan-500/10 to-emerald-400/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    AI Health Assistant
                    <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black animate-pulse rounded-full">
                      Live Intelligence
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">State disease predictions & insights</p>
                </div>
              </div>
            </div>

            {/* Selected State Spotlight Banner */}
            <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground uppercase tracking-wide">
                    {selectedState.name} Outbreak Status
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-black px-2 py-0.5 rounded-full uppercase',
                      selectedState.risk === 'High Risk'
                        ? 'bg-rose-500 text-white'
                        : selectedState.risk === 'Medium Risk'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                    )}
                  >
                    {selectedState.risk}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  Dominant: {selectedState.primaryDiseases.join(', ')}
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-muted-foreground block font-extrabold uppercase">Outbreak Clusters</span>
                <span className="text-sm font-black text-primary">{selectedState.activeOutbreaks} Active</span>
              </div>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-start gap-2.5 max-w-[90%]',
                    msg.sender === 'ai' ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'h-7 w-7 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm',
                      msg.sender === 'ai'
                        ? 'bg-gradient-to-tr from-primary to-cyan-500'
                        : 'bg-muted-foreground/30 text-foreground'
                    )}
                  >
                    {msg.sender === 'ai' ? <Bot className="size-3.5" /> : <User className="size-3.5 text-muted-foreground" />}
                  </div>

                  <div className="space-y-1">
                    <div
                      className={cn(
                        'rounded-2xl p-3.5 text-xs leading-relaxed whitespace-pre-line border shadow-sm',
                        msg.sender === 'ai'
                          ? 'bg-card border-border/80 text-foreground'
                          : 'bg-primary text-primary-foreground border-primary/20'
                      )}
                    >
                      <FormattedMarkdownText content={msg.text} />
                    </div>
                    <span className="text-[9px] text-muted-foreground block px-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 max-w-[80%]">
                  <div className="h-7 w-7 rounded-xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white shrink-0">
                    <Bot className="size-3.5" />
                  </div>
                  <div className="bg-card border border-border/80 rounded-2xl p-3">
                    <div className="flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="size-1.5 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompt Pill Buttons */}
            <div className="px-3 py-2 bg-muted/20 border-t border-border flex flex-wrap gap-1.5">
              <button
                onClick={() => handleSendChat('What diseases are common in Delhi?')}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                🏛️ Delhi Diseases
              </button>
              <button
                onClick={() => handleSendChat('Tell me about dengue prevention')}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                🦟 Dengue Tips
              </button>
              <button
                onClick={() => handleSendChat(`Tell me about ${selectedState.name} prevention`)}
                className="text-[10px] font-extrabold text-foreground bg-card hover:bg-muted border border-border rounded-full px-3 py-1 transition-all cursor-pointer shadow-xs"
              >
                🛡️ {selectedState.name} Tips
              </button>
            </div>

            {/* Chat Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendChat(queryInput)
              }}
              className="p-3 border-t border-border bg-card flex gap-2"
            >
              <Input
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Ask about diseases, symptoms, or prevention..."
                className="flex-1 text-xs h-10 border-border bg-muted/40 hover:bg-muted/60 focus:bg-card rounded-xl"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!queryInput.trim()}
                className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl"
              >
                <Send className="size-4" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
