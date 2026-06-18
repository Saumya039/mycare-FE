"use client"

import { SupabaseAuthProvider } from "@/context/SupabaseAuthContext"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>
}
