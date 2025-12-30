import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { hasActiveAccess } from "@/lib/access-control"
import { EnhancedTestInterface } from "@/components/enhanced-test-interface"

export default async function TopicTestPage({ params }: { params: Promise<{ topicId: string }> }) {
  const { topicId } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData) redirect("/dashboard")

  const { data: topic } = await supabase
    .from("topics")
    .select(`
      *,
      categories (
        id,
        title
      )
    `)
    .eq("id", topicId)
    .single()

  const { data: tests } = await supabase
    .from("tests")
    .select("*")
    .eq("topic_id", topicId)
    .order("created_at")

  // Get user settings
  const { data: userSettings } = await supabase
    .from("user_settings")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!topic || !tests?.length) {
    redirect("/dashboard")
  }

  // Public / premium access control
  const isPremiumRequired = !(topic as any).is_public
  const hasPremium = hasActiveAccess(userData)

  if (isPremiumRequired && !hasPremium) {
    redirect("/dashboard?premium=required")
  }

  const title = `${topic.categories?.title || ""} - ${topic.title}`

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />
      <EnhancedTestInterface
        title={title}
        tests={tests}
        userId={user.id}
        testType="topic"
        testTypeId={topicId}
        userSettings={userSettings}
      />
    </div>
  )
}

