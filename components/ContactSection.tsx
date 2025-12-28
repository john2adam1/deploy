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
    console.error("Bog'lanish ma'lumotlarini yuklashda xatolik yuz berdi:", error)
  }

  const contact = data?.content ?? {
    telegram: "",
    telegram_link: "",
    email: ""
  }

  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto max-w-4xl text-center px-4">
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">Biz bilan bog'laning</h2>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          Savollaringiz yoki abonemani sotib olishni xohlaysizmi? Biz bilan bog'laning.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          {contact.telegram && (
            <p className="text-sm text-muted-foreground">
              Telegram: <span className="font-medium">{contact.telegram}</span>
            </p>
          )}

          {contact.telegram_link && (
            <Button asChild size="lg">
              <a
                href={contact.telegram_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram orqali bog'lanish
              </a>
            </Button>
          )}

          {contact.email && (
            <p className="text-sm text-muted-foreground mt-2">
              Email: <span className="font-medium">{contact.email}</span>
            </p>
          )}

          {!contact.telegram && !contact.telegram_link && !contact.email && (
            <p className="text-sm text-muted-foreground">
              Bog'lanish ma'lumotlari hozirda mavjud emas.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

