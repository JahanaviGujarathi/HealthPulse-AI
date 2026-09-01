import { onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'
import { RoleId, ROLES } from './roles'

export interface UserSession {
  role: RoleId
  email: string
  name: string
  scope: string
  token: string
  aadhaar?: string
  authenticatedAt: string
}

const AUTH_KEY = 'healthpulse_auth_session'

export function getAuthSession(): UserSession | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    return null
  }
}

// Sync Firebase Authentication with localStorage session
if (typeof window !== 'undefined') {
  onAuthStateChanged(auth, async (user: any) => {
    if (user) {
      try {
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)

        let roleId: RoleId = 'citizen'
        let name = user.displayName || 'User'
        let aadhaar = ''

        if (userDoc.exists()) {
          const data = userDoc.data()
          roleId = data.role || 'citizen'
          name = data.name || name
          aadhaar = data.aadhaar || ''
        } else {
          // Check for demo email matches to auto-provision roles
          if (user.email === 'dho.jorhat@assam.gov.in' || user.email === 'btechjanu09@gmail.com') {
            roleId = 'dho'
            name = 'Dr. Arun Gogoi'
          } else if (user.email === 'state.admin@assam.gov.in') {
            roleId = 'state-admin'
            name = 'Dr. N. Sharma'
          } else if (user.email === 'asha.anjali@assam.gov.in') {
            roleId = 'asha'
            name = 'Anjali Boro'
          } else if (user.email === 'doctor.meera@assam.gov.in') {
            roleId = 'doctor'
            name = 'Dr. Meera Nair'
          } else if (user.email === 'lab.sanjay@assam.gov.in') {
            roleId = 'lab'
            name = 'Sanjay Kalita'
          } else if (user.email === 'water.priya@assam.gov.in') {
            roleId = 'water-officer'
            name = 'Priya Sen'
          } else if (user.email === 'collector.kavya@assam.gov.in') {
            roleId = 'collector'
            name = 'Kavya Reddy, IAS'
          } else {
            roleId = 'citizen'
          }

          // Write initial profile to Firestore
          await setDoc(userDocRef, {
            email: user.email || `${user.uid}@healthpulse.ai`,
            name,
            role: roleId,
            aadhaar,
            createdAt: new Date().toISOString(),
          })
        }

        const roleDef = ROLES[roleId] || ROLES.citizen
        const session: UserSession = {
          role: roleId,
          email: user.email || `${roleId}@healthpulse.ai`,
          name: name,
          scope: roleDef.scope,
          token: await user.getIdToken(),
          aadhaar: aadhaar || undefined,
          authenticatedAt: new Date().toISOString(),
        }

        localStorage.setItem(AUTH_KEY, JSON.stringify(session))
        window.dispatchEvent(new Event('auth_session_change'))
      } catch (err: any) {
        console.error('Error syncing auth session from Firestore:', err)
      }
    } else {
      localStorage.removeItem(AUTH_KEY)
      window.dispatchEvent(new Event('auth_session_change'))
    }
  })
}

// Keep helper signature for custom fallback flows,
// but login-form will primarily trigger native Firebase Auth actions.
export function setAuthSession(roleId: RoleId, email?: string, aadhaar?: string): UserSession {
  const roleDef = ROLES[roleId] || ROLES.citizen
  const session: UserSession = {
    role: roleId,
    email: email || `${roleId}@healthpulse.ai`,
    name: roleDef.sampleUser,
    scope: roleDef.scope,
    token: `hp_${Math.random().toString(36).substring(2)}${Date.now()}`,
    aadhaar: aadhaar || '481920494921',
    authenticatedAt: new Date().toISOString(),
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(session))
    window.dispatchEvent(new Event('auth_session_change'))
  }
  return session
}

export function clearAuthSession() {
  signOut(auth).catch((err: any) => {
    console.error('Firebase signOut error:', err)
  })
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
    window.dispatchEvent(new Event('auth_session_change'))
  }
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}
