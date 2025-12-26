"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function ContactManager() {
  const [telegram, setTelegram] = useState("")
  const [telegramLink, setTelegramLink] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "contact")
        .maybeSingle()

      if (!error && data?.content) {
        setTelegram(data.content.telegram || "")
        setTelegramLink(data.content.telegram_link || "")
        setEmail(data.content.email || "")
      }
    }
    fetchData()
  }, [])

  async function handleSave() {
    const supabase = getSupabaseBrowserClient()
    const newContent = {
      telegram,
      telegram_link: telegramLink,
      email
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("type", "contact")
      .maybeSingle()

    let error
    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ content: newContent })
        .eq("type", "contact")
      error = updateError
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("site_content")
        .insert({ type: "contact", content: newContent })
      error = insertError
    }

    if (!error) {
      alert("Contact info updated!")
    } else {
      alert(`Error updating contact info: ${error.message || "Failed to update"}`)
      console.error("Error updating contact info:", error)
    }
  }

  return (
    <div className="space-y-4 max-w-md mx-auto p-4">
      <h2 className="text-2xl font-bold">Contact Settings</h2>

      <Input
        placeholder="Telegram username"
        value={telegram}
        onChange={e => setTelegram(e.target.value)}
      />

      <Input
        placeholder="Telegram link"
        value={telegramLink}
        onChange={e => setTelegramLink(e.target.value)}
      />

      <Input
        placeholder="Support email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />

      <Button onClick={handleSave}>Save</Button>
    </div>
  )
}
