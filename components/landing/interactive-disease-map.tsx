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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

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
  // SVG polygon path (scaled cartogram coordinates)
  points: string
  labelPos: { x: number; y: number }
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
    points: '260,35 300,20 345,45 320,80 275,70',
    labelPos: { x: 295, y: 50 },
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
    points: '235,50 270,40 275,70 245,95 220,75',
    labelPos: { x: 248, y: 70 },
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
    points: '250,95 295,90 280,120 235,115',
    labelPos: { x: 265, y: 108 },
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
    points: '205,120 235,115 230,145 195,145',
    labelPos: { x: 215, y: 133 },
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
    points: '280,120 325,115 315,145 270,140',
    labelPos: { x: 295, y: 133 },
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
    points: '225,148 260,145 255,185 210,180',
    labelPos: { x: 235, y: 167 },
  },
  DL: {
    id: 'DL',
    name: 'Delhi NCR',
    code: 'DL',
    risk: 'High Risk',
    primaryDiseases: ['Dengue', 'Chikungunya', 'Respiratory Distress (Air/Water Pollution)'],
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
    points: '256,182 272,180 270,198 254,196',
    labelPos: { x: 263, y: 190 },
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
    points: '275,148 375,140 395,215 300,225',
    labelPos: { x: 335, y: 185 },
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
    points: '140,165 240,155 270,225 155,240',
    labelPos: { x: 205, y: 198 },
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
    points: '235,230 340,220 355,285 245,295',
    labelPos: { x: 290, y: 258 },
  },
  BR: {
    id: 'BR',
    name: 'Bihar',
    code: 'BR',
    risk: 'Low Risk',
    primaryDiseases: ['Kala-azar (Visceral Leishmaniasis)', 'Acute Diarrheal Disease'],
    activeOutbreaks: 3,
    riskScore: 48,
    keySymptoms: ['Prolonged fever', 'Weight loss', 'Anaemia', 'Watery stool'],
    preventionTips: ['Sandfly indoor spraying', 'Halogen tablet water treatment', 'Clean sanitation'],
    aiSummary: 'Floodplain surveillance post-monsoon active. Kala-azar elimination protocols enforced.',
    points: '380,215 450,210 440,265 370,260',
    labelPos: { x: 410, y: 238 },
  },
  WB: {
    id: 'WB',
    name: 'West Bengal',
    code: 'WB',
    risk: 'High Risk',
    primaryDiseases: ['Dengue (DEN-3 Strain)', 'Cholera', 'Arsenicosis'],
    activeOutbreaks: 8,
    riskScore: 92,
    keySymptoms: ['Severe watery diarrhea (rice-water stool)', 'Platelet drop <50k', 'High fever', 'Severe dehydration'],
    preventionTips: [
      'Boil all municipal & tubewell water',
      'Use ORS & Zinc immediately for diarrhea',
      'Clean clogged urban drains daily',
      'Seek emergency hospitalization if fever >3 days',
    ],
    aiSummary: '🚨 HIGH RISK: Cholera alert in Gangetic delta & high dengue vector density in Kolkata metro.',
    points: '445,268 490,265 480,340 430,330',
    labelPos: { x: 462, y: 300 },
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
    points: '452,192 475,190 470,210 448,208',
    labelPos: { x: 461, y: 200 },
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
    points: '495,190 565,185 550,230 485,225',
    labelPos: { x: 525, y: 208 },
  },
  AS: {
    id: 'AS',
    name: 'Assam',
    code: 'AS',
    risk: 'Low Risk',
    primaryDiseases: ['Japanese Encephalitis', 'Acute Diarrheal Disease (Majuli Cluster)'],
    activeOutbreaks: 4,
    riskScore: 49,
    keySymptoms: ['High fever', 'Confusion/Delirium', 'Dehydration'],
    preventionTips: ['Boil riverine well water', 'Piggery isolation from human habitations', 'JE vaccine drives'],
    aiSummary: 'Brahmaputra valley flood-plain surveillance ongoing. Majuli river island water safety active.',
    points: '475,232 540,228 530,260 465,258',
    labelPos: { x: 502, y: 245 },
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
    points: '542,230 565,228 560,252 538,250',
    labelPos: { x: 551, y: 241 },
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
    points: '535,255 560,253 555,278 530,275',
    labelPos: { x: 545, y: 266 },
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
    points: '515,278 540,276 535,305 510,302',
    labelPos: { x: 525, y: 290 },
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
    points: '495,270 512,268 510,295 493,293',
    labelPos: { x: 502, y: 282 },
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
    points: '375,262 435,258 425,305 365,300',
    labelPos: { x: 400, y: 281 },
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
    points: '315,290 365,285 375,360 325,365',
    labelPos: { x: 345, y: 325 },
  },
  OR: {
    id: 'OR',
    name: 'Odisha',
    code: 'OR',
    risk: 'Low Risk',
    primaryDiseases: ['Malaria (Daman Program)', 'Chikungunya', 'Diarrheal Disease'],
    activeOutbreaks: 3,
    riskScore: 47,
    keySymptoms: ['Joint pain', 'High fever', 'Weakness'],
    preventionTips: ['DAMAN mass malaria screening', 'Clean water supply post-cyclone'],
    aiSummary: 'Coastal & forest districts under proactive vector suppression.',
    points: '370,302 430,298 420,368 360,362',
    labelPos: { x: 395, y: 333 },
  },
  GJ: {
    id: 'GJ',
    name: 'Gujarat',
    code: 'GJ',
    risk: 'Medium Risk',
    primaryDiseases: ['Chandipura Virus', 'Dengue', 'Hepatitis E'],
    activeOutbreaks: 5,
    riskScore: 68,
    keySymptoms: ['Acute encephalitis syndrome (AES)', 'High fever', 'Convulsions', 'Vomiting'],
    preventionTips: [
      'Sandfly control in rural kucha houses',
      'Dusting with malathion powder',
      'Boil municipal drinking water',
      'Immediate referral for pediatric fever with seizures',
    ],
    aiSummary: '⚠️ MEDIUM RISK: Sandfly-borne Chandipura virus surveillance heightened in northern rural districts.',
    points: '105,245 220,230 230,320 130,340',
    labelPos: { x: 172, y: 285 },
  },
  MH: {
    id: 'MH',
    name: 'Maharashtra',
    code: 'MH',
    risk: 'Medium Risk',
    primaryDiseases: ['Leptospirosis', 'Dengue', 'Gastroenteritis', 'Swine Flu (H1N1)'],
    activeOutbreaks: 6,
    riskScore: 74,
    keySymptoms: ['Severe calf muscle pain', 'High fever with chills', 'Conjunctival suffusion', 'Coughed sputum'],
    preventionTips: [
      'Avoid wading in floodwater post-heavy rains',
      'Take prophylactic Doxycycline if exposed to floodwater',
      'Eliminate rodent infestations in grain stores',
      'Maintain mosquito fogging in urban slums',
    ],
    aiSummary: '⚠️ MEDIUM RISK: Leptospirosis advisory in Mumbai-Konkan belt following monsoon waterlogging.',
    points: '200,325 330,310 320,410 180,415',
    labelPos: { x: 255, y: 365 },
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
    preventionTips: ['Hyderabad urban lake anti-larval spraying', 'Clean drinking water tank cleaning'],
    aiSummary: 'Greater Hyderabad & district hospitals monitoring seasonal fever OPD patient counts.',
    points: '275,368 340,362 330,425 265,420',
    labelPos: { x: 302, y: 395 },
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
    preventionTips: ['Dry day observance weekly', 'Chlorination of overhead water tanks'],
    aiSummary: 'Rayalaseema & Coastal Andhra districts maintaining low outbreak indices.',
    points: '280,428 355,422 340,490 280,485',
    labelPos: { x: 312, y: 455 },
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
    points: '195,420 220,418 215,442 190,440',
    labelPos: { x: 205, y: 431 },
  },
  KA: {
    id: 'KA',
    name: 'Karnataka',
    code: 'KA',
    risk: 'Medium Risk',
    primaryDiseases: ['Kyasanur Forest Disease (KFD)', 'Dengue', 'Chikungunya'],
    activeOutbreaks: 5,
    riskScore: 65,
    keySymptoms: ['High fever', 'Headache', 'Severe muscle pain', 'Bleeding gums/gastrointestinal'],
    preventionTips: [
      'DMP oil tick repellent when entering Western Ghats forests',
      'KFD vaccination for forest dwellers',
      'Urban Bangalore container water clearance',
    ],
    aiSummary: '⚠️ MEDIUM RISK: Kyasanur Forest Disease tick activity monitored in Shimoga/Western Ghats region.',
    points: '222,422 280,418 275,510 215,505',
    labelPos: { x: 248, y: 465 },
  },
  KL: {
    id: 'KL',
    name: 'Kerala',
    code: 'KL',
    risk: 'Low Risk',
    primaryDiseases: ['Nipah Virus Surveillance', 'Leptospirosis (Rat Fever)', 'Dengue'],
    activeOutbreaks: 2,
    riskScore: 49,
    keySymptoms: ['Fever', 'Headache', 'Respiratory distress', 'Muscle soreness'],
    preventionTips: [
      'Do not consume half-eaten fruits fallen from trees (bat exposure)',
      'Wear gloves/boots during agricultural work in wet fields',
      'Seek immediate contact tracing if fever occurs post bat area visit',
    ],
    aiSummary: 'Statewide One Health surveillance active. Nipah containment protocols & bat habitat monitoring ongoing.',
    points: '220,512 250,508 245,565 215,560',
    labelPos: { x: 232, y: 538 },
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
    preventionTips: ['Nilavembu Kudineer herbal preventive distribution', 'Overhead tank chlorination'],
    aiSummary: 'Greater Chennai Corporation & district health teams running daily mosquito larva eradication.',
    points: '252,510 305,505 295,570 248,565',
    labelPos: { x: 275, y: 538 },
  },
}

export function InteractiveDiseaseMapSection() {
  const [selectedStateCode, setSelectedStateCode] = useState<string>('DL')
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'High Risk' | 'Medium Risk' | 'Low Risk'>('All')
  const [queryInput, setQueryInput] = useState('')
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: 'user' | 'ai'; text: string; time: string }>
  >([
    {
      id: 'msg-init',
      sender: 'ai',
      text: "👋 Hi! I'm your AI Health Intelligence Assistant. I provide real-time disease predictions, health insights, and preventive measures for Indian states using live surveillance data.",
      time: '10:30 AM',
    },
  ])
  const [isAiThinking, setIsAiThinking] = useState(false)

  const selectedState = INDIAN_STATES_DATA[selectedStateCode] || INDIAN_STATES_DATA.DL

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

  const handleSendChat = (text: string) => {
    if (!text.trim()) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    setChatMessages((prev) => [...prev, { id: `u-${Date.now()}`, sender: 'user', text, time }])
    setQueryInput('')
    setIsAiThinking(true)

    setTimeout(() => {
      const q = text.toLowerCase()
      let aiText = ''

      if (q.includes('dengue')) {
        aiText = `🦟 **Dengue Outbreak Guidance**:\n\nDengue vector density (Aedes aegypti) is currently elevated in **Delhi (High Risk)** and **West Bengal (High Risk)**.\n\n• **Key Symptoms**: Sudden high fever (>103°F), severe eye pain, joint/muscle ache, and sudden rash.\n• **Red Flag**: Warning signs like persistent vomiting, abdominal pain, or mucosal bleeding require immediate emergency hospital admission.`
      } else if (q.includes('delhi')) {
        const dl = INDIAN_STATES_DATA.DL
        aiText = `🏛️ **Delhi NCR Health Report**:\nRisk Level: ${dl.risk} (Score ${dl.riskScore}/100)\nActive Outbreaks: ${dl.activeOutbreaks}\n${dl.aiSummary}`
      } else if (q.includes('west bengal') || q.includes('bengal') || q.includes('kolkata')) {
        const wb = INDIAN_STATES_DATA.WB
        aiText = `🌊 **West Bengal Health Report**:\nRisk Level: ${wb.risk} (Score ${wb.riskScore}/100)\nActive Outbreaks: ${wb.activeOutbreaks}\n${wb.aiSummary}`
      } else if (q.includes('prevention') || q.includes('prevent') || q.includes('tip')) {
        aiText = `🛡️ **Universal Outbreak Prevention Protocols**:\n1. **Water Safety**: Boil water for at least 1 minute or use certified UV/RO filtration.\n2. **Vector Control**: Drain standing water from coolers, buckets, and tires weekly.\n3. **Early Alert**: Report symptoms immediately to local ASHA workers for early blood testing.`
      } else {
        aiText = `🤖 For **${selectedState.name}** (${selectedState.risk}), our real-time AI sensors report ${selectedState.activeOutbreaks} active outbreak monitoring zone(s).\n\nKey concern pathogens: ${selectedState.primaryDiseases.join(', ')}.\n\nAsk me specific questions about dengue, water safety, or state health statistics!`
      }

      setChatMessages((prev) => [...prev, { id: `a-${Date.now()}`, sender: 'ai', text: aiText, time }])
      setIsAiThinking(false)
    }, 800)
  }

  // Filter map visualization opacity or highlights based on risk filter
  const isStateVisible = (st: StateHealthData) => {
    if (activeTabFilter === 'All') return true
    return st.risk === activeTabFilter
  }

  return (
    <section id="disease-map" className="relative overflow-hidden py-12 lg:py-20 bg-muted/30">
      {/* Background Subtle Gradient Blobs */}
      <div className="pointer-events-none absolute top-0 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-bold text-primary mb-3">
              <Activity className="size-3.5 animate-pulse" />
              Live India Disease Surveillance
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              🗺️ Interactive State Disease Map
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Real-time epidemiological heat map tracking disease transmission, vector hotspots, and waterborne outbreaks across Indian states. Click any state for live AI health intelligence.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-card/80 p-1.5 rounded-xl border border-border shadow-xs">
            <span className="text-[11px] font-bold text-muted-foreground px-2 flex items-center gap-1">
              <Filter className="size-3" /> Risk Filter:
            </span>
            {(['All', 'High Risk', 'Medium Risk', 'Low Risk'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTabFilter(tab)}
                className={cn(
                  'rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer',
                  activeTabFilter === tab
                    ? tab === 'High Risk'
                      ? 'bg-destructive text-destructive-foreground shadow-xs'
                      : tab === 'Medium Risk'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : tab === 'Low Risk'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-primary text-primary-foreground shadow-xs'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main Grid: Left Map (7 cols) + Right AI Assistant (5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* MAP CONTAINER CARD */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card/90 backdrop-blur-xl p-5 shadow-xl relative overflow-hidden flex flex-col justify-between">
            {/* Map Top Bar Legend */}
            <div className="flex items-center justify-between pb-3 border-b border-border/60">
              <div className="flex items-center gap-2 text-xs font-extrabold text-foreground">
                <MapPin className="size-4 text-primary" />
                <span>Click states for AI insights</span>
              </div>
              {/* Legend Badges */}
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="text-rose-600 dark:text-rose-400">High Risk</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">Medium</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Low Risk</span>
                </span>
              </div>
            </div>

            {/* SVG CARTOGRAM MAP CANVAS */}
            <div className="relative w-full aspect-[16/13] sm:aspect-[16/11] my-2 bg-gradient-to-b from-muted/20 via-background to-muted/30 rounded-2xl border border-border/40 p-2 flex items-center justify-center overflow-hidden">
              <svg viewBox="0 0 600 590" className="w-full h-full drop-shadow-md select-none">
                {/* Background Grid Lines matching user's reference image */}
                <g className="stroke-muted-foreground/15" strokeDasharray="3,3" strokeWidth="1">
                  {/* Latitude Lines */}
                  <line x1="40" y1="60" x2="570" y2="60" />
                  <text x="45" y="55" className="fill-muted-foreground/40 text-[10px] font-mono">35°N</text>
                  <line x1="40" y1="150" x2="570" y2="150" />
                  <text x="45" y="145" className="fill-muted-foreground/40 text-[10px] font-mono">30°N</text>
                  <line x1="40" y1="240" x2="570" y2="240" />
                  <text x="45" y="235" className="fill-muted-foreground/40 text-[10px] font-mono">25°N</text>
                  <line x1="40" y1="330" x2="570" y2="330" />
                  <text x="45" y="325" className="fill-muted-foreground/40 text-[10px] font-mono">20°N</text>
                  <line x1="40" y1="420" x2="570" y2="420" />
                  <text x="45" y="415" className="fill-muted-foreground/40 text-[10px] font-mono">15°N</text>
                  <line x1="40" y1="510" x2="570" y2="510" />
                  <text x="45" y="505" className="fill-muted-foreground/40 text-[10px] font-mono">10°N</text>

                  {/* Longitude Lines */}
                  <line x1="150" y1="35" x2="150" y2="570" />
                  <text x="140" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">70°E</text>
                  <line x1="230" y1="35" x2="230" y2="570" />
                  <text x="220" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">75°E</text>
                  <line x1="310" y1="35" x2="310" y2="570" />
                  <text x="300" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">80°E</text>
                  <line x1="390" y1="35" x2="390" y2="570" />
                  <text x="380" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">85°E</text>
                  <line x1="470" y1="35" x2="470" y2="570" />
                  <text x="460" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">90°E</text>
                  <line x1="540" y1="35" x2="540" y2="570" />
                  <text x="530" y="48" className="fill-muted-foreground/40 text-[10px] font-mono">95°E</text>
                </g>

                {/* State Polygons */}
                {Object.values(INDIAN_STATES_DATA).map((st) => {
                  const isSelected = st.code === selectedStateCode
                  const visible = isStateVisible(st)

                  // Colors based on risk level
                  let fillColor = '#10b981' // Green (Low Risk)
                  let strokeColor = '#059669'
                  if (st.risk === 'High Risk') {
                    fillColor = '#f43f5e' // Rose/Red (High Risk)
                    strokeColor = '#e11d48'
                  } else if (st.risk === 'Medium Risk') {
                    fillColor = '#f59e0b' // Amber/Orange (Medium Risk)
                    strokeColor = '#d97706'
                  }

                  return (
                    <g
                      key={st.code}
                      onClick={() => handleStateClick(st.code)}
                      className={cn(
                        'cursor-pointer transition-all duration-300 group',
                        !visible && 'opacity-20 pointer-events-none'
                      )}
                    >
                      {/* State Polygon */}
                      <polygon
                        points={st.points}
                        fill={fillColor}
                        stroke={isSelected ? '#ffffff' : strokeColor}
                        strokeWidth={isSelected ? '3' : '1.5'}
                        opacity={isSelected ? 0.95 : 0.82}
                        className={cn(
                          'transition-all duration-300 hover:opacity-100 hover:stroke-white hover:stroke-[2.5px]',
                          st.risk === 'High Risk' && 'animate-pulse-glow'
                        )}
                      />

                      {/* Selected Outline Ring */}
                      {isSelected && (
                        <polygon
                          points={st.points}
                          fill="none"
                          stroke="#0284c7"
                          strokeWidth="4"
                          strokeDasharray="4,2"
                          className="animate-spin-slow"
                        />
                      )}

                      {/* Label Text */}
                      <text
                        x={st.labelPos.x}
                        y={st.labelPos.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        className={cn(
                          'fill-white font-extrabold text-[11px] sm:text-[12px] tracking-wider pointer-events-none drop-shadow-sm',
                          isSelected && 'scale-110 font-black'
                        )}
                      >
                        {st.code}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Bottom Selected State Quick Pill Bar */}
            <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground border-t border-border/50">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">Active Focus:</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'font-extrabold text-xs px-2.5 py-0.5',
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

              <div className="hidden sm:flex items-center gap-3 font-semibold">
                <span>Active Outbreaks: <b className="text-foreground">{selectedState.activeOutbreaks}</b></span>
                <span>Risk Index: <b className="text-foreground">{selectedState.riskScore}/100</b></span>
              </div>
            </div>
          </div>

          {/* AI HEALTH ASSISTANT PANEL (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl border border-border/80 bg-card/95 backdrop-blur-xl shadow-xl flex flex-col h-[580px] overflow-hidden">
            {/* AI Panel Header */}
            <div className="p-4 border-b border-border bg-gradient-to-r from-primary/10 via-cyan-500/10 to-emerald-400/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="size-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-foreground flex items-center gap-2">
                    AI Health Assistant
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold animate-pulse">
                      Live Intelligence
                    </Badge>
                  </h3>
                  <p className="text-xs text-muted-foreground">State disease predictions & insights</p>
                </div>
              </div>
            </div>

            {/* Selected State Spotlight Banner */}
            <div className="px-4 py-3 border-b border-border bg-muted/40 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-foreground uppercase tracking-wide">
                    {selectedState.name} Outbreak Status
                  </span>
                  <span
                    className={cn(
                      'text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase',
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
                <span className="text-[10px] text-muted-foreground block font-bold uppercase">Outbreak Clusters</span>
                <span className="text-sm font-black text-primary">{selectedState.activeOutbreaks} Active</span>
              </div>
            </div>

            {/* Chat Conversation Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex items-start gap-2.5 max-w-[88%]',
                    msg.sender === 'ai' ? 'mr-auto' : 'ml-auto flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-xs',
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
                        'rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line border shadow-xs',
                        msg.sender === 'ai'
                          ? 'bg-card border-border/80 text-foreground'
                          : 'bg-primary text-primary-foreground border-primary/20'
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-muted-foreground block px-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}

              {isAiThinking && (
                <div className="flex items-center gap-2 max-w-[80%]">
                  <div className="h-7 w-7 rounded-lg bg-gradient-to-tr from-primary to-cyan-500 flex items-center justify-center text-white shrink-0">
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
                className="text-[10px] font-bold text-foreground bg-card hover:bg-muted border border-border rounded-full px-2.5 py-1 transition-all cursor-pointer"
              >
                🏛️ Delhi Diseases
              </button>
              <button
                onClick={() => handleSendChat('Tell me about dengue prevention')}
                className="text-[10px] font-bold text-foreground bg-card hover:bg-muted border border-border rounded-full px-2.5 py-1 transition-all cursor-pointer"
              >
                🦟 Dengue Tips
              </button>
              <button
                onClick={() => handleSendChat(`Tell me about ${selectedState.name} prevention`)}
                className="text-[10px] font-bold text-foreground bg-card hover:bg-muted border border-border rounded-full px-2.5 py-1 transition-all cursor-pointer"
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
                className="flex-1 text-xs h-10 border-border bg-muted/40 hover:bg-muted/60 focus:bg-card"
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
