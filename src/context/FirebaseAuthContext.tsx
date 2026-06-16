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
        try {
          // Fetch the user's role and database profile from our new API
          const response = await fetch("/api/auth/me")
          if (response.ok) {
            const data = await response.json()
            setData({
              user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role,
                department: data.user.department,
              }
            })
          } else {
            // Fallback if API fails
            setData({
              user: {
                id: user.uid,
                email: user.email || "",
                name: user.displayName || user.email?.split("@")[0] || "User",
                role: "SUPER_ADMIN", // Temporary safe fallback
                department: undefined,
              }
            })
          }
        } catch (error) {
          console.error("Failed to fetch user profile", error)
          setData({
            user: {
              id: user.uid,
              email: user.email || "",
              name: user.displayName || user.email?.split("@")[0] || "User",
              role: "SUPER_ADMIN",
            }
          })
        }
        
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
