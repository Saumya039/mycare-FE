"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

type SessionUser = {
  id: string
  name: string
  email: string
  role: string
  department?: string
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
      setStatus("unauthenticated")
      return
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get Firebase Custom Claims (role, department, etc.)
        const tokenResult = await user.getIdTokenResult()
        const role = (tokenResult.claims.role as string) || "SUPER_ADMIN"
        const department = (tokenResult.claims.department as string) || undefined

        setData({
          user: {
            id: user.uid,
            email: user.email || "",
            name: user.displayName || user.email?.split("@")[0] || "User",
            role,
            department,
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
