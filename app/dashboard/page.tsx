// app/dashboard/page.tsx
import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasActiveAccess } from "@/lib/access-control"
import { BookOpen, Shuffle, Ticket, GraduationCap, Lock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ClearResultsButton } from "@/components/clear-results-button"
import { SubscriptionBanner } from "@/components/subscription-banner"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [
    { data: userData },
    { data: topics },
    { data: tickets },
    { count: totalTestsCount },
    { data: contactData },
    { data: examStats },
    { data: topicStats }
  ] = await Promise.all([
    supabase.from("users").select("*").eq("id", user.id).single(),
    supabase.from("topics").select("*").order("title"),
    supabase.from("tickets").select("*").order("title"),
    supabase.from("tests").select("*", { count: "exact", head: true }),
    supabase.from("site_content").select("content").eq("type", "contact").maybeSingle(),
    supabase.from("exam_statistics").select("exam_type, percentage").eq("user_id", user.id),
    supabase.from("topic_statistics").select("topic_id, percentage").eq("user_id", user.id)
  ])

  if (!userData) redirect("/login")

  // Create stats maps
  const examStatsMap = (examStats || []).reduce((acc: Record<number, number>, stat: any) => {
    acc[stat.exam_type] = stat.percentage
    return acc
  }, {})

  const topicStatsMap = (topicStats || []).reduce((acc: Record<string, number>, stat: any) => {
    acc[stat.topic_id] = stat.percentage
    return acc
  }, {})

  const hasAccess = hasActiveAccess(userData)
  const telegramLink = contactData?.content?.telegram_link || "https://t.me/yourusername"

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />

      <main className="container mx-auto px-4 py-8">
        {/* Subscription Banner */}
        <div className="max-w-2xl mx-auto mb-8">
          <SubscriptionBanner user={userData} telegramLink={telegramLink} />
        </div>

        <div className="mb-8 text-center relative">
          <h1 className="text-3xl font-bold mb-2">Xush kelibsiz!</h1>
          <p className="text-muted-foreground mb-4">Test rejimini tanlang va boshlang</p>
          <div className="flex justify-center">
            <ClearResultsButton />
          </div>
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
              {[20, 50, 100].map((count) => {
                const percentage = examStatsMap[count]
                return (
                  <Button
                    key={count}
                    asChild
                    className="w-full relative justify-between px-4"
                    disabled={!hasAccess || !totalTestsCount || totalTestsCount < count}
                  >
                    {hasAccess ? (
                      <Link href={`/test/exam/${count}`} className="w-full flex items-center justify-between">
                        <span>Imtihon {count}</span>
                        {percentage !== undefined && (
                          <Badge variant={percentage >= 90 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                            {percentage}%
                          </Badge>
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center justify-center gap-2 w-full">
                        <Lock className="h-4 w-4" />
                        Imtihon {count} (Premium)
                      </div>
                    )}
                  </Button>
                )
              })}
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
              <Button asChild className="w-full" disabled={!tickets || tickets.length === 0}>
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
                    const percentage = topicStatsMap[topic.id]

                    return (
                      <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg border">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{topic.title}</span>
                          {!isPublic && <Badge variant="destructive">Premium</Badge>}
                        </div>

                        <div className="flex items-center gap-2">
                          {canAccess && percentage !== undefined && (
                            <Badge variant={percentage >= 90 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                              {percentage}%
                            </Badge>
                          )}
                          <Button asChild size="sm" disabled={!canAccess}>
                            {canAccess ? (
                              <Link href={`/test/topic/${topic.id}`}>Boshlash</Link>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Lock className="h-3 w-3" />
                                Premium
                              </div>
                            )}
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
              <Button
                asChild
                className="w-full"
                disabled={!hasAccess || !totalTestsCount || totalTestsCount < 1}
              >
                {hasAccess ? (
                  <Link href="/test/random">Tasodifiy testni boshlash</Link>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Lock className="h-4 w-4" />
                    Premium obuna kerak
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}