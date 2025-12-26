"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function FaqManager() {
  const [faqs, setFaqs] = useState<any[]>([])
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")

  const fetchFaqs = async () => {
    const supabase = getSupabaseBrowserClient()
    const { data, error } = await supabase
      .from("site_content")
      .select("*")
      .eq("type", "faq")

    if (!error && data) {
      setFaqs(Array.isArray(data) ? data : [])
    }
  }

  const addFaq = async () => {
    if (!question.trim() || !answer.trim()) {
      alert("Please fill in both question and answer")
      return
    }

    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase
      .from("site_content")
      .insert({
        type: "faq",
        title: question,
        content: answer,
      })

    if (!error) {
      setQuestion("")
      setAnswer("")
      fetchFaqs()
    } else {
      alert(`Error adding FAQ: ${error.message}`)
    }
  }

  useEffect(() => {
    fetchFaqs()
  }, [])

  return (
    <div className="mt-10 space-y-4">
      <h2 className="text-xl font-semibold">FAQ Manager</h2>

      <Input
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <Textarea
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <Button onClick={addFaq}>Add FAQ</Button>

      <div className="space-y-2">
        {faqs.map((faq) => (
          <div key={faq.id} className="border p-3 rounded">
            <p className="font-medium">{faq.title}</p>
            <p className="text-sm text-muted-foreground">{faq.content}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
