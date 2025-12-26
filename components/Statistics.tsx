import { Clock, BookOpen, Trophy, Shield } from "lucide-react"
import { getSupabaseServerClient } from "@/lib/supabase/server"

const iconsMap: Record<string, any> = { Clock, BookOpen, Trophy, Shield }

type StatItem = {
  icon: string
  title: string
  description: string
}

export async function Statistics() {
  const supabase = await getSupabaseServerClient()
  
  const { data, error } = await supabase
    .from("site_content")
    .select("content")
    .eq("type", "statistics")
    .maybeSingle()

  if (error) {
    console.error("Error fetching statistics:", error)
  }

  const stats: StatItem[] = data?.content && Array.isArray(data.content) ? data.content : []

  if (stats.length === 0) {
    return null
  }

  return (
    <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((item, idx) => {
        const IconComponent = iconsMap[item.icon] || Clock
        return (
          <div key={idx} className="rounded-lg border bg-card p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </div>
        )
      })}
    </div>
  )
}

