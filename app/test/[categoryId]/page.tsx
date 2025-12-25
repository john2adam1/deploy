import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { hasActiveAccess } from "@/lib/access-control"
import { TestInterface } from "@/components/test-interface"

export default async function TestPage({ params }: { params: Promise<{ categoryId: string }> }) {
  const { categoryId } = await params
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData || !hasActiveAccess(userData)) {
    redirect("/dashboard")
  }

  const { data: category } = await supabase.from("categories").select("*").eq("id", categoryId).single()

  const { data: tests } = await supabase.from("tests").select("*").eq("category_id", categoryId).order("created_at")

  if (!category || !tests?.length) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={userData.role === "admin"} />
      <TestInterface categoryTitle={category.title} tests={tests} userId={user.id} />
    </div>
  )
}
