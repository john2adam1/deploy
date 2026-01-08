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
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Biz bilan bog'laning</h2>
            <p className="text-lg text-muted-foreground">
              Savollaringiz bormi? Biz sizga yordam berishdan mamnunmiz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {contact.phone && (
              <div className="group bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-background/80 transition-all hover:-translate-y-1 shadow-lg">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Telefon</h3>
                <a href={`tel:${contact.phone}`} className="text-primary hover:underline text-lg">
                  {contact.phone}
                </a>
              </div>
            )}

            {contact.telegram_link && (
              <div className="group bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-background/80 transition-all hover:-translate-y-1 shadow-lg">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Send className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Telegram</h3>
                <Button asChild variant="link" className="text-lg p-0 h-auto">
                  <a href={contact.telegram_link} target="_blank" rel="noopener noreferrer">
                    {contact.telegram || "Telegram orqali yozish"}
                  </a>
                </Button>
              </div>
            )}

            {contact.address && (
              <div className="group bg-background/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-background/80 transition-all hover:-translate-y-1 shadow-lg">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Manzil</h3>
                <p className="text-muted-foreground">
                  {contact.address}
                </p>
              </div>
            )}
          </div>

          {!contact.phone && !contact.telegram_link && !contact.address && (
            <div className="text-center p-12 bg-muted/30 rounded-2xl border border-dashed">
              <p className="text-muted-foreground">
                Bog'lanish ma'lumotlari hozirda mavjud emas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
