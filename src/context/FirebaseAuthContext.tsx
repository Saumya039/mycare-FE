"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

type SessionUser = {
  id: string
  name: string
  email: string
  role: string
}

type SessionData = {
  user: SessionUser
}

type AuthContextType = {
  data: SessionData | null
  status: "loading" | "authenticated" | "unauthenticated"
}

const FirebaseAuthContext = createContext<AuthContextType>({
  data: null,
  status: "loading",
})

export function FirebaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SessionData | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    if (!auth) {
      // Firebase not configured yet
      setStatus("unauthenticated")
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // In a real implementation with Firebase Custom Claims, you would fetch the role like:
        // const tokenResult = await user.getIdTokenResult()
        // const role = tokenResult.claims.role as string

        // For this demo, we'll assign roles based on the email domain or a mock lookup since 
        // the external database might not be fully synced with Firebase Auth yet.
        const mockRoles: Record<string, string> = {
          'superadmin@sevraai.com': 'SUPER_ADMIN',
          'admin@sevraai.com': 'ADMIN',
          'doctor@sevraai.com': 'DOCTOR',
          'accountant@sevraai.com': 'ACCOUNTANT',
          'receptionist@sevraai.com': 'RECEPTIONIST',
          'pharmacist@sevraai.com': 'PHARMACIST',
          'pathologist@sevraai.com': 'PATHOLOGIST',
          'radiologist@sevraai.com': 'RADIOLOGIST',
          'nurse@sevraai.com': 'NURSE'
        }

        const userRole = user.email && mockRoles[user.email] ? mockRoles[user.email] : "USER"

        setData({
          user: {
            id: user.uid,
            email: user.email || "",
            name: user.displayName || "Firebase User",
            role: userRole,
          }
        })
        setStatus("authenticated")
      } else {
        setData(null)
        setStatus("unauthenticated")
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <FirebaseAuthContext.Provider value={{ data, status }}>
      {children}
    </FirebaseAuthContext.Provider>
  )
}

// Mimic NextAuth's useSession hook signature for easy refactoring
export function useSession() {
  return useContext(FirebaseAuthContext)
}
