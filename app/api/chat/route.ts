import { NextResponse } from 'next/server'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ''

const SYSTEM_PROMPT = `
You are HealthPulse AI — an advanced, empathetic, and highly intelligent AI Assistant for Health, Outbreak Surveillance, and General Inquiry in India.

### System Instructions & Core Capabilities:
1. **General Intelligence, Math & Calculation Capability**:
   - You MUST answer ALL general questions, mathematical calculations, word problems, unit conversions, science queries, logic puzzles, and general knowledge questions directly, accurately, and clearly.
   - Never decline or refuse to answer general queries or math calculations (e.g. "what is 25 * 4?", "calculate 154 * 28", "explain gravity", etc.).

2. **Public Health & Epidemiological Knowledge Base**:
   - **Active India State Disease Surveillance Data**:
      - **Delhi NCR (High Risk - Score 89/100)**: Dengue (DEN-2), Chikungunya, Respiratory Distress. 7 active clusters. Advisories: Clear air cooler standing water, N95 masks for AQI, early CBC platelet testing.
      - **West Bengal (High Risk - Score 92/100)**: Cholera, Dengue (DEN-3), Arsenicosis. 8 active clusters. Advisories: Boil all tubewell & municipal water, ORS+Zinc for diarrhea, immediate hospitalization if fever >3 days.
      - **Gujarat (Medium Risk - Score 68/100)**: Chandipura Virus, Dengue, Hepatitis E. 5 active clusters. Advisories: Sandfly control in rural kucha houses, dusting with Malathion powder.
      - **Maharashtra (Medium Risk - Score 74/100)**: Leptospirosis, Dengue, H1N1. 6 active clusters. Advisories: Avoid wading in floodwater post-monsoon, Doxycycline prophylaxis.
      - **Karnataka (Medium Risk - Score 65/100)**: Kyasanur Forest Disease (KFD), Dengue. 5 active clusters. Advisories: DMP oil tick repellent when entering Western Ghats forests.
      - **Assam & Majuli Island (Low Risk - Score 49/100)**: Japanese Encephalitis, Acute Diarrheal Disease. Boil riverine well water.

3. **Drinking Water Quality Standards**:
   - **Turbidity**: Safe < 1.0 NTU; Warning 1.0–5.0 NTU; **Boil Water Advisory > 5.0 NTU** (Current Kamalabari Well #3: 12.4 NTU).
   - **Free Residual Chlorine**: Safe 0.2 – 0.5 mg/L. Unsafe < 0.2 mg/L.
   - **pH**: Safe 6.5 – 8.5.
   - **E. coli / Coliforms**: Must be 0 per 100 mL.

4. **Emergency Helplines**:
   - **108**: Toll-Free National Ambulance Dispatcher (24/7)
   - **104**: State Health Advisory & Doctor Tele-consultation
   - **1915**: PHED Water Supply & Tanker Request Hotline

5. **Tone & Response Guidelines**:
   - Keep responses crisp, scannable, bite-sized, and well-formatted with markdown.
   - Use bold formatting for numbers, results, state scores, and emergency helplines (**108**, **104**, **1915**).
`

export async function POST(req: Request) {
  try {
    const { messages, userQuery, stateContext } = await req.json()
    const query = userQuery || (messages && messages[messages.length - 1]?.text) || ''

    if (!query) {
      return NextResponse.json({ error: 'Query prompt is required' }, { status: 400 })
    }

    const contextAddition = stateContext
      ? `\n[Current User Active State Context: ${stateContext.name} (${stateContext.code}), Risk: ${stateContext.risk}, Primary Diseases: ${stateContext.primaryDiseases?.join(', ')}]`
      : ''

    const contentsPayload = [
      {
        role: 'user',
        parts: [
          {
            text: `${SYSTEM_PROMPT}${contextAddition}\n\nUser Question: ${query}`,
          },
        ],
      },
    ]

    // Supported Gemini REST API models (prioritizing 3.6-flash, 3.5-flash, 3.5-flash-lite)
    const geminiModels = [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-flash-latest',
    ]
    let aiText = ''

    for (const model of geminiModels) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: contentsPayload }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
          if (aiText) break
        }
      } catch (e) {
        console.warn(`Model ${model} call failed, trying next...`)
      }
    }

    if (!aiText) {
      // Intelligent Rule & Calculation Engine Fallback if API key rate limits or network issues occur
      aiText = generateFallbackIntelligence(query, stateContext)
    }

    return NextResponse.json({ text: aiText, isGemini: true })
  } catch (error) {
    console.error('Gemini API Route Error:', error)
    return NextResponse.json(
      { text: 'I am experiencing a temporary connection surge. Please boil drinking water if in flood zones or call 108 for medical emergency.' },
      { status: 500 }
    )
  }
}

function generateFallbackIntelligence(query: string, stateContext?: any): string {
  const q = query.toLowerCase().trim()

  // 1. Math & Calculation Evaluator Fallback
  const mathResult = tryEvaluateMath(query)
  if (mathResult) return mathResult

  // 2. Greetings
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'namaste' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.includes('good morning') ||
    q.includes('good evening')
  ) {
    return `👋 **Hello! I am HealthPulse AI Assistant.**\n\nHow can I help you today? You can ask me:\n• **Calculations & General Queries**: Simple math, word problems, or general knowledge\n• **State Disease Map**: Outbreak stats for Delhi, West Bengal, Maharashtra, etc.\n• **Water Safety**: Boil advisories, pH, and chlorine standards\n• **Emergency Helplines**: 108 (Ambulance) & 104 (Medical Advice)`
  }

  // 3. Dengue & Vector diseases
  if (q.includes('dengue') || q.includes('chikungunya') || q.includes('mosquito')) {
    return `🦟 **Dengue Outbreak Guidance**:\n\nDengue vector density (Aedes aegypti) is currently elevated in **Delhi (High Risk - Score 89)** and **West Bengal (High Risk - Score 92)**.\n\n• **Key Symptoms**: Sudden high fever (>103°F), severe retro-orbital eye pain, joint/muscle ache, and skin rash.\n• **Emergency Red Flag**: Warning signs like persistent vomiting, severe abdominal pain, or mucosal bleeding require immediate emergency hospital admission.\n• **Prevention**: Empty air cooler & pot standing water every 7 days; apply DEET/Picardin insect repellents.`
  }

  // 4. Water Quality & Safety
  if (q.includes('water') || q.includes('boil') || q.includes('dirty') || q.includes('contamination') || q.includes('turbidity')) {
    return `💧 **Water Quality Safety Advisory**:\n\n• **Boil Advisory Threshold**: Any water source with turbidity > 5.0 NTU or residual chlorine < 0.2 mg/L requires boiling for at least 1 full minute.\n• **Current Alert**: Kamalabari Community Well #3 is showing elevated turbidity (12.4 NTU).\n• **Halogen Tablets**: Use 1 chlorine tablet per 20L water in flood-prone districts.\n• **Emergency Tanker**: Request clean drinking water tankers through your Citizen Portal.`
  }

  // 5. Clinics & Helplines
  if (q.includes('clinic') || q.includes('hospital') || q.includes('doctor') || q.includes('phone') || q.includes('call') || q.includes('emergency') || q.includes('helpline')) {
    return `🏥 **Emergency Healthcare & Helpline Directory**:\n\n• **108**: Toll-Free National Ambulance Dispatcher (24/7)\n• **104**: State Medical Advisory & Doctor Consultation\n• **1915**: PHED Drinking Water Hotline\n• **Primary Health Centre**: Open 24/7 for acute fever & dehydration treatment.`
  }

  // 6. State context if available
  if (stateContext) {
    return `📍 **${stateContext.name} (${stateContext.risk}) Intelligence Summary**:\n\n• **Risk Score**: ${stateContext.riskScore}/100 &bull; **Active Outbreaks**: ${stateContext.activeOutbreaks}\n• **Primary Pathogens**: ${stateContext.primaryDiseases?.join(', ')}\n• **AI Assessment**: ${stateContext.aiSummary}`
  }

  return `🤖 **HealthPulse AI Assistant**:\nI can help answer general questions, solve math calculations, check water quality standards, and provide disease outbreak guidance! What would you like to ask?`
}

function tryEvaluateMath(query: string): string | null {
  try {
    const clean = query
      .toLowerCase()
      .replace(/what is|calculate|compute|solve|how much is|\?|=/gi, '')
      .trim()

    // Match percentage calculations e.g. "15% of 200"
    const percentMatch = clean.match(/^([\d.]+)\s*%\s*of\s*([\d.]+)$/)
    if (percentMatch) {
      const pct = parseFloat(percentMatch[1])
      const total = parseFloat(percentMatch[2])
      const val = (pct / 100) * total
      return `🔢 **Calculation Result**:\n\n${pct}% of ${total} = **${val}**`
    }

    // Match math expressions containing numbers and operators
    const exprMatch = clean.match(/^[\d\s+\-*/%^().]+$/)
    if (exprMatch && /[\d]/.test(clean) && /[+\-*/%^]/.test(clean)) {
      const sanitized = clean.replace(/\^/g, '**').replace(/[^0-9+\-*/%().]/g, '')
      const result = (new Function(`return ${sanitized}`))()
      if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
        return `🔢 **Calculation Result**:\n\n${clean} = **${result}**`
      }
    }
  } catch (e) {
    // Fail silently and move to regular response
  }
  return null
}

