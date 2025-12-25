"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Trash2 } from "lucide-react"
import type { Category } from "@/lib/types"

export function CategoriesManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
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

  const handleCreate = async (e: React.FormEvent) => {
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
        description: "Category created successfully",
      })
      setNewCategory("")
      fetchCategories()
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Category deleted successfully",
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
          <CardTitle>Create Category</CardTitle>
          <CardDescription>Add a new test category</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Category Title</Label>
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
          <CardTitle>Existing Categories</CardTitle>
          <CardDescription>Manage your test categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center justify-between rounded-lg border p-3">
                <span className="font-medium">{category.title}</span>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            ))}
            {categories.length === 0 && <p className="text-center text-muted-foreground py-8">No categories yet</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
