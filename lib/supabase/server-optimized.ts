// lib/supabase/server-optimized.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { cache } from "react"

// Cache the Supabase client creation per request
export const getSupabaseServerClientOptimized = cache(async () => {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options)
                        })
                    } catch (error) {
                        // Handle cookies in Server Components
                    }
                },
            },
        }
    )
})

// Cache user data per request
export const getCurrentUser = cache(async () => {
    const supabase = await getSupabaseServerClientOptimized()
    const { data: { user } } = await supabase.auth.getUser()
    return user
})

// Cache user role check per request
export const getUserRole = cache(async (userId: string) => {
    const supabase = await getSupabaseServerClientOptimized()
    const { data } = await supabase
        .from("users")
        .select("role")
        .eq("id", userId)
        .single()
    return data?.role || "user"
})