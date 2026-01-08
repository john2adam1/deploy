"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut, Settings, LayoutDashboard } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface NavbarProps {
  userEmail?: string
  isAdmin?: boolean
}

export function Navbar({ userEmail, isAdmin }: NavbarProps) {
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const [mounted, setMounted] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState<"uz-lat" | "uz-cyr" | "ru">("uz-lat")
  const [userProfile, setUserProfile] = useState<{ firstName?: string, lastName?: string, phone?: string } | null>(null)

  useEffect(() => {
    setMounted(true)
    // Load language from user settings
    const loadLanguage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: settings } = await supabase
          .from("user_settings")
          .select("language")
          .eq("user_id", user.id)
          .single()
        if (settings?.language) {
          setCurrentLanguage(settings.language as "uz-lat" | "uz-cyr" | "ru")
        }
      }
    }
    loadLanguage()
  }, [supabase])

  useEffect(() => {
    const verifyDevice = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        // Fetch user profile details
        const { data: dbUser } = await supabase
          .from("users")
          .select("id, role, active_device_id, first_name, last_name, phone")
          .eq("id", user.id)
          .single()

        if (dbUser) {
          setUserProfile({
            firstName: dbUser.first_name,
            lastName: dbUser.last_name,
            phone: dbUser.phone
          })
        }

        if (!dbUser || dbUser.role === "admin") return

        if (!dbUser || dbUser.role === "admin") return

        if (typeof window === "undefined") return

        const localDeviceId = window.localStorage.getItem("deviceId")

        if (dbUser.active_device_id && dbUser.active_device_id !== localDeviceId) {
          await supabase.auth.signOut()
          window.localStorage.removeItem("deviceId")
          router.push("/login?session=conflict")
        }
      } catch {
        // Fail-safe: do nothing on error
      }
    }

    verifyDevice()
  }, [router, supabase])

  const handleLanguageChange = async (lang: "uz-lat" | "uz-cyr" | "ru") => {
    setCurrentLanguage(lang)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      // Update or create user settings
      const { data: existing } = await supabase
        .from("user_settings")
        .select("id")
        .eq("user_id", user.id)
        .single()

      if (existing) {
        await supabase
          .from("user_settings")
          .update({ language: lang })
          .eq("user_id", user.id)
      } else {
        await supabase.from("user_settings").insert({
          user_id: user.id,
          language: lang,
        })
      }
      router.refresh()
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("deviceId")
    }
    router.push("/login")
  }

  const languageLabels = {
    "uz-lat": "O'zbek (Lotin)",
    "uz-cyr": "Ўзбек (Кирилл)",
    "ru": "Русский",
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-semibold">Sardor Avtotest</span>
        </Link>

        <div className="flex items-center gap-4">
          {isAdmin && (
            <Button asChild variant="ghost">
              <Link href="/admin">
                <Settings className="mr-2 h-4 w-4" />
                Admin Panel
              </Link>
            </Button>
          )}

          {mounted ? (
            <>
              <LanguageSwitcher />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{userEmail?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm">
                    <div className="font-medium">
                      {(userProfile?.firstName || userProfile?.lastName)
                        ? `${userProfile.firstName || ""} ${userProfile.lastName || ""}`.trim()
                        : "Foydalanuvchi"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {userProfile?.phone || userEmail}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{userEmail?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
