"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Plus, Trash2 } from "lucide-react"

type StatItem = {
  icon: string
  title: string
  description: string
}

export default function StatisticsManager() {
  const [stats, setStats] = useState<StatItem[]>([])

  useEffect(() => {
    async function fetchData() {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "statistics")
        .maybeSingle()

      if (!error && data?.content) {
        const content = Array.isArray(data.content) ? data.content : []
        setStats(content.length > 0 ? content : [{ icon: "Clock", title: "", description: "" }])
      } else {
        setStats([{ icon: "Clock", title: "", description: "" }])
      }
    }
    fetchData()
  }, [])

  function handleChange(idx: number, field: keyof StatItem, value: string) {
    const newStats = [...stats]
    newStats[idx] = { ...newStats[idx], [field]: value }
    setStats(newStats)
  }

  function addStat() {
    setStats([...stats, { icon: "Clock", title: "", description: "" }])
  }

  function removeStat(idx: number) {
    if (stats.length > 1) {
      setStats(stats.filter((_, i) => i !== idx))
    }
  }

  async function handleSave() {
    const supabase = getSupabaseBrowserClient()
    
    const validStats = stats.filter(s => s.title.trim() || s.description.trim())
    
    if (validStats.length === 0) {
      alert("Please add at least one statistic")
      return
    }

    // Check if record exists
    const { data: existing } = await supabase
      .from("site_content")
      .select("id")
      .eq("type", "statistics")
      .maybeSingle()

    let error
    if (existing) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("site_content")
        .update({ content: validStats })
        .eq("type", "statistics")
      error = updateError
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("site_content")
        .insert({ type: "statistics", content: validStats })
      error = insertError
    }

    if (!error) {
      alert("Statistics updated!")
      const { data } = await supabase
        .from("site_content")
        .select("content")
        .eq("type", "statistics")
        .maybeSingle()
      if (data?.content) {
        const content = Array.isArray(data.content) ? data.content : []
        setStats(content.length > 0 ? content : [{ icon: "Clock", title: "", description: "" }])
      }
    } else {
      alert(`Error updating statistics: ${error.message || "Failed to update"}`)
      console.error("Error updating statistics:", error)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistics Settings</h2>
        <Button onClick={addStat} size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Stat
        </Button>
      </div>

      <div className="space-y-4">
        {stats.map((item, idx) => (
          <div key={idx} className="border p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Statistic {idx + 1}</span>
              {stats.length > 1 && (
                <Button
                  onClick={() => removeStat(idx)}
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <Input
              placeholder="Icon (Clock, BookOpen, Trophy, Shield)"
              value={item.icon}
              onChange={e => handleChange(idx, "icon", e.target.value)}
            />
            <Input
              placeholder="Title"
              value={item.title}
              onChange={e => handleChange(idx, "title", e.target.value)}
            />
            <Input
              placeholder="Description"
              value={item.description}
              onChange={e => handleChange(idx, "description", e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} className="w-full">Save Statistics</Button>
    </div>
  )
}

