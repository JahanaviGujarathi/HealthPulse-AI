import { NextResponse } from 'next/server'
import { WATER_SOURCES, type WaterSource } from '@/lib/data'
import {
  checkRateLimit,
  getSecurityHeaders,
  hasPermission,
  recordAuditEvent,
  sanitizeObject,
} from '@/lib/security'

let waterSourcesStore: WaterSource[] = [...WATER_SOURCES]

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  return NextResponse.json(
    { waterSources: waterSourcesStore },
    { status: 200, headers: securityHeaders },
  )
}

export async function POST(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'

  const rateLimit = checkRateLimit(`water_post_${clientIp}`, 10, 60000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again in a minute.' },
      { status: 429, headers: securityHeaders },
    )
  }

  try {
    const rawBody = await request.json()
    const role = rawBody.role || 'water-officer'

    if (!hasPermission(role, 'water:create')) {
      recordAuditEvent({
        actor: rawBody.testerName || 'Unknown User',
        role,
        action: 'UNAUTHORIZED_WATER_TEST_CREATE',
        status: 'DENIED',
        severity: 'warning',
        ip: clientIp,
        details: `Role '${role}' denied water test upload privilege`,
      })

      return NextResponse.json(
        { error: 'Forbidden: Role does not have permission to submit water tests' },
        { status: 403, headers: securityHeaders },
      )
    }

    const sanitized = sanitizeObject(rawBody)

    const newSource: WaterSource = {
      id: `w-${Date.now()}`,
      name: sanitized.name || 'Community Water Intake',
      village: sanitized.village || 'Majuli Block',
      lat: Number(sanitized.lat) || 26.95,
      lng: Number(sanitized.lng) || 94.17,
      ph: Number(sanitized.ph) || 7.0,
      turbidity: Number(sanitized.turbidity) || 2.0,
      chlorine: Number(sanitized.chlorine) || 0.5,
      bacteria: Number(sanitized.bacteria) || 50,
      risk: Number(sanitized.bacteria) > 300 || Number(sanitized.ph) < 6.0 ? 'high' : 'low',
      testedAt: 'Just now',
    }

    waterSourcesStore.unshift(newSource)

    recordAuditEvent({
      actor: sanitized.testerName || 'Water Officer',
      role,
      action: 'SUBMIT_WATER_TEST',
      status: 'SUCCESS',
      severity: newSource.risk === 'high' ? 'critical' : 'info',
      ip: clientIp,
      details: `Water sample logged for ${newSource.name}. Bacterial count: ${newSource.bacteria} CFU`,
    })

    return NextResponse.json(
      { success: true, waterSource: newSource },
      { status: 201, headers: securityHeaders },
    )
  } catch (err) {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400, headers: securityHeaders })
  }
}
