# HealthPulse-AI: Authentication Architecture & Setup Guide

This setup report analyzes the current state of authentication in **HealthPulse-AI** and provides a step-by-step implementation guide to teach and set up **Firebase Authentication** and **Aadhaar Verification (UIDAI / ABHA / Gateway API)**.

---

## Part 1: Current Auth Architecture Analysis

Currently, HealthPulse-AI is structured with a modular mock authentication and role-based access control (RBAC) system:

### 1. File Structure Overview
- **`app/login/page.tsx`**: Split view displaying brand highlights and hosting the `LoginForm`.
- **`components/login-form.tsx`**: Tabbed interface featuring:
  - **Citizen Aadhaar Login**: UI flow prompting 12-digit Aadhaar & 4-digit OTP simulation.
  - **Official Staff Portal**: Dropdown selector for 9 distinct health surveillance roles with email/password input.
- **`lib/auth.ts`**: Client-side session management using `localStorage` (`healthpulse_auth_session`) and custom window event `auth_session_change`.
- **`lib/roles.ts`**: Defines the 9 roles (`citizen`, `asha`, `doctor`, `lab`, `water-officer`, `dho`, `health-officer`, `collector`, `state-admin`).
- **`lib/security.ts`**: OWASP-aligned security layer featuring:
  - **`hasPermission(role, permission)`**: Granular RBAC permission checks (`report:read`, `case:confirm`, `alert:approve`, etc.).
  - **`isValidAadhaar(aadhaar)`**: Verifies 12-digit format starting with digits 2-9.
  - **`maskAadhaar(aadhaar)`**: Masks numbers into `XXXX-XXXX-4921`.
  - **`checkRateLimit(clientId)`**: Token bucket rate limiter.
  - **`recordAuditEvent(...)`**: Audit logger for access attempts.

---

## Part 2: Step-by-Step Setup Guide — Firebase Authentication

Firebase Authentication will manage user accounts, tokens, session persistence, and multi-factor/phone verification.

### Step 1: Install Firebase Dependencies
Run the following in the project root:
```bash
npm install firebase firebase-admin
```

### Step 2: Configure Environment Variables
Create `.env.local` in the project root:
```env
# Firebase Client SDK Configuration
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="healthpulse-ai.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="healthpulse-ai"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="healthpulse-ai.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="1234567890"
NEXT_PUBLIC_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"

# Firebase Admin SDK Configuration (Server-Side Only)
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@healthpulse-ai.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSkAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
```

### Step 3: Initialize Firebase Client (`lib/firebase.ts`)
Create a singleton file `lib/firebase.ts`:
```typescript
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
export const auth = getAuth(app)
```

### Step 4: Initialize Firebase Admin SDK (`lib/firebase-admin.ts`)
Create `lib/firebase-admin.ts` for server API routes:
```typescript
import * as admin from 'firebase-admin'

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  })
}

export const adminAuth = admin.auth()
```

### Step 5: Custom Claims for RBAC Roles
When an official staff member logs in, set custom user claims on Firebase Auth so their role is embedded in the JWT token:

```typescript
// Server Action or API Route: /api/auth/set-role
import { adminAuth } from '@/lib/firebase-admin'

export async function setUserRole(uid: string, role: string) {
  await adminAuth.setCustomUserClaims(uid, { role })
}
```

---

## Part 3: Step-by-Step Setup Guide — Aadhaar Verification

Direct UIDAI API access requires ASA/KSA government licenses. For production applications, health initiatives typically connect through:
1. **Sandbox / Gateway Providers** (e.g. Setu Sandbox, Surepass, or Sandbox API).
2. **ABHA (Ayushman Bharat Health Account) M1/M2 APIs** via NHA (National Health Authority).

### Architecture Flow for Aadhaar OTP Auth

```mermaid
sequenceDiagram
    autonumber
    actor Resident as Citizen / Resident
    participant App as HealthPulse Frontend
    participant NextAPI as Next.js API Route (/api/auth/aadhaar)
    participant Gateway as Aadhaar Sandbox Gateway API
    participant FBAdmin as Firebase Admin SDK

    Resident->>App: Enters 12-digit Aadhaar Number
    App->>NextAPI: POST /api/auth/aadhaar/send-otp { aadhaar }
    NextAPI->>Gateway: Trigger OTP Request (Encrypted Payload)
    Gateway-->>Resident: SMS OTP sent to registered mobile
    Gateway-->>NextAPI: Returns clientId / transactionId
    NextAPI-->>App: { success: true, txnId }

    Resident->>App: Enters received 6-digit OTP
    App->>NextAPI: POST /api/auth/aadhaar/verify-otp { txnId, otp, aadhaar }
    NextAPI->>Gateway: Verify OTP
    Gateway-->>NextAPI: Validated (returns refId, maskedAadhaar, name)
    NextAPI->>FBAdmin: adminAuth.createCustomToken(uid, { role: 'citizen', aadhaarRef: refId })
    FBAdmin-->>NextAPI: Custom JWT Token
    NextAPI-->>App: { firebaseCustomToken, userProfile }
    App->>App: signInWithCustomToken(auth, customToken)
```

### Implementation Code Sample (`app/api/auth/aadhaar/send-otp/route.ts`)
```typescript
import { NextResponse } from 'next/server'
import { isValidAadhaar, checkRateLimit } from '@/lib/security'

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') || 'anonymous'
  const rateCheck = checkRateLimit(ip, 5, 60000) // 5 attempts per min
  if (!rateCheck.allowed) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const { aadhaar } = await req.json()
  if (!isValidAadhaar(aadhaar)) {
    return NextResponse.json({ error: 'Invalid Aadhaar format' }, { status: 400 })
  }

  // Call Gateway Provider API (e.g. Setu / Sandbox)
  const response = await fetch('https://api.sandbox.co.in/kyc/aadhaar/okyc/otp', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.SANDBOX_API_KEY!,
      'x-api-version': '1.0',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ aadhaar_number: aadhaar.replace(/\s+/g, '') }),
  })

  const data = await response.json()
  return NextResponse.json({ success: true, txnId: data.data?.ref_id })
}
```

---

## Part 4: Refactoring Plan for HealthPulse-AI

To seamlessly transition from mock storage to live Firebase + Aadhaar:

1. **Create React Context (`providers/auth-provider.tsx`)**:
   Wrap the app with `AuthProvider` that listens to `onAuthStateChanged(auth, user)` and decodes JWT custom claims to populate user role and permissions.

2. **Update `components/login-form.tsx`**:
   - Replace mock `setTimeout` in `handleSendAadhaarOtp` with `fetch('/api/auth/aadhaar/send-otp')`.
   - Replace mock `handleSubmit` with Firebase `signInWithEmailAndPassword` (for Admin) and `signInWithCustomToken` (for Citizen).

3. **Enforce Route Protection (`middleware.ts`)**:
   Create a Next.js `middleware.ts` to inspect session cookies or Firebase ID tokens, enforcing RBAC permissions based on `ROLE_PERMISSIONS` in `lib/security.ts`.

---

## Part 5: Summary Checklist for your Friend

- [ ] Sign up on Firebase Console & create project `healthpulse-ai`.
- [ ] Enable **Email/Password** and **Phone** sign-in methods in Firebase Auth settings.
- [ ] Add `.env.local` keys for Client & Admin SDKs.
- [ ] Register for a developer sandbox key (e.g., ABHA Sandbox or Sandbox.co.in API).
- [ ] Test the Aadhaar OTP flow in sandbox mode.
- [ ] Verify that `hasPermission()` in `lib/security.ts` properly restricts access to protected dashboards.
