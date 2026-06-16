import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getServerSession } from "./lib/auth-server"

const protectedApiRoutes = ["/api/patients", "/api/staff", "/api/appointments", "/api/invoices", "/api/billing"]
const protectedPages = ["/", "/settings", "/reports", "/monitoring", "/billing", "/finance"]

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

  // Verify authentication for protected routes
  const isProtectedApiRoute = protectedApiRoutes.some((route) => pathname.startsWith(route))
  const isProtectedPage = protectedPages.some((page) => pathname === page || pathname.startsWith(page + "/"))
  const isAuthPage = pathname === "/login" || pathname === "/portal/login"

  if (isProtectedApiRoute || (isProtectedPage && !isAuthPage)) {
    try {
      const session = await getServerSession()

      if (!session) {
        // Redirect to login if accessing protected page
        if (!pathname.startsWith("/api/")) {
          const loginUrl = new URL("/login", request.url)
          return NextResponse.redirect(loginUrl)
        }
        // Return 401 for API routes
        return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: requestHeaders })
      }

      // Add user info to request headers for use in API routes
      requestHeaders.set("x-user-id", session.user.id)
      requestHeaders.set("x-user-email", session.user.email)
      requestHeaders.set("x-user-role", session.user.role)
      if (session.user.department) {
        requestHeaders.set("x-user-department", session.user.department)
      }
    } catch (error) {
      console.error("Auth middleware error:", error)
      if (!pathname.startsWith("/api/")) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      return NextResponse.json({ error: "Authentication failed" }, { status: 401, headers: requestHeaders })
    }
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
