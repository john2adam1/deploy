import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { hasActiveAccess } from "@/lib/access-control"
import { EnhancedTestInterface } from "@/components/enhanced-test-interface"

export default async function TicketTestPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) redirect("/dashboard")

  const { data: ticket } = await supabase.from("tickets").select("*").eq("id", ticketId).single()

  // Get ticket tests in order
  const { data: ticketTests } = await supabase
    .from("ticket_tests")
    .select(`
      *,
      tests (*)
    `)
    .eq("ticket_id", ticketId)
    .order("order_index")

  // Get user settings
  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!ticket || !ticketTests || ticketTests.length === 0) {
    redirect("/dashboard")
  }

  // Extract tests from ticket_tests
  const tests = ticketTests.map((tt: any) => tt.tests).filter(Boolean)

  if (tests.length === 0) {
    redirect("/dashboard")
  }

  // Public / premium access control
  const isPremiumRequired = !(ticket as any).is_public
  const hasPremium = hasActiveAccess(userData)

  if (isPremiumRequired && !hasPremium) {
    redirect("/dashboard?premium=required")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />
      <EnhancedTestInterface
        title={ticket.title}
        tests={tests}
        userId={user.id}
        testType="ticket"
        testTypeId={ticketId}
        userSettings={userSettings}
      />
    </div>
  )
}

