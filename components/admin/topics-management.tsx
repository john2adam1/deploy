"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Category, Topic } from "@/lib/types"

export function TopicsManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [title, setTitle] = useState("")
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchCategories()
    fetchTopics()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("title")
    if (data) setCategories(data)
  }

  const fetchTopics = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("topics")
      .select(`
        *,
        categories (
          id,
          title
        )
      `)
      .order("created_at", { ascending: false })

    if (data) {
      setTopics(data as any)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setSelectedCategory("")
    setTitle("")
    setEditingTopic(null)
    setIsPublic(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !title.trim()) {
      toast({
        title: "Error",
        description: "Barcha maydonlarni to'ldiring",
        variant: "destructive",
      })
      return
    }

    if (editingTopic) {
      const { error } = await supabase
        .from("topics")
        .update({
          category_id: selectedCategory,
          title: title.trim(),
          is_public: isPublic,
        })
        .eq("id", editingTopic.id)

      if (error) {
        toast({
          title: "Error",
          description: "Mavzuni yangilashda xatolik yuz berdi",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Mavzu muvaffaqiyatli yangilandi",
        })
        resetForm()
        fetchTopics()
      }
    } else {
      const { error } = await supabase.from("topics").insert({
        category_id: selectedCategory,
        title: title.trim(),
        is_public: isPublic,
      })

      if (error) {
        toast({
          title: "Error",
          description: "Mavzuni yaratishda xatolik yuz berdi",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Mavzu muvaffaqiyatli yaratildi",
        })
        resetForm()
        fetchTopics()
      }
    }
  }

  const handleEdit = (topic: Topic) => {
    setEditingTopic(topic)
    setSelectedCategory(topic.category_id)
    setTitle(topic.title)
    setIsPublic((topic as any).is_public ?? true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mavzuni o'chirishni xohlaysizmi?")) {
      return
    }

    const { error } = await supabase.from("topics").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Mavzuni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Mavzu muvaffaqiyatli o'chirildi",
      })
      fetchTopics()
    }
  }

  const topicsByCategory = topics.reduce((acc, topic: any) => {
    const categoryTitle = topic.categories?.title || "Unknown"
    if (!acc[categoryTitle]) {
      acc[categoryTitle] = []
    }
    acc[categoryTitle].push(topic)
    return acc
  }, {} as Record<string, any[]>)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTopic ? "Mavzuni tahrirlash" : "Mavzu yaratish"}</CardTitle>
          <CardDescription>
            {editingTopic ? "Mavzu haqida ma'lumotlarni yangilash" : "Yangi mavzuni kategoriyaga qo'shish"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategoriya</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategoriyani tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Mavzu nomi</Label>
              <Input
                id="title"
                placeholder="Mavzu nomini kiriting..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={isPublic}
                onCheckedChange={(v) => setIsPublic(Boolean(v))}
              />
              <Label htmlFor="is-public">Ommaviy (bepul)</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingTopic ? "Mavzuni tahrirlash" : "Mavzu yaratish"}
              </Button>
              {editingTopic && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Bekor qilish
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mavzular ro'yxati</CardTitle>
          <CardDescription>Barcha mavzular kategoriyalar bo'yicha</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Mavzular yuklanmoqda...</div>
          ) : Object.keys(topicsByCategory).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hozircha mavzular mavjud emas. Birinchi mavzuni yarating!
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(topicsByCategory).map(([categoryTitle, categoryTopics]) => (
                <div key={categoryTitle}>
                  <h3 className="font-semibold mb-3">{categoryTitle}</h3>
                  <div className="space-y-2">
                    {categoryTopics.map((topic: any) => (
                      <div key={topic.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{topic.title}</span>
                          <Badge variant={(topic as any).is_public ? "outline" : "destructive"}>
                            {(topic as any).is_public ? "Public" : "Premium"}
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(topic)}>
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(topic.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))}
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

