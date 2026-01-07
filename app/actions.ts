"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function clearUserResults() {
    const supabase = await getSupabaseServerClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: "User not authenticated" }
    }

    try {
        await Promise.all([
            supabase.from("ticket_statistics").delete().eq("user_id", user.id),
            supabase.from("topic_statistics").delete().eq("user_id", user.id),
            supabase.from("exam_statistics").delete().eq("user_id", user.id)
        ])

        revalidatePath("/dashboard")
        revalidatePath("/tickets")
        revalidatePath("/admin")
        return { success: true }
    } catch (error) {
        console.error("Error clearing results:", error)
        return { error: "Failed to clear results" }
    }
}
