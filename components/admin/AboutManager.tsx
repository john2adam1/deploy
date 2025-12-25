"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AboutManager() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    missionTitle: "",
    missionText: "",
    whyTitle: "",
    whyText: "",
  })

  const fetchAbout = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "about")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) {
        if (error.code && error.message) {
          console.error("Error fetching about:", error.message, error.code)
        }
        return
      }

      if (data?.content) {
        setForm(data.content)
      }
    } catch (err) {
      console.error("Unexpected error fetching about:", err)
    }
  }

  const saveAbout = async () => {
    try {
      const supabase = getSupabaseBrowserClient()
      
      // Delete all existing records with this type to avoid duplicates
      await supabase
        .from("site_content")
        .delete()
        .eq("type", "about")

      // Insert new record
      const { error } = await supabase
        .from("site_content")
        .insert({ type: "about", content: form })

      if (!error) {
        alert("About Us updated!")
        fetchAbout() // Refresh data
      } else {
        alert(`Error updating about: ${error.message}`)
        console.error(error)
      }
    } catch (err) {
      alert("Unexpected error updating about")
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAbout()
  }, [])

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">About Us</h2>

      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <Textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <Input
        placeholder="Mission title"
        value={form.missionTitle}
        onChange={(e) => setForm({ ...form, missionTitle: e.target.value })}
      />

      <Textarea
        placeholder="Mission text"
        value={form.missionText}
        onChange={(e) => setForm({ ...form, missionText: e.target.value })}
      />

      <Input
        placeholder="Why choose us title"
        value={form.whyTitle}
        onChange={(e) => setForm({ ...form, whyTitle: e.target.value })}
      />

      <Textarea
        placeholder="Why choose us text"
        value={form.whyText}
        onChange={(e) => setForm({ ...form, whyText: e.target.value })}
      />

      <Button onClick={saveAbout}>Save</Button>
    </div>
  )
}
