import { NextResponse } from 'next/server'
import { getAuditLogs, getSecurityHeaders, hasPermission, recordAuditEvent } from '@/lib/security'

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || 'guest'

  // OWASP A01: RBAC Security Guard
  if (!hasPermission(role, 'admin:audit')) {
    recordAuditEvent({
      actor: 'Unknown Client',
      role,
      action: 'UNAUTHORIZED_AUDIT_LOG_READ',
      status: 'DENIED',
      severity: 'critical',
      ip: request.headers.get('x-forwarded-for') || '127.0.0.1',
      details: `Attempted unauthorized inspection of security audit logs by role '${role}'`,
    })

    return NextResponse.json(
      { error: 'Forbidden: Security Audit Logs require Administrative Access' },
      { status: 403, headers: securityHeaders },
    )
  }

  const logs = getAuditLogs()
  return NextResponse.json({ auditLogs: logs, total: logs.length }, { status: 200, headers: securityHeaders })
}
