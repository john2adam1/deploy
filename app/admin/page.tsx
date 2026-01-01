import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UsersManagement } from "@/components/admin/user-management"
import { TopicsManagement } from "@/components/admin/topics-management"
import { TestsManagement } from "@/components/admin/tests-management"
import ContactManager from "@/components/admin/ContactManager"
import { TicketsManagement } from "@/components/admin/tickets-management"
import { CarouselManagement } from "@/components/admin/carousel-management"
import { PricesManagement } from "@/components/admin/prices-management"

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
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
            <TabsTrigger value="topics">Mavzular</TabsTrigger>
            <TabsTrigger value="tests">Testlar</TabsTrigger>
            <TabsTrigger value="tickets">Biletlar</TabsTrigger>
            <TabsTrigger value="carousel">Karousel</TabsTrigger>
            <TabsTrigger value="prices">Narxlar</TabsTrigger>
            <TabsTrigger value="contact">Bog'lanish</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="topics">
            <TopicsManagement />
          </TabsContent>

          <TabsContent value="tests">
            <TestsManagement />
          </TabsContent>

          <TabsContent value="tickets">
            <TicketsManagement />
          </TabsContent>

          <TabsContent value="carousel">
            <CarouselManagement />
          </TabsContent>

          <TabsContent value="prices">
            <PricesManagement />
          </TabsContent>

          <TabsContent value="contact">
            <ContactManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
