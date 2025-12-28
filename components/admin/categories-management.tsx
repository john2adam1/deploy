"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, X, Check } from "lucide-react"
import type { Category } from "@/lib/types"

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("title")

    if (data) setCategories(data)
    setLoading(false)
  }

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault()

    if (!newCategory.trim()) return

    const { error } = await supabase.from("categories").insert({ title: newCategory.trim() })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Kategoriya muvaffaqiyatli yaratildi",
      })
      setNewCategory("")
      fetchCategories()
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingTitle(category.title)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingTitle.trim()) {
      toast({
        title: "Error",
        description: "Kategoriya nomi bo'sh bo'lmasligi kerak",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase
      .from("categories")
      .update({ title: editingTitle.trim() })
      .eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Kategoriya yangilashda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Kategoriya muvaffaqiyatli yangilandi",
      })
      setEditingId(null)
      setEditingTitle("")
      fetchCategories()
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingTitle("")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyani o'chirishni xohlaysizmi? Bu kategoriyadagi barcha testlar ham o'chib ketadi.")) {
      return
    }

    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Kategoriya o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Kategoriya muvaffaqiyatli o'chirildi",
      })
      fetchCategories()
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Kategoriya yaratish</CardTitle>
          <CardDescription>Yangi test kategoriyasini qo'shish</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Kategoriya nomi</Label>
              <Input
                id="title"
                placeholder="e.g., Mathematics"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Create Category
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mavjud Kategoriyalar</CardTitle>
          <CardDescription>Test kategoriyalarini boshqarish</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center gap-2 rounded-lg border p-3">
                {editingId === category.id ? (
                  <>
                    <Input
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      className="flex-1"
                      autoFocus
                    />
                    <Button variant="ghost" size="icon" onClick={() => handleSaveEdit(category.id)}>
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                      <X className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                ) : (
                  <>
                    <span className="flex-1 font-medium">{category.title}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              </div>
            ))}
            {categories.length === 0 && <p className="text-center text-muted-foreground py-8">Hozircha kategoriya mavjud emas</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
