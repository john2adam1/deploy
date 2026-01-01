"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, ArrowUp, ArrowDown } from "lucide-react"
import Image from "next/image"

interface CarouselImage {
  id: string
  image_url: string
  order_index: number
  created_at: string
}

export function CarouselManagement() {
  const [images, setImages] = useState<CarouselImage[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchImages()
  }, [])

  const fetchImages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("carousel_images")
      .select("*")
      .order("order_index")
    if (data) setImages(data)
    setLoading(false)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Error",
          description: "Rasm faylini tanlang",
          variant: "destructive",
        })
        return
      }
      setImageFile(file)
    }
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    setUploading(true)
    try {
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `carousel-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `carousel/${fileName}`

      const { error: uploadError } = await supabase.storage.from("test-images").upload(filePath, imageFile, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("test-images").getPublicUrl(filePath)

      setUploading(false)
      return publicUrl
    } catch (error: any) {
      setUploading(false)
      toast({
        title: "Error",
        description: error.message || "Rasm faylini yuklashda xatolik yuz berdi",
        variant: "destructive",
      })
      return null
    }
  }

  const handleAdd = async () => {
    if (!imageFile) {
      toast({
        title: "Error",
        description: "Rasm faylini tanlang",
        variant: "destructive",
      })
      return
    }

    const imageUrl = await uploadImage()
    if (!imageUrl) return

    const maxOrder = images.length > 0 ? Math.max(...images.map((img) => img.order_index)) : -1

    const { error } = await supabase.from("carousel_images").insert({
      image_url: imageUrl,
      order_index: maxOrder + 1,
    })

    if (error) {
      toast({
        title: "Error",
        description: "Rasmni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Rasm muvaffaqiyatli qo'shildi",
      })
      setImageFile(null)
      fetchImages()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu rasmni o'chirishni xohlaysizmi?")) return

    const { error } = await supabase.from("carousel_images").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Rasmni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Rasm muvaffaqiyatli o'chirildi",
      })
      fetchImages()
    }
  }

  const handleReorder = async (id: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === id)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= images.length) return

    const current = images[currentIndex]
    const target = images[newIndex]

    await supabase
      .from("carousel_images")
      .update({ order_index: target.order_index })
      .eq("id", current.id)

    await supabase
      .from("carousel_images")
      .update({ order_index: current.order_index })
      .eq("id", target.id)

    fetchImages()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Karousel rasmlari qo'shish</CardTitle>
          <CardDescription>Bosh sahifadagi karousel uchun rasmlar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image">Rasm</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <Button onClick={handleAdd} disabled={uploading || !imageFile}>
            {uploading ? "Yuklanmoqda..." : "Rasm qo'shish"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Karousel rasmlari ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Yuklanmoqda...</div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hozircha rasmlar mavjud emas
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((image, index) => (
                <div key={image.id} className="relative group rounded-lg border overflow-hidden">
                  <div className="aspect-video relative">
                    <Image
                      src={image.image_url}
                      alt={`Carousel ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(image.id, "up")}
                      disabled={index === 0}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleReorder(image.id, "down")}
                      disabled={index === images.length - 1}
                    >
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="p-2 text-xs text-center text-muted-foreground">
                    Tartib: {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

