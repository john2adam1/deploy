import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { AboutSection } from "@/components/AboutSection"
import { Statistics } from "@/components/Statistics"
import { ContactSection } from "@/components/ContactSection"
import { Carousel } from "@/components/Carousel"
import { PricesSection } from "@/components/PricesSection"

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Tezkor Avtotest</span>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Kirish</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Boshlash</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Carousel */}
        <Suspense fallback={null}>
          <Carousel />
        </Suspense>

        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
            Xush kelibsiz! <span className="text-primary">Tezkor Avtotest</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl mb-10">
            Tezroq o'rganing va bilimlaringizni sinab ko'ring
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/register">Boshlash</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Kirish</Link>
            </Button>
          </div>
        </div>

        {/* Statistics Section */}
        <Statistics />

        {/* Prices Section */}
        <PricesSection />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection />
      </main>
    </div>
  )
}
