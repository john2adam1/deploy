import { Clock, BookOpen, Trophy, Shield } from "lucide-react"

const stats = [
  {
    icon: Clock,
    title: "24/7 foydalanish imkoniyati!",
    description: "Har qanday vaqtda, har qanday joyda testlar bilan amalga oshiring"
  },
  {
    icon: BookOpen,
    title: "Turli xil test kategoriyalari",
    description: "O'z ma'lumotlaringizni o'ziga xos tezlikda o'rganishingiz mumkin"
  },
  {
    icon: Trophy,
    title: "Progressni ko'rish",
    description: "Sizning progresslaringizni ko'rishingiz mumkin"
  },
  {
    icon: Shield,
    title: "Maxfiy platforma",
    description: "Sizning ma'lumotlaringiz bizning maxfiy platformamizda saqlanadi"
  }
]

export async function Statistics() {
  return (
    <section className="mt-24 mb-24">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Sarvar Avtotest haqida</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => {
            const IconComponent = item.icon
            return (
              <div key={idx} className="rounded-lg border bg-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

