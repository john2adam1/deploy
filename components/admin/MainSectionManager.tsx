"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function MainSectionManager() {
  const [title, setTitle] = useState("")
  const [highlight, setHighlight] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient()

      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "main_section")
        .maybeSingle()

      if (data?.content) {
        setTitle(data.content.title || "")
        setHighlight(data.content.highlight || "")
        setDescription(data.content.description || "")
      }
    }

    fetchData()
  }, [])

  async function handleSave() {
    const supabase = getSupabaseBrowserClient()

    const content = {
      title,
      highlight,
      description
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("type", "main_section")
      .maybeSingle()

    let error
    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ content })
        .eq("type", "main_section")
      error = updateError
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("site_content")
        .insert({
          type: "main_section",
          content
        })
      error = insertError
    }

    if (!error) {
      alert("Main section updated")
    } else {
      alert(`Error: ${error.message || "Failed to update"}`)
      console.error("Error updating main section:", error)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold">Main Section</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <Input
        placeholder="Highlight text"
        value={highlight}
        onChange={e => setHighlight(e.target.value)}
      />

      <Input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
