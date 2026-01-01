"use client"

import { useState } from "react"
import type { FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { BookOpen } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  const sessionConflict = searchParams.get("session") === "conflict"

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Single-device login: generate deviceId and save to DB (non-admins enforced elsewhere)
      const deviceId = crypto.randomUUID()
      if (typeof window !== "undefined") {
        window.localStorage.setItem("deviceId", deviceId)
      }

      if (data.user) {
        await supabase
          .from("users")
          .update({
            active_device_id: deviceId,
            last_login_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)
      }

      router.push("/dashboard")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Tezkor Avtotest</span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Qaytib kelganingizdan xursandmiz</CardTitle>
            <CardDescription>Email va parol bilan tizimga kiring</CardDescription>
          </CardHeader>
          <CardContent>
            {sessionConflict && (
              <Alert className="mb-4" variant="destructive">
                <AlertDescription>Hisobingiz boshqa qurilmada ochildi</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Parol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Parolingizni kiriting"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Kirilmoqda..." : "Kirish"}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Hisobingiz yo'qmi?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Ro'yxatdan o'tish
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
