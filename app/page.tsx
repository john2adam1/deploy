import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Trophy, Shield } from "lucide-react"
import { AboutSection } from "@/components/AboutSection"
import FAQSection from "@/components/FaqSection"
import { ContactSection } from "@/components/ContactSection"
import { MainSection } from "@/components/MainSection"
import { Statistics } from "@/components/Statistics"


export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">TestMaster</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-16">
        <MainSection />
        <Statistics />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
    </div>
  )
}
