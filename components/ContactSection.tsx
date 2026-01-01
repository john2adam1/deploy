import { Button } from "@/components/ui/button"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Phone, MapPin, Send } from "lucide-react"

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
    phone: "",
    telegram: "",
    telegram_link: "",
    address: ""
  }

  return (
    <section className="mt-32 mb-32">
      <div className="mx-auto max-w-4xl text-center px-4">
        <h2 className="text-3xl font-bold sm:text-4xl mb-4">Biz bilan bog'laning</h2>
        <p className="mt-4 text-lg text-muted-foreground mb-8">
          Savollaringiz yoki abonemani sotib olishni xohlaysizmi? Biz bilan bog'laning.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {contact.phone && (
            <div className="flex flex-col items-center gap-2">
              <Phone className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Telefon</p>
              <a href={`tel:${contact.phone}`} className="text-sm text-muted-foreground hover:text-primary">
                {contact.phone}
              </a>
            </div>
          )}

          {contact.telegram_link && (
            <div className="flex flex-col items-center gap-2">
              <Send className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Telegram</p>
              <Button asChild variant="link" size="sm">
                <a
                  href={contact.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contact.telegram || "Telegram"}
                </a>
              </Button>
            </div>
          )}

          {contact.address && (
            <div className="flex flex-col items-center gap-2">
              <MapPin className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium">Manzil</p>
              <p className="text-sm text-muted-foreground text-center">
                {contact.address}
              </p>
            </div>
          )}

          {!contact.phone && !contact.telegram_link && !contact.address && (
            <div className="col-span-3">
              <p className="text-sm text-muted-foreground">
                Bog'lanish ma'lumotlari hozirda mavjud emas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
