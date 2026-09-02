import { NextResponse } from 'next/server'
import { WATER_SOURCES, type WaterSource } from '@/lib/data'
import {
  checkRateLimit,
  getSecurityHeaders,
  hasPermission,
  recordAuditEvent,
  sanitizeObject,
} from '@/lib/security'
import { collection, getDocs, setDoc, doc, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request) {
  const securityHeaders = getSecurityHeaders()
  
  try {
    const waterCol = collection(db, 'water_tests')
    // Order by createdAt descending to show latest water tests first
    const q = query(waterCol, orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)
    let waterSources = snapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as WaterSource[]

    // Auto-seed database if it is empty
    if (waterSources.length === 0) {
      console.log('Water tests collection is empty in Firestore. Seeding mock water sources...')
      const now = Date.now()
      const seedPromises = WATER_SOURCES.map((source, index) => {
        const docRef = doc(db, 'water_tests', source.id)
        return setDoc(docRef, {
          name: source.name,
          village: source.village,
          lat: source.lat,
          lng: source.lng,
          ph: source.ph,
          turbidity: source.turbidity,
          chlorine: source.chlorine,
          bacteria: source.bacteria,
          risk: source.risk,
          testedAt: source.testedAt,
          createdAt: new Date(now - index * 3600000).toISOString(), // Spaced by 1 hour
        })
      })
      await Promise.all(seedPromises)

      // Retrieve again after seeding to return in correct order
      const freshSnapshot = await getDocs(q)
      waterSources = freshSnapshot.docs.map((d: any) => ({ id: d.id, ...d.data() })) as WaterSource[]
    }

    return NextResponse.json(
      { waterSources },
      { status: 200, headers: securityHeaders },
    )
  } catch (err: any) {
    console.error('Error fetching water tests from Firestore:', err)
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

    // OWASP A01: Broken Access Control Guard
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

    // OWASP A03: Input Sanitization
    const sanitized = sanitizeObject(rawBody)

    const sourceId = `w-${Date.now()}`
    const bacteria = Number(sanitized.bacteria) || 50
    const ph = Number(sanitized.ph) || 7.0
    // Set risk evaluation logically
    const risk: 'high' | 'medium' | 'low' = bacteria > 300 || ph < 6.0 || ph > 8.5 ? 'high' : 'low'

    const newSourceData = {
      name: sanitized.name || 'Community Water Intake',
      village: sanitized.village || 'Majuli Block',
      lat: Number(sanitized.lat) || 26.95,
      lng: Number(sanitized.lng) || 94.17,
      ph: ph,
      turbidity: Number(sanitized.turbidity) || 2.0,
      chlorine: Number(sanitized.chlorine) || 0.5,
      bacteria: bacteria,
      risk: risk,
      testedAt: 'Just now',
      createdAt: new Date().toISOString(),
    }

    // Save directly to Firestore using custom ID
    await setDoc(doc(db, 'water_tests', sourceId), newSourceData)

    const newSource: WaterSource = {
      id: sourceId,
      ...newSourceData,
    }

    // OWASP A09: Audit Logging
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
  } catch (err: any) {
    console.error('Error submitting water test to Firestore:', err)
    return NextResponse.json(
      { error: 'Malformed payload or database write error' },
      { status: 400, headers: securityHeaders },
    )
  }
}

export async function PATCH(request: Request) {
  const securityHeaders = getSecurityHeaders()
  
  try {
    const rawBody = await request.json()
    const sanitized = sanitizeObject(rawBody)
    const { id, ph, turbidity, chlorine, bacteria, risk } = sanitized

    if (!id) {
      return NextResponse.json({ error: 'Missing water source ID' }, { status: 400, headers: securityHeaders })
    }

    const waterRef = doc(db, 'water_tests', id)
    const updateData: Record<string, any> = {}
    
    if (ph !== undefined) updateData.ph = Number(ph)
    if (turbidity !== undefined) updateData.turbidity = Number(turbidity)
    if (chlorine !== undefined) updateData.chlorine = Number(chlorine)
    if (bacteria !== undefined) updateData.bacteria = Number(bacteria)
    if (risk) updateData.risk = risk

    await setDoc(waterRef, updateData, { merge: true })

    return NextResponse.json(
      { success: true, message: 'Water test updated successfully' },
      { status: 200, headers: securityHeaders }
    )
  } catch (err: any) {
    console.error('Error updating water test in Firestore:', err)
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
  const role = searchParams.get('role') || 'water-officer'

  if (!hasPermission(role, 'water:create') && !hasPermission(role, 'admin:users')) {
    return NextResponse.json({ error: 'Forbidden: Insufficient permissions to delete water records' }, { status: 403, headers: securityHeaders })
  }

  if (!id) {
    return NextResponse.json({ error: 'Missing water source ID' }, { status: 400, headers: securityHeaders })
  }

  try {
    const { deleteDoc } = await import('firebase/firestore')
    await deleteDoc(doc(db, 'water_tests', id))
    return NextResponse.json({ success: true, message: 'Water test record deleted successfully' }, { status: 200, headers: securityHeaders })
  } catch (err: any) {
    console.error('Error deleting water test from Firestore:', err)
    return NextResponse.json({ error: 'Failed to delete record: ' + (err.message || err) }, { status: 500, headers: securityHeaders })
  }
}

