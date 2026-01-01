"use client"

import { useEffect, useState } from "react"
import type { FormEvent } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit2, Plus, X } from "lucide-react"
import type { Ticket, Test } from "@/lib/types"

interface TicketWithTests extends Ticket {
  test_count?: number
}

export function TicketsManagement() {
  const [tickets, setTickets] = useState<TicketWithTests[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Ticket tests management
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null)
  const [availableTests, setAvailableTests] = useState<Test[]>([])
  const [ticketTests, setTicketTests] = useState<any[]>([])
  const [selectedTest, setSelectedTest] = useState("")

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    if (selectedTicket) {
      fetchTicketTests()
      fetchAvailableTests()
    }
  }, [selectedTicket])

  const fetchTickets = async () => {
    setLoading(true)
    const { data } = await supabase.from("tickets").select("*").order("created_at", { ascending: false })

    if (data) {
      // Get test counts for each ticket
      const ticketsWithCounts = await Promise.all(
        data.map(async (ticket) => {
          const { count } = await supabase
            .from("ticket_tests")
            .select("*", { count: "exact", head: true })
            .eq("ticket_id", ticket.id)
          return { ...ticket, test_count: count || 0 }
        })
      )
      setTickets(ticketsWithCounts)
    }
    setLoading(false)
  }

  const fetchTicketTests = async () => {
    if (!selectedTicket) return

    const { data } = await supabase
      .from("ticket_tests")
      .select(`
        *,
        tests (*)
      `)
      .eq("ticket_id", selectedTicket)
      .order("order_index")

    if (data) {
      setTicketTests(data)
    }
  }

  const fetchAvailableTests = async () => {
    const { data } = await supabase.from("tests").select("*").order("question")
    if (data) {
      setAvailableTests(data)
    }
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setIsPublic(false)
    setEditingTicket(null)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Bilet nomini kiriting",
        variant: "destructive",
      })
      return
    }

    if (editingTicket) {
      const { error } = await supabase
        .from("tickets")
        .update({
          title: title.trim(),
          description: description.trim() || null,
          is_public: isPublic,
        })
        .eq("id", editingTicket.id)

      if (error) {
        toast({
          title: "Error",
          description: "Biletni yangilashda xatolik yuz berdi",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Bilet muvaffaqiyatli yangilandi",
        })
        resetForm()
        fetchTickets()
      }
    } else {
      const { error } = await supabase.from("tickets").insert({
        title: title.trim(),
        description: description.trim() || null,
        is_public: isPublic,
      })

      if (error) {
        toast({
          title: "Error",
          description: "Biletni yaratishda xatolik yuz berdi",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Bilet muvaffaqiyatli yaratildi",
        })
        resetForm()
        fetchTickets()
      }
    }
  }

  const handleEdit = (ticket: Ticket) => {
    setEditingTicket(ticket)
    setTitle(ticket.title)
    setDescription(ticket.description || "")
    setIsPublic(ticket.is_public)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu biletni o'chirishni xohlaysizmi?")) {
      return
    }

    const { error } = await supabase.from("tickets").delete().eq("id", id)

    if (error) {
      toast({
        title: "Error",
        description: "Biletni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Bilet muvaffaqiyatli o'chirildi",
      })
      if (selectedTicket === id) {
        setSelectedTicket(null)
      }
      fetchTickets()
    }
  }

  const handleAddTest = async () => {
    if (!selectedTicket || !selectedTest) {
      toast({
        title: "Error",
        description: "Testni tanlang",
        variant: "destructive",
      })
      return
    }

    // Check if ticket already has 20 tests
    if (ticketTests.length >= 20) {
      toast({
        title: "Error",
        description: "Biletda maksimal 20 ta test bo'lishi mumkin",
        variant: "destructive",
      })
      return
    }

    // Check if test is already in ticket
    const exists = ticketTests.some((tt: any) => tt.test_id === selectedTest)
    if (exists) {
      toast({
        title: "Error",
        description: "Bu test allaqachon biletda mavjud",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.from("ticket_tests").insert({
      ticket_id: selectedTicket,
      test_id: selectedTest,
      order_index: ticketTests.length,
    })

    if (error) {
      toast({
        title: "Error",
        description: "Testni qo'shishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Test muvaffaqiyatli qo'shildi",
      })
      setSelectedTest("")
      fetchTicketTests()
    }
  }

  const handleRemoveTest = async (ticketTestId: string) => {
    const { error } = await supabase.from("ticket_tests").delete().eq("id", ticketTestId)

    if (error) {
      toast({
        title: "Error",
        description: "Testni o'chirishda xatolik yuz berdi",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Test muvaffaqiyatli o'chirildi",
      })
      fetchTicketTests()
    }
  }

  const handleReorder = async (ticketTestId: string, direction: "up" | "down") => {
    const currentIndex = ticketTests.findIndex((tt: any) => tt.id === ticketTestId)
    if (currentIndex === -1) return

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1
    if (newIndex < 0 || newIndex >= ticketTests.length) return

    const current = ticketTests[currentIndex]
    const target = ticketTests[newIndex]

    // Swap order_index
    await supabase
      .from("ticket_tests")
      .update({ order_index: target.order_index })
      .eq("id", current.id)

    await supabase
      .from("ticket_tests")
      .update({ order_index: current.order_index })
      .eq("id", target.id)

    fetchTicketTests()
  }

  const selectedTicketData = tickets.find((t) => t.id === selectedTicket)
  const usedTestIds = ticketTests.map((tt: any) => tt.test_id)
  const availableTestsForTicket = availableTests.filter((test) => !usedTestIds.includes(test.id))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{editingTicket ? "Biletni tahrirlash" : "Bilet yaratish"}</CardTitle>
          <CardDescription>
            {editingTicket ? "Bilet haqida ma'lumotlarni yangilash" : "Yangi bilet yaratish (20 ta test)"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Bilet nomi</Label>
              <Input
                id="title"
                placeholder="Bilet nomini kiriting..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Tavsif (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Bilet haqida qisqacha ma'lumot..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="is-public"
                checked={isPublic}
                onCheckedChange={(v) => setIsPublic(Boolean(v))}
              />
              <Label htmlFor="is-public">Ommaviy (bepul)</Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingTicket ? "Biletni tahrirlash" : "Bilet yaratish"}
              </Button>
              {editingTicket && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Bekor qilish
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Biletlar ro'yxati</CardTitle>
            <CardDescription>Barcha biletlar</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Biletlar yuklanmoqda...</div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Hozircha biletlar mavjud emas. Birinchi biletni yarating!
              </div>
            ) : (
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`flex items-center justify-between rounded-lg border p-3 cursor-pointer transition-colors ${
                      selectedTicket === ticket.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedTicket(ticket.id === selectedTicket ? null : ticket.id)}
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{ticket.title}</span>
                      <Badge variant={ticket.is_public ? "outline" : "destructive"}>
                        {ticket.is_public ? "Public" : "Premium"}
                      </Badge>
                      <Badge variant="secondary">{ticket.test_count || 0}/20</Badge>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(ticket)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(ticket.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTicket && (
          <Card>
            <CardHeader>
              <CardTitle>Bilet testlari ({ticketTests.length}/20)</CardTitle>
              <CardDescription>{selectedTicketData?.title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Select value={selectedTest} onValueChange={setSelectedTest}>
                  <SelectTrigger>
                    <SelectValue placeholder="Testni tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTestsForTicket.map((test) => (
                      <SelectItem key={test.id} value={test.id}>
                        {test.question.substring(0, 50)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleAddTest}
                  disabled={!selectedTest || ticketTests.length >= 20}
                  size="icon"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ticketTests.map((tt: any, index: number) => (
                  <div
                    key={tt.id}
                    className="flex items-center justify-between rounded-lg border p-2 text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium">#{index + 1}</p>
                      <p className="text-muted-foreground text-xs">
                        {tt.tests?.question?.substring(0, 40)}...
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(tt.id, "up")}
                        disabled={index === 0}
                      >
                        ↑
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleReorder(tt.id, "down")}
                        disabled={index === ticketTests.length - 1}
                      >
                        ↓
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleRemoveTest(tt.id)}
                      >
                        <X className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
                {ticketTests.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">Hozircha testlar qo'shilmagan</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
