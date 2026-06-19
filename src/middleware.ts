import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const WINDOW_MS = 60_000
const MAX_REQUESTS = 100
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function getRateLimitInfo(ip: string) {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    const newEntry = { count: 1, resetAt: now + WINDOW_MS }
    rateLimitMap.set(ip, newEntry)
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetAt: newEntry.resetAt }
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: MAX_REQUESTS - entry.count, resetAt: entry.resetAt }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rate limiting for API routes
  if (pathname.startsWith("/api")) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const rl = getRateLimitInfo(ip)

    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((rl.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(MAX_REQUESTS),
            "X-RateLimit-Remaining": "0",
          },
        }
      )
    }

    const response = NextResponse.next()
    response.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS))
    response.headers.set("X-RateLimit-Remaining", String(rl.remaining))
    return response
  }

  // Security Headers for pages
  const response = NextResponse.next()
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // CORS Headers
  const origin = request.headers.get("origin") || ""
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_STAFF_URL || "",
    process.env.NEXT_PUBLIC_PATIENT_URL || "",
  ].filter(Boolean)

  if (allowedOrigins.includes(origin)) {
    response.headers.set("Access-Control-Allow-Origin", origin)
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
