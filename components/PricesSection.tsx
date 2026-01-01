import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Crown } from "lucide-react"
import Link from "next/link"

export async function PricesSection() {
  const supabase = await getSupabaseServerClient()

  const { data } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "prices")
    .maybeSingle()

  const prices = data?.content ?? {
    original_price: "300000",
    discounted_price: "200000",
    discount_percent: "33",
  }

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat("uz-UZ").format(Number.parseInt(price || "0"))
  }

  return (
    <section className="my-32">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8 relative">
            NARXLAR
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-teal-500"></div>
          </h2>

          <div className="relative mb-6">
            <div className="absolute left-1/2 -translate-x-1/2 -top-8">
              <div className="bg-red-600 text-white rounded-lg px-6 py-3 text-center shadow-lg">
                <div className="text-3xl font-bold">{prices.discount_percent}%</div>
                <div className="text-sm">CHEGIRMA</div>
              </div>
            </div>
          </div>

          <p className="text-lg mb-4">{prices.discount_percent}% chegirma</p>

          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Premium obunaga bugun ulgur!
          </h3>

          <p className="text-muted-foreground mb-6">
            To'liq test rejimlaridan foydalanish, test statistikasi va boshqa qulayliklarga ega bo'ling.
          </p>

          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="text-gray-400 line-through text-lg">
              {formatPrice(prices.original_price)} so'm
            </span>
            <span className="text-2xl font-bold text-red-600">
              {formatPrice(prices.discounted_price)} so'm
            </span>
          </div>

          <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg">
            <Link href="/register">
              <Crown className="mr-2 h-5 w-5" />
              Premium obunani faollashtiring
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

