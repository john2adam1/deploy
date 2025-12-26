"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AboutManager() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    async function fetchAbout() {
      const supabase = getSupabaseBrowserClient()

      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "about")
        .maybeSingle()

      if (data?.content) {
        setTitle(data.content.title || "")
        setDescription(data.content.description || "")
      }
    }

    fetchAbout()
  }, [])

  async function saveAbout() {
    const supabase = getSupabaseBrowserClient()

    const content = {
      title,
      description
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("type", "about")
      .maybeSingle()

    let error
    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ content })
        .eq("type", "about")
      error = updateError
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("site_content")
        .insert({
          type: "about",
          content
        })
      error = insertError
    }

    if (!error) {
      alert("About section updated")
    } else {
      alert(`Error: ${error.message || "Failed to update"}`)
      console.error("Error updating about section:", error)
    }
  }

  return (
    <div className="mt-10 max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">About Section</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <Textarea
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <Button onClick={saveAbout}>Save</Button>
    </div>
  )
}
