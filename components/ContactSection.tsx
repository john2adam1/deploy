import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function ContactSection() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "contact")
    .maybeSingle()

  if (error) {
    console.error("Error fetching contact info:", error)
  }

  const contact = data?.content ?? {
    telegram: "",
    telegram_link: "",
    email: ""
  }

  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold sm:text-4xl">Contact Us</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Have questions or want to purchase a subscription? Get in touch with us.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Telegram: <span className="font-medium">{contact.telegram}</span>
          </p>

          <Button asChild size="lg">
            <a
              href={contact.telegram_link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Contact via Telegram
            </a>
          </Button>

          <p className="text-sm text-muted-foreground mt-2">
            Email: <span className="font-medium">{contact.email}</span>
          </p>
        </div>
      </div>
    </section>
  )
}
