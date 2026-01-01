"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import type { Topic } from "@/lib/types"

export function TopicsManagement() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [title, setTitle] = useState("")
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null)
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchTopics()
  }, [])

  const fetchTopics = async () => {
    setLoading(true)
    const { data } = await supabase
      .from("topics")
      .select("*")
      .order("created_at", { ascending: false })

    if (data) {
      setTopics(data)
    }
    setLoading(false)
  }

  const resetForm = () => {
    setTitle("")
    setEditingTopic(null)
    setIsPublic(true)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Mavzu nomini kiriting",
        variant: "destructive",
      })
      return
    }

    if (editingTopic) {
      const { error } = await supabase
        .from("topics")
        .update({
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
    setTitle(topic.title)
    setIsPublic(topic.is_public ?? true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu mavzuni o'chirishni xohlaysizmi? Bu mavzudagi barcha testlar ham o'chib ketadi.")) {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTopic ? "Mavzuni tahrirlash" : "Mavzu yaratish"}</CardTitle>
          <CardDescription>
            {editingTopic ? "Mavzu haqida ma'lumotlarni yangilash" : "Yangi mavzu yaratish"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
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
          <CardDescription>Barcha mavzular</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Mavzular yuklanmoqda...</div>
          ) : topics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Hozircha mavzular mavjud emas. Birinchi mavzuni yarating!
            </div>
          ) : (
            <div className="space-y-2">
              {topics.map((topic) => (
                <div key={topic.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{topic.title}</span>
                    <Badge variant={topic.is_public ? "outline" : "destructive"}>
                      {topic.is_public ? "Public" : "Premium"}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
