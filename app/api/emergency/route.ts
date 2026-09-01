import { NextResponse } from 'next/server'
import { getSecurityHeaders, recordAuditEvent, checkRateLimit, sanitizeObject } from '@/lib/security'
import { collection, getDocs, setDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface EmergencyCallLog {
  id: string
  helpline: string
  callerName: string
  location: string
  timestamp: string
}

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  
  try {
    const logsCol = collection(db, 'emergency_logs')
    const q = query(logsCol, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    let logs = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as EmergencyCallLog[]

    // Auto-seed database if it is empty
    if (logs.length === 0) {
      console.log('Emergency logs collection is empty in Firestore. Seeding mock logs...')
      const now = Date.now()
      const seedPromises = [
        {
          id: 'e-1',
          helpline: '108',
          callerName: 'Kamalabari PHC',
          location: 'Sector 2, Majuli',
          timestamp: '10 mins ago',
        },
      ].map((log, index) => {
        const docRef = doc(db, 'emergency_logs', log.id)
        return setDoc(docRef, {
          helpline: log.helpline,
          callerName: log.callerName,
          location: log.location,
          timestamp: log.timestamp,
          createdAt: new Date(now - index * 600000).toISOString(), // Spaced by 10 mins
        })
      })
      await Promise.all(seedPromises)

      // Retrieve again after seeding
      const freshSnapshot = await getDocs(q)
      logs = freshSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as EmergencyCallLog[]
    }

    return NextResponse.json({ logs }, { status: 200, headers: securityHeaders })
  } catch (err: any) {
    console.error('Error fetching emergency logs from Firestore:', err)
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
  const rateLimit = checkRateLimit(`emergency_${clientIp}`, 20, 60000)
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Try again shortly.' },
      { status: 429, headers: securityHeaders },
    )
  }

  try {
    const rawBody = await request.json()

    // OWASP A03: Input Sanitization
    const sanitized = sanitizeObject(rawBody)

    const logId = `e-${Date.now()}`
    const newLogData = {
      helpline: sanitized.helpline || '108',
      callerName: sanitized.callerName || 'Resident',
      location: sanitized.location || 'Majuli District',
      timestamp: 'Just now',
      createdAt: new Date().toISOString(),
    }

    // Save directly to Firestore using custom ID
    await setDoc(doc(db, 'emergency_logs', logId), newLogData)

    const newLog: EmergencyCallLog = {
      id: logId,
      ...newLogData,
    }

    // Record emergency dial event in audit ledger
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
  } catch (err: any) {
    console.error('Error submitting emergency log to Firestore:', err)
    return NextResponse.json(
      { error: 'Invalid payload or database write error' },
      { status: 400, headers: securityHeaders },
    )
  }
}
