"use client"

import { FirebaseAuthProvider } from "@/context/FirebaseAuthContext"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
}
