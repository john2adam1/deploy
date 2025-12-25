"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import type { Category } from "@/lib/types"

export function TestsManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [question, setQuestion] = useState("")
  const [answers, setAnswers] = useState(["", "", "", ""])
  const [correctAnswer, setCorrectAnswer] = useState("0")
  const [timeLimit, setTimeLimit] = useState("300")
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from("categories").select("*").order("title")

    if (data) setCategories(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedCategory || !imageUrl || !question) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (answers.some((a) => !a.trim())) {
      toast({
        title: "Error",
        description: "Please provide all 4 answers",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.from("tests").insert({
      category_id: selectedCategory,
      image_url: imageUrl,
      question,
      answers,
      correct_answer: Number.parseInt(correctAnswer),
      time_limit: Number.parseInt(timeLimit),
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create test",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Test created successfully",
      })

      // Reset form
      setImageUrl("")
      setQuestion("")
      setAnswers(["", "", "", ""])
      setCorrectAnswer("0")
      setTimeLimit("300")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Test</CardTitle>
        <CardDescription>Add a new test to a category</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              placeholder="Enter your question here..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Answers</Label>
            {answers.map((answer, index) => (
              <Input
                key={index}
                placeholder={`Answer ${index + 1}`}
                value={answer}
                onChange={(e) => {
                  const newAnswers = [...answers]
                  newAnswers[index] = e.target.value
                  setAnswers(newAnswers)
                }}
                required
              />
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="correct">Correct Answer</Label>
              <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Answer 1</SelectItem>
                  <SelectItem value="1">Answer 2</SelectItem>
                  <SelectItem value="2">Answer 3</SelectItem>
                  <SelectItem value="3">Answer 4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time Limit (seconds)</Label>
              <Input
                id="time"
                type="number"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value)}
                min="60"
                required
              />
            </div>
          </div>

          <Button type="submit" className="w-full">
            Create Test
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
