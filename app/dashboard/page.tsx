import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { CountdownTimer } from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasActiveAccess } from "@/lib/access-control"
import { AlertCircle, ExternalLink, BookOpen, Shuffle, Ticket, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const subscriptionEnd = userData.subscription_end ? new Date(userData.subscription_end) : null
  const now = new Date()

  const subscriptionActive = subscriptionEnd && subscriptionEnd > now

  const { data: categories } = await supabase.from("categories").select("*").order("title")
  
  // Fetch topics with categories
  const { data: topics } = await supabase
    .from("topics")
    .select(`
      *,
      categories (
        id,
        title
      )
    `)
    .order("title")

  // Fetch tickets
  const { data: tickets } = await supabase.from("tickets").select("*").order("title")

  // Get all tests count for random/exam modes
  const { count: totalTestsCount } = await supabase
    .from("tests")
    .select("*", { count: "exact", head: true })

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Choose a test mode to begin practicing</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {(!hasAccess || searchParams?.premium === "required") && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">
                    {!hasAccess ? "Your access has expired" : "Premium sotib oling"}
                  </div>
                  <p className="text-sm mb-3">
                    {!hasAccess
                      ? "Purchase a subscription to continue testing"
                      : "Premium tarifni sotib olish uchun administrator bilan bog'laning"}
                  </p>
                  <Button asChild size="sm">
                    <a href="https://t.me/admin" target="_blank" rel="noopener noreferrer">
                      Contact Telegram Admin
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="categorized" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="categorized">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Kategoriyalangan
                </TabsTrigger>
                <TabsTrigger value="random">
                  <Shuffle className="mr-2 h-4 w-4" />
                  Tasodifiy
                </TabsTrigger>
                <TabsTrigger value="tickets">
                  <Ticket className="mr-2 h-4 w-4" />
                  Biletlar
                </TabsTrigger>
                <TabsTrigger value="exams">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  Imtihonlar
                </TabsTrigger>
              </TabsList>

              {/* Categorized Tests */}
              <TabsContent value="categorized" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Kategoriyalangan Testlar</h2>
                  {categories && categories.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {categories.map((category) => {
                        const categoryTopics = topics?.filter((t: any) => t.category_id === category.id) || []
                        return (
                          <Card key={category.id} className="hover:border-primary transition-colors">
                            <CardHeader>
                              <CardTitle>{category.title}</CardTitle>
                              <CardDescription>
                                {categoryTopics.length > 0
                                  ? `${categoryTopics.length} mavzu(lar)`
                                  : "Mavzular mavjud emas"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {categoryTopics.length > 0 ? (
                                <div className="space-y-2">
                                  {categoryTopics.map((topic: any) => (
                                    <Button
                                      key={topic.id}
                                      asChild
                                      variant="outline"
                                      className="w-full justify-start"
                                      disabled={!hasAccess}
                                    >
                                      <Link href={`/test/topic/${topic.id}`}>{topic.title}</Link>
                                    </Button>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  Bu kategoriyada mavzular mavjud emas
                                </p>
                              )}
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Hozircha kategoriyalar mavjud emas
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Random Tests */}
              <TabsContent value="random" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Tasodifiy Testlar</h2>
                  <Card>
                    <CardHeader>
                      <CardTitle>Tasodifiy Test</CardTitle>
                      <CardDescription>
                        Cheksiz savollar - har qanday vaqtda tugatish mumkin
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Barcha mavjud testlardan tasodifiy savollar tanlanadi. Siz istalgan vaqtda testni
                        tugatishingiz mumkin.
                      </p>
                      <Button asChild className="w-full" disabled={!hasAccess || !totalTestsCount || totalTestsCount < 1}>
                        <Link href="/test/random">Tasodifiy testni boshlash</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Tickets */}
              <TabsContent value="tickets" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Biletlar</h2>
                  {tickets && tickets.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {tickets.map((ticket) => (
                        <Card key={ticket.id} className="hover:border-primary transition-colors">
                          <CardHeader>
                            <CardTitle>{ticket.title}</CardTitle>
                            {ticket.description && (
                              <CardDescription>{ticket.description}</CardDescription>
                            )}
                          </CardHeader>
                          <CardContent>
                            <Button asChild className="w-full" disabled={!hasAccess}>
                              <Link href={`/test/ticket/${ticket.id}`}>Biletni boshlash</Link>
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      Hozircha biletlar mavjud emas
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Exams */}
              <TabsContent value="exams" className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Imtihonlar</h2>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Card className="hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle>Imtihon 20</CardTitle>
                        <CardDescription>20 ta tasodifiy savol</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          className="w-full"
                          disabled={!hasAccess || !totalTestsCount || totalTestsCount < 20}
                        >
                          <Link href="/test/exam/20">Boshlash</Link>
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle>Imtihon 50</CardTitle>
                        <CardDescription>50 ta tasodifiy savol</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          className="w-full"
                          disabled={!hasAccess || !totalTestsCount || totalTestsCount < 50}
                        >
                          <Link href="/test/exam/50">Boshlash</Link>
                        </Button>
                      </CardContent>
                    </Card>
                    <Card className="hover:border-primary transition-colors">
                      <CardHeader>
                        <CardTitle>Imtihon 100</CardTitle>
                        <CardDescription>100 ta tasodifiy savol</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button
                          asChild
                          className="w-full"
                          disabled={!hasAccess || !totalTestsCount || totalTestsCount < 100}
                        >
                          <Link href="/test/exam/100">Boshlash</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Imtihonlar barcha mavjud testlardan tasodifiy tanlanadi
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptionActive && (
                  <div>
                    <div className="text-sm font-medium mb-2">Subscription Active</div>
                    <CountdownTimer endTime={userData.subscription_end!} label="Subscription ends in" />
                  </div>
                )}

                {!hasAccess && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
                    <div className="text-sm font-medium text-destructive mb-2">Access Expired</div>
                    <p className="text-sm text-muted-foreground mb-3">Contact admin to purchase subscription</p>
                    <Button asChild size="sm" className="w-full">
                      <a href="https://t.me/admin" target="_blank" rel="noopener noreferrer">
                        Contact Telegram Admin
                      </a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
