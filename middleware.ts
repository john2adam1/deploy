import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("Middleware hitting path:", request.nextUrl.pathname)
  // Create response early
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.includes('.') // Skip files with extensions
  ) {
    return response
  }

  try {
    // Only create Supabase client if we have the required env vars
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables")
      return response
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
            response = NextResponse.next({ request })
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    // Get user session - this is the slow part, let's optimize it
    const { data: { session } } = await supabase.auth.getSession()
    const user = session?.user || null

    const pathname = request.nextUrl.pathname

    // Public routes - no auth needed
    const publicRoutes = ['/', '/login', '/register']
    if (publicRoutes.includes(pathname)) {
      // Redirect authenticated users away from login/register
      if (user && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
      return response
    }

    // Protected routes - require authentication
    const protectedRoutes = ['/dashboard', '/admin', '/test', '/settings', '/tickets']
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

    if (isProtectedRoute) {
      // Redirect to login if not authenticated
      if (!user) {
        return NextResponse.redirect(new URL("/login", request.url))
      }

      // Admin route protection - only check if accessing admin routes
      if (pathname.startsWith("/admin")) {
        // We'll check admin status in the page component instead
        // This avoids an extra database query in middleware
        response.headers.set('x-require-admin', 'true')
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}