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
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32 max-w-7xl mx-auto pt-8 sm:pt-16">
          <div className="text-left space-y-8 relative z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Yangi avlod ta'lim platformasi
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
              O'rganing. <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">Tayyorlaning.</span> <br />
              <span className="text-foreground">Imtihondan o'ting!</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              Video darslar, aqlli testlar va real imtihon simulyatori.
              <span className="font-semibold text-foreground"> Barchasi bitta joyda.</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg h-14 px-8 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105">
                <Link href="/register">Boshlash</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto h-14 px-8 rounded-full border-2 hover:bg-muted/50 text-lg">
                <Link href="/about">Ko'proq ma'lumot</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-[600px] w-full hidden lg:block">
            {/* Abstract Background Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -z-10 animate-pulse" />

            {/* Card 1 - Main */}
            <div className="absolute top-10 right-10 w-[300px] h-[420px] rounded-2xl shadow-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md transform hover:-translate-y-2 transition-transform duration-500 z-20">
              <Image src="/images/certificate-1.jpg" alt="App Interface Preview" fill className="object-cover opacity-90 hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <p className="text-white font-medium">Real sertifikat namunalari</p>
              </div>
            </div>

            {/* Card 2 - Floating */}
            <div className="absolute top-40 left-10 w-[280px] h-[380px] rounded-2xl shadow-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur-md transform translate-y-4 hover:-translate-y-2 transition-transform duration-500 z-10">
              <Image src="/images/certificate-2.jpg" alt="App Interface Preview" fill className="object-cover opacity-90 hover:opacity-100 transition-opacity" />
            </div>

            {/* Decor Elements */}
            <div className="absolute top-20 left-0 p-4 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg border animate-bounce duration-[3000ms]">
              <span className="text-2xl">🚗</span>
            </div>
            <div className="absolute bottom-40 right-0 p-4 rounded-xl bg-background/80 backdrop-blur-xl shadow-lg border animate-bounce duration-[4000ms]">
              <span className="text-2xl">✅</span>
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
