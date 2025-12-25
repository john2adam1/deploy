"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export function MainSection() {
  const [content, setContent] = useState<any>({
    title: "",
    highlight: "",
    description: "",
    primary_button: { text: "", link: "" },
    secondary_button: { text: "", link: "" }
  })

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = getSupabaseBrowserClient()
        const { data, error } = await supabase
          .from("site_content")
          .select("content")
          .eq("type", "main_section")
          .order("updated_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          // Only log meaningful errors (not empty objects or "not found" errors)
          if (error.code && error.message) {
            console.error("Error fetching main section:", error.message, error.code)
          }
          return
        }

        if (data?.content) {
          setContent(data.content)
        }
      } catch (err) {
        // Handle unexpected errors
        console.error("Unexpected error in MainSection:", err)
      }
    }
    fetchData()
  }, [])

  // title ichidagi highlight span bilan ajratib beriladi
  const title = content?.title || ""
  const highlight = content?.highlight || ""
  const parts = title && highlight ? title.split(highlight) : [title]

  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {parts[0]}
        {highlight && <span className="text-primary">{highlight}</span>}
        {parts[1]}
      </h1>

      <p className="mt-6 text-pretty text-lg text-muted-foreground sm:text-xl">
        {content?.description || ""}
      </p>

      <div className="mt-10 flex justify-center gap-4">
        {content?.primary_button?.text && (
          <Button asChild size="lg">
            <Link href="/register">
              {content.primary_button.text}
            </Link>
          </Button>
        )}

        {content?.secondary_button?.text && (
          <Button asChild variant="outline" size="lg">
            <Link href="/login">
              {content.secondary_button.text}
            </Link>
          </Button>
        )}
      </div>
    </div>
  )
}
