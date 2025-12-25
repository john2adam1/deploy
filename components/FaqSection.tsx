import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function FaqSection() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("site_content")
    .select("*")
    .eq("type", "faq")

  const faqs = Array.isArray(data) ? data : []

  return (
    <section className="mt-24">
      <h2 className="text-3xl font-bold mb-6 text-center">FAQ</h2>

      <div className="space-y-4 max-w-3xl mx-auto">
        {faqs.map((faq) => (
          <details key={faq.id} className="border rounded p-4">
            <summary className="cursor-pointer font-medium">
              {faq.title}
            </summary>
            <p className="mt-2 text-muted-foreground">
              {faq.content}
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
