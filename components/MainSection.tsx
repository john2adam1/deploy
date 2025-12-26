import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"

type MainContent = {
  title: string
  highlight: string
  description: string
}

export async function MainSection() {
  const supabase = await getSupabaseServerClient()

  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "main_section")
    .maybeSingle()

  if (error) {
    console.error("Error fetching main section:", error)
  }

  const content: MainContent = data?.content ?? {
    title: "",
    highlight: "",
    description: ""
  }

  const { title, highlight, description } = content
  const parts = highlight ? title.split(highlight) : [title]

  return (
    <div className="mx-auto max-w-4xl text-center">
      <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
        {parts[0]}
        {highlight && <span className="text-primary">{highlight}</span>}
        {parts[1]}
      </h1>

      <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
        {description}
      </p>

      <div className="mt-10 flex justify-center gap-4">
        <Button asChild size="lg">
          <Link href="/register">Start Free Trial</Link>
        </Button>

        <Button asChild variant="outline" size="lg">
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </div>
  )
}
