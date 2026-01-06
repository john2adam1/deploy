import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

// #region agent log
fetch('http://127.0.0.1:7242/ingest/deddb419-d5fa-4d5c-b0af-a92b16ae4dd2',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'proxy.ts:4',message:'File proxy.ts exports proxy function - correct match',data:{fileName:'proxy.ts',exportName:'proxy',match:'correct'},timestamp:Date.now(),sessionId:'debug-session',runId:'post-fix',hypothesisId:'A'})}).catch(()=>{});
// #endregion

export async function proxy(request: NextRequest) {
  try {
    let response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    })

    // Check if environment variables are set
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

            response = NextResponse.next({
              request,
            })

            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    let user = null
    try {
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("Auth error in proxy:", authError.message)
        // Continue without user if auth fails
      } else {
        user = authUser
      }
    } catch (error) {
      console.error("Error getting user in proxy:", error)
      // Continue without user if there's an error
    }

    // 🔒 Admin route protection
    if (request.nextUrl.pathname.startsWith("/admin") && user) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single()

        if (userError) {
          console.error("Error fetching user data:", userError.message)
          // If we can't verify admin status, redirect to dashboard for safety
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }

        if (userData?.role !== "admin") {
          return NextResponse.redirect(new URL("/dashboard", request.url))
        }
      } catch (error) {
        console.error("Error in admin check:", error)
        // On error, redirect to dashboard for safety
        return NextResponse.redirect(new URL("/dashboard", request.url))
      }
    }

    // 🚫 Auth userlarni login/registerdan chiqarish
    if (
      user &&
      (request.nextUrl.pathname === "/login" ||
        request.nextUrl.pathname === "/register")
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    // 🚫 Login qilmaganlarni himoyalangan sahifalardan chiqarish
    if (
      !user &&
      (request.nextUrl.pathname.startsWith("/dashboard") ||
        request.nextUrl.pathname.startsWith("/admin") ||
        request.nextUrl.pathname.startsWith("/test") ||
        request.nextUrl.pathname.startsWith("/settings") ||
        request.nextUrl.pathname.startsWith("/tickets"))
    ) {
      return NextResponse.redirect(new URL("/login", request.url))
    }

    return response
  } catch (error) {
    // If anything goes wrong, allow the request to proceed
    // This prevents the proxy from blocking all requests on error
    console.error("Proxy error:", error)
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    })
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/test/:path*",
    "/settings/:path*",
    "/tickets/:path*",
    "/login",
    "/register",
  ],
}

