"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function MainSectionManager() {
  const [title, setTitle] = useState("")
  const [highlight, setHighlight] = useState("")
  const [description, setDescription] = useState("")
  const [primaryText, setPrimaryText] = useState("")
  const [secondaryText, setSecondaryText] = useState("")

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "main_section")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (!error && data?.content) {
        const c = data.content
        setTitle(c.title || "")
        setHighlight(c.highlight || "")
        setDescription(c.description || "")
        setPrimaryText(c.primary_button?.text || "")
        setSecondaryText(c.secondary_button?.text || "")
      }
    }
    fetchData()
  }, [])

  async function handleSave() {
    const supabase = getSupabaseBrowserClient()
    const newContent = {
      title,
      highlight,
      description,
      primary_button: { text: primaryText, link: "/register" },
      secondary_button: { text: secondaryText, link: "/login" }
    }

    // Delete all existing records with this type to avoid duplicates
    await supabase
      .from("site_content")
      .delete()
      .eq("type", "main_section")

    // Insert new record
    const { error } = await supabase
      .from("site_content")
      .insert({ type: "main_section", content: newContent })

    if (!error) {
      alert("Main section updated!")
      // Refresh the data
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "main_section")
        .order("updated_at", { ascending: false })
        .limit(1)
        .maybeSingle()
      if (data?.content) {
        const c = data.content
        setTitle(c.title || "")
        setHighlight(c.highlight || "")
        setDescription(c.description || "")
        setPrimaryText(c.primary_button?.text || "")
        setSecondaryText(c.secondary_button?.text || "")
      }
    } else {
      alert(`Error updating main section: ${error.message}`)
      console.error("Full error:", error)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold">Main Section Settings</h2>

      <Input
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
      />

      <Input
        placeholder="Highlight (span text)"
        value={highlight}
        onChange={e => setHighlight(e.target.value)}
      />

      <Input
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <Input
        placeholder="Primary button text (Sign Up)"
        value={primaryText}
        onChange={e => setPrimaryText(e.target.value)}
      />

      <Input
        placeholder="Secondary button text (Sign In)"
        value={secondaryText}
        onChange={e => setSecondaryText(e.target.value)}
      />

      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
