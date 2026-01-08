import Image from "next/image"

export async function AboutSection() {
  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* TEXT */}
          <div>
            <span className="inline-block mb-4 rounded-full bg-primary/10 px-4 py-1 text-sm font-medium text-primary">
              Biz haqimizda
            </span>

            <h2 className="text-4xl font-extrabold tracking-tight mb-6">
              Sarvar Avtotest platformasi
            </h2>

            <p className="text-lg text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">Sarvar Avtotest</span> — bu
              foydalanuvchilarning bilimlarini oshirishga yordam beradigan zamonaviy
              onlayn test platformasi. Platformamiz orqali bilimlarni mustahkamlash,
              imtihonlarga puxta tayyorgarlik ko‘rish mumkin.
            </p>

            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              Intuitiv interfeys, keng test kutubxonasi va real vaqtli
              <span className="text-foreground font-medium"> progress kuzatuvi </span>
              orqali siz o‘z natijalaringizni aniq ko‘rib borasiz.
            </p>
          </div>

          {/* IMAGE */}
          <div className="relative group">
            {/* glow */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-primary/30 via-transparent to-purple-500/30 opacity-0 blur-2xl transition group-hover:opacity-100" />

            <div className="
              relative overflow-hidden rounded-2xl border 
              bg-background/60 backdrop-blur-xl
              transition-transform duration-300
              group-hover:scale-[1.02]
            ">
              <Image
                src="/about.png"
                alt="Sarvar Avtotest platformasi"
                width={600}
                height={400}
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
