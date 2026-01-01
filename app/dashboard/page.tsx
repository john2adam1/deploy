import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasActiveAccess } from "@/lib/access-control"
import { BookOpen, Shuffle, Ticket, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) redirect("/login")

  const hasAccess = hasActiveAccess(userData)

  const { data: topics } = await supabase.from("topics").select("*").order("title")
  const { data: tickets } = await supabase.from("tickets").select("*").order("title")
  const { count: totalTestsCount } = await supabase
    .from("tests")
    .select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Xush kelibsiz!</h1>
          <p className="text-muted-foreground">Test rejimini tanlang va boshlang</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {/* Imtihonlar */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Imtihonlar
              </CardTitle>
              <CardDescription>20, 50 yoki 100 ta tasodifiy savol</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                className="w-full"
                disabled={!hasAccess || !totalTestsCount || totalTestsCount < 20}
              >
                <Link href="/test/exam/20">Imtihon 20</Link>
              </Button>
              <Button
                asChild
                className="w-full"
                disabled={!hasAccess || !totalTestsCount || totalTestsCount < 50}
              >
                <Link href="/test/exam/50">Imtihon 50</Link>
              </Button>
              <Button
                asChild
                className="w-full"
                disabled={!hasAccess || !totalTestsCount || totalTestsCount < 100}
              >
                <Link href="/test/exam/100">Imtihon 100</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Biletlar */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Biletlar
              </CardTitle>
              <CardDescription>Biletlar bo'yicha testlar</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" disabled={!hasAccess || !tickets || tickets.length === 0}>
                <Link href="/tickets">Biletlarni ko'rish</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Mavzular */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Mavzular
              </CardTitle>
              <CardDescription>Mavzular bo'yicha testlar</CardDescription>
            </CardHeader>
            <CardContent>
              {topics && topics.length > 0 ? (
                <div className="space-y-2">
                  {topics.map((topic: any) => {
                    const isPublic = topic.is_public
                    const canAccess = isPublic || hasAccess

                    return (
                      <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg border">
                        <span className="font-medium">{topic.title}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant={isPublic ? "outline" : "destructive"}>
                            {isPublic ? "Public" : "Premium"}
                          </Badge>
                          <Button asChild size="sm" disabled={!canAccess}>
                            <Link href={`/test/topic/${topic.id}`}>Boshlash</Link>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  Hozircha mavzular mavjud emas
                </p>
              )}
            </CardContent>
          </Card>

          {/* Tasodifiy */}
          <Card className="hover:border-primary transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Tasodifiy testlar
              </CardTitle>
              <CardDescription>Cheksiz savollar - har qanday vaqtda tugatish mumkin</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full" disabled={!hasAccess || !totalTestsCount || totalTestsCount < 1}>
                <Link href="/test/random">Tasodifiy testni boshlash</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
