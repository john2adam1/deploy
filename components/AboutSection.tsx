import Image from "next/image"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function AboutSection() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "about")
    .maybeSingle()

  const content = data?.content ?? {
    title: "About Us",
    description:
      "TestMaster is an online testing platform designed to help users improve their knowledge."
  }

  return (
    <section className="mt-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        
        {/* TEXT */}
        <div>
          <h2 className="text-3xl font-bold sm:text-4xl">
            {content.title}
          </h2>
          <p className="mt-6 text-lg text-muted-foreground">
            {content.description}
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
