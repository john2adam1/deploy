import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function AboutSection() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "about")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  const content = data?.content || {
    title: "About Us",
    description:
      "TestMaster is an online testing platform designed to help users improve their knowledge.",
    missionTitle: "Our Mission",
    missionText:
      "To provide high-quality online tests that help users assess and improve their skills.",
    whyTitle: "Why Choose Us?",
    whyText:
      "We focus on simplicity, accuracy, and meaningful statistics to give users the best experience.",
  }

  return (
    <section className="mt-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">{content.title}</h2>
        <p className="mt-6 text-lg text-muted-foreground">
          {content.description}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">{content.missionTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {content.missionText}
          </p>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">{content.whyTitle}</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {content.whyText}
          </p>
        </div>
      </div>
    </section>
  )
}
