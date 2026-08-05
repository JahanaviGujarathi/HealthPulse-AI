import { NextResponse } from 'next/server'
import { DISEASE_REPORTS, type DiseaseReport } from '@/lib/data'
import {
  checkRateLimit,
  getSecurityHeaders,
  hasPermission,
  recordAuditEvent,
  sanitizeObject,
} from '@/lib/security'

// In-memory reports dataset store
let reportsStore: DiseaseReport[] = [...DISEASE_REPORTS]

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || 'citizen'

  // OWASP A01: Broken Access Control Guard
  if (!hasPermission(role, 'report:read')) {
    recordAuditEvent({
      actor: 'Unknown API Client',
      role,
      action: 'UNAUTHORIZED_REPORT_READ',
      status: 'DENIED',
      severity: 'warning',
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      details: `Role '${role}' attempted unauthorized access to disease reports`,
    })

    return NextResponse.json(
      { error: 'Forbidden: Insufficient permissions' },
      { status: 403, headers: securityHeaders },
    )
  }

  return NextResponse.json({ reports: reportsStore }, { status: 200, headers: securityHeaders })
}

export async function POST(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const clientIp = request.headers.get('x-forwarded-for') || '127.0.0.1'

  // OWASP A04: Rate Limiting Guard
  const rateLimit = checkRateLimit(`report_post_${clientIp}`, 15, 60000)
  if (!rateLimit.allowed) {
    recordAuditEvent({
      actor: 'API User',
      role: 'client',
      action: 'RATE_LIMIT_EXCEEDED',
      status: 'FLAGGED',
      severity: 'warning',
      ip: clientIp,
      details: 'Exceeded rate limit for disease report submission',
    })

    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.' },
      {
        status: 429,
        headers: {
          ...securityHeaders,
          'Retry-After': Math.ceil(rateLimit.resetInMs / 1000).toString(),
        },
      },
    )
  }

  try {
    const rawBody = await request.json()

    // OWASP A03: Input Sanitization
    const sanitizedBody = sanitizeObject(rawBody)

    const newReport: DiseaseReport = {
      id: `r-${Date.now()}`,
      patient: sanitizedBody.patient || 'Anonymous Household',
      village: sanitizedBody.village || 'Majuli',
      disease: sanitizedBody.disease || 'Suspected',
      symptoms: Array.isArray(sanitizedBody.symptoms) ? sanitizedBody.symptoms : ['Unspecified'],
      status: sanitizedBody.status || 'pending',
      source: sanitizedBody.source || 'Citizen',
      reportedAt: 'Just now',
      severity: sanitizedBody.severity || 'medium',
    }

    reportsStore.unshift(newReport)

    // OWASP A09: Audit Logging
    recordAuditEvent({
      actor: sanitizedBody.patient || 'Citizen User',
      role: sanitizedBody.source?.toLowerCase() || 'citizen',
      action: 'SUBMIT_DISEASE_REPORT',
      status: 'SUCCESS',
      severity: 'info',
      ip: clientIp,
      details: `New report submitted for ${newReport.disease} in ${newReport.village}`,
    })

    return NextResponse.json(
      { success: true, report: newReport, message: 'Report submitted and sanitized successfully' },
      { status: 201, headers: securityHeaders },
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Invalid payload or JSON parsing error' },
      { status: 400, headers: securityHeaders },
    )
  }
}
