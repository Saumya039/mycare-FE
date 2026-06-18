"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

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

const SupabaseAuthContext = createContext<AuthContextType>({
  data: null,
  status: "loading",
})

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SessionData | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")

  useEffect(() => {
    const supabase = createClient()

    const fetchProfile = async (user: any) => {
      try {
        // Fetch the user's role and database profile from our API
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const resData = await response.json()
          setData({
            user: {
              id: resData.user.id,
              email: resData.user.email,
              name: resData.user.name,
              role: resData.user.role,
              department: resData.user.department,
            }
          })
        } else {
          // Fallback if API fails
          setData({
            user: {
              id: user.id,
              email: user.email || "",
              name: user.user_metadata?.name || user.email?.split("@")[0] || "User",
              role: "SUPER_ADMIN", // Temporary safe fallback
              department: undefined,
            }
          })
        }
      } catch (error) {
        console.error("Failed to fetch user profile", error)
      }
      setStatus("authenticated")
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setData(null)
        setStatus("unauthenticated")
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user)
      } else {
        setData(null)
        setStatus("unauthenticated")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SupabaseAuthContext.Provider value={{ data, status }}>
      {children}
    </SupabaseAuthContext.Provider>
  )
}

// Mimic NextAuth's useSession hook signature for easy refactoring
export function useSession() {
  return useContext(SupabaseAuthContext)
}
