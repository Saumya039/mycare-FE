"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { usePathname } from "next/navigation"

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

const NativeAuthContext = createContext<AuthContextType>({
  data: null,
  status: "loading",
})

export function NativeAuthProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<SessionData | null>(null)
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading")
  const pathname = usePathname()

  const checkSession = async () => {
    try {
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
        setStatus("authenticated")
      } else {
        setData(null)
        setStatus("unauthenticated")
      }
    } catch (error) {
      console.error("Failed to check session", error)
      setData(null)
      setStatus("unauthenticated")
    }
  }

  useEffect(() => {
    // Check session on mount and when navigating between pages to ensure it's valid
    checkSession()
  }, [pathname])

  return (
    <NativeAuthContext.Provider value={{ data, status }}>
      {children}
    </NativeAuthContext.Provider>
  )
}

// Mimic NextAuth's useSession hook signature for easy refactoring
export function useSession() {
  return useContext(NativeAuthContext)
}
