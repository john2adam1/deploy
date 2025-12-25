import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { CountdownTimer } from "@/components/countdown-timer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { hasActiveAccess } from "@/lib/access-control"
import { AlertCircle, ExternalLink } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default async function DashboardPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) redirect("/login")

  const hasAccess = hasActiveAccess(userData)
  const trialEnd = new Date(userData.trial_end)
  const subscriptionEnd = userData.subscription_end ? new Date(userData.subscription_end) : null
  const now = new Date()

  const trialActive = trialEnd > now
  const subscriptionActive = subscriptionEnd && subscriptionEnd > now

  const { data: categories } = await supabase.from("categories").select("*").order("title")

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">Choose a test category to begin practicing</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {!hasAccess && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Your access has expired</div>
                  <p className="text-sm mb-3">Purchase a subscription to continue testing</p>
                  <Button asChild size="sm">
                    <a href="https://t.me/admin" target="_blank" rel="noopener noreferrer">
                      Contact Telegram Admin
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            <div>
              <h2 className="text-xl font-semibold mb-4">Test Categories</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categories?.map((category) => (
                  <Card key={category.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <CardTitle>{category.title}</CardTitle>
                      <CardDescription>Practice test available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full" disabled={!hasAccess}>
                        <Link href={`/test/${category.id}`}>Start Test</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}

                {!categories?.length && (
                  <div className="col-span-2 text-center py-12 text-muted-foreground">
                    No test categories available yet
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {trialActive && (
                  <div>
                    <div className="text-sm font-medium mb-2">Free Trial Active</div>
                    <CountdownTimer endTime={userData.trial_end} label="Trial ends in" />
                  </div>
                )}

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
