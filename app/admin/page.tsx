import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersManagement } from "@/components/admin/user-management"
import { CategoriesManagement } from "@/components/admin/categories-management"
import { TestsManagement } from "@/components/admin/tests-management"
import FaqManager from "@/components/admin/FaqManager"
import AboutManager from "@/components/admin/AboutManager"
import ContactManager from "@/components/admin/ContactManager"
import MainSectionManager from "@/components/admin/MainSectionManager"



export default async function AdminPage() {
  const supabase = await getSupabaseServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: userData } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (!userData || userData.role !== "admin") {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userEmail={user.email} isAdmin={true} />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManagement />
          </TabsContent>

          <TabsContent value="tests">
            <TestsManagement />
          </TabsContent>
        </Tabs>
      </main>
      <MainSectionManager />
      <FaqManager />
      <AboutManager />
      <ContactManager />
    </div>
  )
}
