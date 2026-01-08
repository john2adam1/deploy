import Link from "next/link"
import Image from "next/image"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"
import { AboutSection } from "@/components/AboutSection"
import { Statistics } from "@/components/Statistics"
import { ContactSection } from "@/components/ContactSection"
import { Carousel } from "@/components/Carousel"
import { PricesSection } from "@/components/PricesSection"
import { LanguageSwitcher } from "@/components/language-switcher"

export default async function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-semibold">Sardor Avtotest</span>
          </div>
          <div className="flex gap-2 items-center">
            <LanguageSwitcher />
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
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24 max-w-7xl mx-auto">
          <div className="text-left space-y-6">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              O'rganing. Tayyorlaning. <br />
              <span className="text-primary">Imtihondan muvaffaqiyatli o'ting!</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Video darslar, testlar va real imtihon tajriba – barchasi bir joyda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-lg h-12">
                <Link href="/register">Premium obunani faollashtiring</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[500px] w-full">
            {/* Card 1 */}
            <div className="absolute top-0 right-20 w-[260px] h-[360px] rounded-xl shadow-xl overflow-hidden">
              <Image src="/images/certificate-1.png" alt="App Interface Preview" fill className="object-cover" />
            </div>

            {/* Card 2 */}
            <div className="absolute top-40 right-0 w-[260px] h-[360px] rounded-xl shadow-xl overflow-hidden">
              <Image src="/images/certificate-2.png" alt="App Interface Preview" fill className="object-cover" />
            </div>
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

        {/* Carousel */}
        <Suspense fallback={null}>
          <Carousel />
        </Suspense>
      </main>
    </div>
  )
}
