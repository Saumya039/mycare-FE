import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Security Headers
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set("X-Content-Type-Options", "nosniff")
  requestHeaders.set("X-Frame-Options", "DENY")
  requestHeaders.set("X-XSS-Protection", "1; mode=block")
  requestHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin")

  // CORS Headers (allow your frontend domains)
  const origin = request.headers.get("origin") || ""
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    process.env.NEXT_PUBLIC_STAFF_URL || "",
    process.env.NEXT_PUBLIC_PATIENT_URL || "",
  ].filter(Boolean)

  if (allowedOrigins.includes(origin)) {
    requestHeaders.set("Access-Control-Allow-Origin", origin)
    requestHeaders.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    requestHeaders.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }

  // Handle preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: requestHeaders,
    })
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
}
