import { NextResponse } from 'next/server'
import { getAuditLogs, getSecurityHeaders, hasPermission, recordAuditEvent } from '@/lib/security'
import { collection, getDocs, setDoc, doc, query, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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

  try {
    const logsCol = collection(db, 'audit_logs')
    // Order by timestamp descending to show latest logs first, max 100
    const q = query(logsCol, orderBy('timestamp', 'desc'), limit(100))
    const snapshot = await getDocs(q)
    let logs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }))

    // Auto-seed database if it is empty
    if (logs.length === 0) {
      console.log('Audit logs collection is empty in Firestore. Seeding initial audit events...')
      const initialLogs = getAuditLogs()
      const seedPromises = initialLogs.map((log) => {
        const docRef = doc(db, 'audit_logs', log.id)
        return setDoc(docRef, {
          actor: log.actor,
          role: log.role,
          action: log.action,
          status: log.status,
          severity: log.severity,
          ip: log.ip || '127.0.0.1',
          details: log.details || '',
          timestamp: log.timestamp,
        })
      })
      await Promise.all(seedPromises)

      // Retrieve again after seeding
      const freshSnapshot = await getDocs(q)
      logs = freshSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() }))
    }

    return NextResponse.json({ auditLogs: logs, total: logs.length }, { status: 200, headers: securityHeaders })
  } catch (err: any) {
    console.error('Error fetching audit logs from Firestore:', err)
    return NextResponse.json(
      { error: 'Database error: ' + (err.message || err) },
      { status: 500, headers: securityHeaders },
    )
  }
}
