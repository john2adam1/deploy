"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { CheckCircle2, XCircle, Volume2, Lightbulb, BookOpen } from "lucide-react"
import Image from "next/image"
import type { Test, UserSettings } from "@/lib/types"
import { useTranslation } from "react-i18next"

interface EnhancedTestInterfaceProps {
  title: string
  tests: Test[]
  userId: string
  testType?: "topic" | "ticket" | "exam" | "random"
  testTypeId?: string
  userSettings?: UserSettings | null
}

export function EnhancedTestInterface({
  title,
  tests,
  userId,
  testType = "topic",
  testTypeId,
  userSettings,
}: EnhancedTestInterfaceProps) {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({})
  const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, boolean>>({})
  const [isFinished, setIsFinished] = useState(false)
  const [results, setResults] = useState<{ correct: number; wrong: number; unanswered: number; score: number } | null>(null)
  const [showExplanation, setShowExplanation] = useState<Record<number, boolean>>({})
  const [playingAudio, setPlayingAudio] = useState<Record<number, boolean>>({})
  const audioRefs = useRef<Record<number, HTMLAudioElement>>({})
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  // We rely on i18next for language, but we can verify consistency if needed.
  // The userSettings language should ideally ideally match i18n.language, but i18next is the source of truth for UI.
  const questionFontSize = userSettings?.question_font_size || 16
  const answerFontSize = userSettings?.answer_font_size || 14

  // Reset audio when question changes
  useEffect(() => {
    // Stop any playing audio
    const currentAudio = Object.values(audioRefs.current).find(audio => !audio.paused);
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    setPlayingAudio({});

    // Auto-scroll to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFinished) return

      if (e.key === "ArrowLeft" && currentIndex > 0) {
        setCurrentIndex(currentIndex - 1)
      } else if (e.key === "ArrowRight" && currentIndex < tests.length - 1) {
        // Allow navigation regardless of answer status
        setCurrentIndex(currentIndex + 1)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentIndex, tests.length, isFinished])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [currentIndex]: answerIndex })
    setAnsweredQuestions({ ...answeredQuestions, [currentIndex]: true })
  }

  const handleFinish = async () => {
    setIsFinished(true)

    let correct = 0
    let wrong = 0
    let unanswered = 0

    tests.forEach((test, index) => {
      const selectedAnswer = selectedAnswers[index]
      if (selectedAnswer === undefined) {
        unanswered++
      } else if (selectedAnswer === test.correct_answer) {
        correct++
      } else {
        wrong++
      }
    })

    const total = tests.length
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    setResults({ correct, wrong, unanswered, score })

    if (testType === "topic" && testTypeId) {
      await saveTopicStatistics(testTypeId, correct, wrong, unanswered, score)
    } else if (testType === "ticket" && testTypeId) {
      await saveTicketStatistics(testTypeId, correct, wrong, unanswered, score)
    } else if (testType === "exam" && testTypeId) {
      const examType = Number.parseInt(testTypeId) as 20 | 50 | 100
      await saveExamStatistics(examType, correct, wrong, unanswered, score)
    }
  }

  const saveTopicStatistics = async (
    topicId: string,
    correct: number,
    wrong: number,
    unanswered: number,
    percentage: number
  ) => {
    const { data: existing } = await supabase
      .from("topic_statistics")
      .select("*")
      .eq("user_id", userId)
      .eq("topic_id", topicId)
      .single()

    if (existing) {
      await supabase
        .from("topic_statistics")
        .update({
          correct_count: correct,
          wrong_count: wrong,
          unanswered_count: unanswered,
          percentage,
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("topic_statistics").insert({
        user_id: userId,
        topic_id: topicId,
        correct_count: correct,
        wrong_count: wrong,
        unanswered_count: unanswered,
        percentage,
      })
    }
  }

  const saveTicketStatistics = async (
    ticketId: string,
    correct: number,
    wrong: number,
    unanswered: number,
    percentage: number
  ) => {
    const { data: existing } = await supabase
      .from("ticket_statistics")
      .select("*")
      .eq("user_id", userId)
      .eq("ticket_id", ticketId)
      .single()

    if (existing) {
      await supabase
        .from("ticket_statistics")
        .update({
          correct_count: correct,
          wrong_count: wrong,
          unanswered_count: unanswered,
          percentage,
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("ticket_statistics").insert({
        user_id: userId,
        ticket_id: ticketId,
        correct_count: correct,
        wrong_count: wrong,
        unanswered_count: unanswered,
        percentage,
      })
    }
  }

  const saveExamStatistics = async (
    examType: 20 | 50 | 100,
    correct: number,
    wrong: number,
    unanswered: number,
    percentage: number
  ) => {
    const { data: existing } = await supabase
      .from("exam_statistics")
      .select("*")
      .eq("user_id", userId)
      .eq("exam_type", examType)
      .single()

    if (existing) {
      await supabase
        .from("exam_statistics")
        .update({
          correct_count: correct,
          wrong_count: wrong,
          unanswered_count: unanswered,
          percentage,
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
    } else {
      await supabase.from("exam_statistics").insert({
        user_id: userId,
        exam_type: examType,
        correct_count: correct,
        wrong_count: wrong,
        unanswered_count: unanswered,
        percentage,
      })
    }
  }

  const toggleAudio = (index: number) => {
    if (!audioRefs.current[index] && tests[index].audio_url) {
      const audio = new Audio(tests[index].audio_url!)
      audioRefs.current[index] = audio
      audio.onended = () => setPlayingAudio({ ...playingAudio, [index]: false })
    }

    const audio = audioRefs.current[index]
    if (audio) {
      if (playingAudio[index]) {
        audio.pause()
        audio.currentTime = 0
        setPlayingAudio({ ...playingAudio, [index]: false })
      } else {
        audio.play()
        setPlayingAudio({ ...playingAudio, [index]: true })
      }
    }
  }

  const toggleExplanation = (index: number) => {
    setShowExplanation({ ...showExplanation, [index]: !showExplanation[index] })
  }

  if (isFinished && results) {
    return (
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-2xl">{t("test.finished")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-primary mb-2">{results.score}%</div>
              <div className="text-muted-foreground">{t("test.finalScore")}</div>
            </div>

            <div className="grid gap-4 sm:grid-cols-4">
              <div className="rounded-lg border bg-card p-4 text-center">
                <div className="text-2xl font-bold">{tests.length}</div>
                <div className="text-sm text-muted-foreground">{t("test.totalQuestions")}</div>
              </div>
              <div className="rounded-lg border bg-success/10 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-success">
                  <CheckCircle2 className="h-6 w-6" />
                  {results.correct}
                </div>
                <div className="text-sm text-muted-foreground">{t("test.correct")}</div>
              </div>
              <div className="rounded-lg border bg-destructive/10 p-4 text-center">
                <div className="flex items-center justify-center gap-2 text-2xl font-bold text-destructive">
                  <XCircle className="h-6 w-6" />
                  {results.wrong}
                </div>
                <div className="text-sm text-muted-foreground">{t("test.wrong")}</div>
              </div>
              <div className="rounded-lg border bg-muted/10 p-4 text-center">
                <div className="text-2xl font-bold">{results.unanswered}</div>
                <div className="text-sm text-muted-foreground">{t("test.unanswered")}</div>
              </div>
            </div>

            <Button onClick={() => router.push("/dashboard")} className="w-full">
              {t("test.backToDashboard")}
            </Button>
          </CardContent>
        </Card>
      </main>
    )
  }

  const currentTest = tests[currentIndex]
  const selectedAnswer = selectedAnswers[currentIndex]
  const isAnswered = answeredQuestions[currentIndex]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">
              {t("test.question")} {currentIndex + 1} {t("test.of")} {tests.length}
            </p>
          </div>
          <Button variant="outline" onClick={handleFinish} className="ml-auto">
            {t("test.finish")}
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left side: Question */}
              <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center">
                  {currentTest.image_url ? (
                    <Image
                      src={currentTest.image_url}
                      alt="Question image"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <BookOpen className="h-24 w-24 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <h2 className="font-semibold" style={{ fontSize: `${questionFontSize}px` }}>
                    {currentTest.question}
                  </h2>
                </div>
              </div>

              {/* Right side: Answers, Audio, Explanation */}
              <div className="space-y-4">
                <RadioGroup
                  key={currentIndex}
                  value={selectedAnswer?.toString()}
                  onValueChange={(value) => handleAnswerSelect(Number.parseInt(value))}
                >
                  {currentTest.answers.map((answer, index) => {
                    const isSelected = selectedAnswer === index
                    const isCorrect = index === currentTest.correct_answer
                    const showFeedback = isAnswered

                    let borderColor = "border"
                    let bgColor = ""

                    if (showFeedback) {
                      if (isSelected) {
                        if (!isCorrect) {
                          borderColor = "border-red-500 bg-red-50 dark:bg-red-950"
                        } else {
                          borderColor = "border-green-500 bg-green-50 dark:bg-green-950"
                        }
                      } else if (isCorrect) {
                        // Always show correct answer in green if user has answered this question
                        borderColor = "border-green-500 bg-green-50 dark:bg-green-950"
                      }
                    }

                    return (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 rounded-lg ${borderColor} ${bgColor} p-4 hover:bg-accent transition-colors`}
                      >
                        <RadioGroupItem
                          value={index.toString()}
                          id={`answer-${index}`}
                          disabled={isAnswered}
                        />
                        <Label
                          htmlFor={`answer-${index}`}
                          className="flex-1 cursor-pointer"
                          style={{ fontSize: `${answerFontSize}px` }}
                        >
                          {answer}
                        </Label>
                        {showFeedback && (
                          <div className="ml-2">
                            {isSelected && !isCorrect ? (
                              <XCircle className="h-5 w-5 text-red-500" />
                            ) : isCorrect ? (
                              <CheckCircle2 className="h-5 w-5 text-green-500" />
                            ) : null}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </RadioGroup>

                {/* Audio and Explanation buttons */}
                <div className="flex gap-2 justify-end">
                  {currentTest.audio_url && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => toggleAudio(currentIndex)}
                    >
                      <Volume2 className={`h-4 w-4 ${playingAudio[currentIndex] ? "text-primary" : ""}`} />
                    </Button>
                  )}
                  {currentTest.explanation_text && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full"
                      onClick={() => toggleExplanation(currentIndex)}
                    >
                      <Lightbulb className={`h-4 w-4 ${showExplanation[currentIndex] ? "text-primary" : ""}`} />
                    </Button>
                  )}
                </div>

                {/* Explanation display */}
                {showExplanation[currentIndex] && currentTest.explanation_text && (
                  <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                    {currentTest.explanation_title && (
                      <h3 className="font-semibold">{currentTest.explanation_title}</h3>
                    )}
                    <p className="text-sm text-muted-foreground">{currentTest.explanation_text}</p>
                  </div>
                )}

                {/* Navigation */}
                <div className="flex gap-2 pt-4">
                  {currentIndex > 0 && (
                    <Button variant="outline" onClick={() => setCurrentIndex(currentIndex - 1)} className="flex-1">
                      {t("test.previous")}
                    </Button>
                  )}
                  {currentIndex < tests.length - 1 ? (
                    <Button
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                      className="flex-1"
                    >
                      {t("test.next")}
                    </Button>
                  ) : (
                    <Button onClick={handleFinish} disabled={selectedAnswer === undefined} className="flex-1">
                      {t("test.finish")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
