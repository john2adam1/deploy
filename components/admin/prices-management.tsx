"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

export function PricesManagement() {
  const [originalPrice, setOriginalPrice] = useState("")
  const [discountedPrice, setDiscountedPrice] = useState("")
  const [discountPercent, setDiscountPercent] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchPrices()
  }, [])

  const fetchPrices = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("site_content")
      .select("content")
      .eq("type", "prices")
      .maybeSingle()

    if (data?.content) {
      setOriginalPrice(data.content.original_price || "")
      setDiscountedPrice(data.content.discounted_price || "")
      setDiscountPercent(data.content.discount_percent || "")
    }
    setLoading(false)
  }

  const handleSave = async () => {
    const content = {
      original_price: originalPrice,
      discounted_price: discountedPrice,
      discount_percent: discountPercent,
    }

    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("type", "prices")
      .maybeSingle()

    let error
    if (existing) {
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ content })
        .eq("type", "prices")
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from("site_content")
        .insert({ type: "prices", content })
      error = insertError
    }

    if (error) {
      toast({
        title: "Error",
        description: error.message || "Narxlarni yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Narxlar muvaffaqiyatli yangilandi",
      })
    }
  }

  if (loading) {
    return <div className="text-center py-8">Yuklanmoqda...</div>
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Narxlar boshqaruvi</CardTitle>
        <CardDescription>Bosh sahifadagi narxlar bo'limini boshqarish</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="discount-percent">Chegirma foizi (%)</Label>
          <Input
            id="discount-percent"
            placeholder="33"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="original-price">Asl narx (so'm)</Label>
          <Input
            id="original-price"
            placeholder="300000"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="discounted-price">Chegirmali narx (so'm)</Label>
          <Input
            id="discounted-price"
            placeholder="200000"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(e.target.value)}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Narxlarni saqlash
        </Button>
      </CardContent>
    </Card>
  )
}

