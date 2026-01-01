import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { hasActiveAccess } from "@/lib/access-control"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default async function TicketsPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) redirect("/login")

  const hasAccess = hasActiveAccess(userData)

  // Fetch all tickets
  const { data: tickets } = await supabase
    .from("tickets")
    .select("*")
    .order("created_at")

  // Create numbered buttons (1-21 or based on ticket count)
  const ticketCount = tickets?.length || 0
  const maxTickets = Math.max(21, ticketCount)
  const ticketNumbers = Array.from({ length: maxTickets }, (_, i) => i + 1)

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Biletlar bo'yicha testlar</h1>
          <p className="text-muted-foreground">Biletni tanlang va testni boshlang</p>
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {ticketNumbers.map((num) => {
                const ticket = tickets?.[num - 1]
                const isPublic = ticket?.is_public ?? false
                const canAccess = isPublic || hasAccess

                return (
                  <Button
                    key={num}
                    asChild
                    variant={ticket ? "default" : "outline"}
                    disabled={!ticket || !canAccess}
                    className="aspect-square h-16 sm:h-20 text-lg font-semibold"
                  >
                    {ticket && canAccess ? (
                      <Link href={`/test/ticket/${ticket.id}`}>{num}</Link>
                    ) : (
                      <span>{num}</span>
                    )}
                  </Button>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

