import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence, inMemoryPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyC-hfG4gM3wAPfcOqEswBbJtaNl1yw7OcI',
  authDomain: 'healthpulse-6fa2b.firebaseapp.com',
  projectId: 'healthpulse-6fa2b',
  storageBucket: 'healthpulse-6fa2b.firebasestorage.app',
  messagingSenderId: '285817600732',
  appId: '1:285817600732:web:11590cbf46b4713b5fd219',
  measurementId: 'G-7EKQ7GYGQ8',
}

// SSR safe initialization pattern
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)

// Configure robust persistence to prevent IndexedDB "Database is closing/hidden" errors
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence).catch(() => {
    // Fallback to in-memory persistence if IndexedDB is blocked or closing in browser
    setPersistence(auth, inMemoryPersistence).catch((err: any) => {
      console.warn('Firebase auth persistence fallback:', err)
    })
  })
}

export { app, auth, db }
