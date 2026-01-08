"use server"

import { getSupabaseAdminClient } from "@/lib/supabase/admin"

type RegistrationResult = {
    success?: boolean
    error?: string
}

export async function registerUserWithPhone(prevState: any, formData: FormData): Promise<RegistrationResult> {
    const phone = formData.get("phone") as string
    const password = formData.get("password") as string
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string

    // Basic validation
    if (!phone || password.length < 6) {
        return { error: "Telefon raqam yoki parol noto'g'ri (parol min 6 belgi)" }
    }

    // Format phone: remove spaces
    // Expected format: +998 90 123 45 67 -> +998901234567
    let cleanPhone = phone.replace(/\s+/g, "")

    // Ensure it starts with + if missing (assuming Uzbekistan context primarily, but let's be safe)
    if (!cleanPhone.startsWith("+")) {
        // If user entered 99890..., add +
        if (cleanPhone.startsWith("998")) {
            cleanPhone = "+" + cleanPhone
        } else {
            // Fallback or explicit error? Let's assume user might enter local format? 
            // Best to rely on what frontend sends. Frontend sends +998 usually.
            // If it's just 901234567, we might need logic. 
            // For now, let's assume frontend validation + manual entry includes prefix.
        }
    }

    const supabaseAdmin = getSupabaseAdminClient()

    try {
        // 1. Check if user exists (to give clear error)
        // Since we turned off phone verification, 'createUser' might throw if exists?
        // Admin API 'createUser': if user exists, it throws error usually.

        // 2. Create User in Auth (verified)
        const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.createUser({
            phone: cleanPhone,
            password: password,
            phone_confirm: true, // Auto-verify
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
            }
        })

        if (linkError) {
            console.error("Auth create error:", linkError)
            return { error: linkError.message === "User already registered" ? "Bu raqam allaqachon ro'yxatdan o'tgan" : linkError.message }
        }

        if (!linkData.user) {
            return { error: "Foydalanuvchi yaratilmadi" }
        }

        // 3. Create Profile in public.users
        // We generate a placeholder email to satisfy any legacy constraints or just to have data
        // Even if schema makes it nullable, it's harmless to have a dummy one for admin view consistency.
        const placeholderEmail = `${cleanPhone.replace('+', '')}@phone.dummy`
        // 7 days trial
        const now = new Date()
        const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()

        const { error: profileError } = await supabaseAdmin.from("users").insert({
            id: linkData.user.id,
            email: placeholderEmail,
            phone: cleanPhone,
            role: "user",
            trial_end: trialEnd,
            subscription_end: null,
            first_name: firstName || null,
            last_name: lastName || null,
            // active_device_id and last_login_at will be set on login
        })

        if (profileError) {
            console.error("Profile create error:", profileError)
            // Rollback auth user creation if profile fails? 
            // Ideally yes, but Supabase Admin doesn't have transactions across Auth & Public easily.
            // We'll return error for now.
            return { error: "Profil yaratishda xatolik: " + profileError.message }
        }

        return { success: true }
    } catch (err: any) {
        console.error("Registration error:", err)
        return { error: err.message || "Tizim xatoligi" }
    }
}
