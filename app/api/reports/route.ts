import { NextResponse } from 'next/server'
import { DISEASE_REPORTS, type DiseaseReport } from '@/lib/data'
import {
  checkRateLimit,
  getSecurityHeaders,
  hasPermission,
  recordAuditEvent,
  sanitizeObject,
} from '@/lib/security'
import { collection, getDocs, setDoc, doc, query, orderBy, limit, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

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

  try {
    const reportsCol = collection(db, 'reports')
    // Order by createdAt descending to show latest reports first
    const q = query(reportsCol, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    let reports = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as DiseaseReport[]

    // Auto-seed database if it is empty
    if (reports.length === 0) {
      console.log('Reports collection is empty in Firestore. Seeding mock reports...')
      // Seed in sequential order with spaced timestamps
      const now = Date.now()
      const seedPromises = DISEASE_REPORTS.map((report, index) => {
        const docRef = doc(db, 'reports', report.id)
        return setDoc(docRef, {
          patient: report.patient,
          village: report.village,
          disease: report.disease,
          symptoms: report.symptoms,
          status: report.status,
          source: report.source,
          reportedAt: report.reportedAt,
          severity: report.severity,
          createdAt: new Date(now - index * 3600000).toISOString(), // Spaced by 1 hour
        })
      })
      await Promise.all(seedPromises)

      // Retrieve again after seeding to return in correct order
      const freshSnapshot = await getDocs(q)
      reports = freshSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as DiseaseReport[]
    }

    return NextResponse.json({ reports }, { status: 200, headers: securityHeaders })
  } catch (err: any) {
    console.error('Error fetching reports from Firestore:', err)
    return NextResponse.json(
      { error: 'Database error: ' + (err.message || err) },
      { status: 500, headers: securityHeaders },
    )
  }
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

    const reportId = `r-${Date.now()}`
    const newReportData = {
      patient: sanitizedBody.patient || 'Anonymous Household',
      village: sanitizedBody.village || 'Majuli',
      disease: sanitizedBody.disease || 'Suspected',
      symptoms: Array.isArray(sanitizedBody.symptoms) ? sanitizedBody.symptoms : ['Unspecified'],
      status: sanitizedBody.status || 'pending',
      source: sanitizedBody.source || 'Citizen',
      reportedAt: 'Just now',
      severity: sanitizedBody.severity || 'medium',
      createdAt: new Date().toISOString(),
    }

    // Save directly to Firestore using custom ID
    await setDoc(doc(db, 'reports', reportId), newReportData)

    const newReport: DiseaseReport = {
      id: reportId,
      ...newReportData,
    }

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
    console.error('Error submitting report to Firestore:', err)
    return NextResponse.json(
      { error: 'Invalid payload or database write error' },
      { status: 400, headers: securityHeaders },
    )
  }
}

export async function PATCH(request: Request) {
  const securityHeaders = getSecurityHeaders()
  
  try {
    const rawBody = await request.json()
    const sanitized = sanitizeObject(rawBody)
    const { id, status, disease, severity } = sanitized

    if (!id) {
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400, headers: securityHeaders })
    }

    const reportRef = doc(db, 'reports', id)
    const updateData: Record<string, any> = {}
    
    if (status) updateData.status = status
    if (disease) updateData.disease = disease
    if (severity) updateData.severity = severity

    await setDoc(reportRef, updateData, { merge: true })

    return NextResponse.json(
      { success: true, message: 'Report updated successfully' },
      { status: 200, headers: securityHeaders }
    )
  } catch (err: any) {
    console.error('Error updating report in Firestore:', err)
    return NextResponse.json(
      { error: 'Database update failed: ' + (err.message || err) },
      { status: 500, headers: securityHeaders }
    )
  }
}

export async function DELETE(request: Request) {
  const securityHeaders = getSecurityHeaders()
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  const role = searchParams.get('role') || 'citizen'

  if (!hasPermission(role, 'case:confirm') && !hasPermission(role, 'admin:users')) {
    return NextResponse.json({ error: 'Forbidden: Role cannot delete reports' }, { status: 403, headers: securityHeaders })
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing report ID' }, { status: 400, headers: securityHeaders })
  }

  try {
    const { deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, 'reports', id))
    return NextResponse.json({ success: true, message: 'Report deleted successfully' }, { status: 200, headers: securityHeaders })
  } catch (err: any) {
    console.error('Error deleting report from Firestore:', err)
    return NextResponse.json({ error: 'Failed to delete report: ' + (err.message || err) }, { status: 500, headers: securityHeaders })
  }
}


