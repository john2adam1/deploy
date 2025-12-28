import Image from "next/image"

export async function AboutSection() {
  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 px-4">
        {/* TEXT */}
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl mb-6">Sarvar Avtotest haqida</h2>
          <p className="mt-6 text-lg text-muted-foreground">
            Sarvar Avtotest - bu onlayn test platformasi, foydalanuvchilarning bilimlarini oshirishga yordam beradigan amaliy testlar orqali.
            Platformamiz turli xil test kategoriyalarini taqdim etadi, shuningdek, sizning imtihonlaringizni o'zlashtirish, tushunishni oshirish va progressni ko'rish imkonini beradi.
          </p>
          <p className="mt-4 text-lg text-muted-foreground">
            Bizning intuitiv interfeysimiz va to'liq test kutubxonalarimiz bilan, siz o'z ma'lumotlaringizni o'ziga xos tezlikda o'rganishingiz va haqiqiy natijalarni ko'rishingiz mumkin, shuningdek, o'zgartirishlarni aniqlash imkonini beradi.
          </p>
        </div>

        {/* IMAGE */}
        <div className="relative h-72 w-full">
          <Image
            src="/about.png"
            alt="About us"
            fill
            className="rounded-lg object-cover"
          />
        </div>
      </div>
    </section>
  )
}

