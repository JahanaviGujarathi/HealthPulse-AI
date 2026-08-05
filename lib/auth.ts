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
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
    window.dispatchEvent(new Event('auth_session_change'))
  }
}

export function isAuthenticated(): boolean {
  return getAuthSession() !== null
}
