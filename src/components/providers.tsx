"use client"

import { NativeAuthProvider } from "@/context/NativeAuthContext"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
  return <NativeAuthProvider>{children}</NativeAuthProvider>
}
