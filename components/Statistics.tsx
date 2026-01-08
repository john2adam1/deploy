import { Clock, BookOpen, Trophy, Shield } from "lucide-react"

const stats = [
  {
    icon: Clock,
    title: "24/7 foydalanish imkoniyati",
    description: "Har qanday vaqtda, har qanday joyda test ishlashingiz mumkin"
  },
  {
    icon: BookOpen,
    title: "Turli xil test kategoriyalari",
    description: "O'zingizga qulay tezlikda bilimlarni mustahkamlang"
  },
  {
    icon: Trophy,
    title: "Progressni kuzatish",
    description: "Natijalaringiz va rivojlanishingizni real vaqtda ko‘ring"
  },
  {
    icon: Shield,
    title: "Maxfiy va ishonchli",
    description: "Ma’lumotlaringiz to‘liq himoyalangan holda saqlanadi"
  }
]

export async function Statistics() {
  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="text-center text-4xl font-extrabold tracking-tight mb-14">
          Sarvar Avtotest afzalliklari
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((item, idx) => {
            const Icon = item.icon

            return (
              <div
                key={idx}
                className="
                  group relative overflow-hidden rounded-2xl border 
                  bg-background/60 backdrop-blur-xl
                  p-8 text-center
                  transition-all duration-300
                  hover:-translate-y-2 hover:shadow-2xl
                "
              >
                {/* gradient border effect */}
                <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-transparent to-purple-500/30" />
                </div>

                {/* icon */}
                <div className="
                  mx-auto mb-5 flex h-14 w-14 items-center justify-center 
                  rounded-full bg-primary/10
                  transition-all duration-300
                  group-hover:scale-110 group-hover:rotate-6
                ">
                  <Icon className="h-7 w-7 text-primary" />
                </div>

                <h3 className="text-lg font-semibold mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
