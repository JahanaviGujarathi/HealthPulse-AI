import { NextResponse } from 'next/server'
import { getSecurityHeaders, recordAuditEvent, checkRateLimit, sanitizeObject } from '@/lib/security'

interface EmergencyCallLog {
  id: string
  helpline: string
  callerName: string
  location: string
  timestamp: string
}

let emergencyLogsStore: EmergencyCallLog[] = [
  {
    id: 'e-1',
    helpline: '108',
    callerName: 'Kamalabari PHC',
    location: 'Sector 2, Majuli',
    timestamp: '10 mins ago',
  },
]

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  return NextResponse.json({ logs: emergencyLogsStore }, { status: 200, headers: securityHeaders })
}

export async function POST(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'

  const rateLimit = checkRateLimit(`emergency_${clientIp}`, 20, 60000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: securityHeaders }
    )
  }

  try {
    const rawBody = await request.json()
    const sanitized = sanitizeObject(rawBody)

    const newLog: EmergencyCallLog = {
      id: `e-${Date.now()}`,
      helpline: sanitized.helpline || '108',
      callerName: sanitized.callerName || 'Resident',
      location: sanitized.location || 'Majuli District',
      timestamp: 'Just now',
    }

    emergencyLogsStore.unshift(newLog)

    recordAuditEvent({
      actor: newLog.callerName,
      role: 'citizen',
      action: 'EMERGENCY_HELPLINE_DIAL',
      status: 'SUCCESS',
      severity: 'critical',
      ip: clientIp,
      details: `Dialed ${newLog.helpline} Emergency Helpline for location ${newLog.location}`,
    })

    return NextResponse.json({ success: true, log: newLog }, { status: 201, headers: securityHeaders })
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400, headers: securityHeaders })
  }
}
