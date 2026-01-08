"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Shuffle, Ticket, GraduationCap, Lock } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { ClearResultsButton } from "@/components/clear-results-button"
import { SubscriptionBanner } from "@/components/subscription-banner"
import { hasActiveAccess } from "@/lib/access-control"
import { useTranslation } from "react-i18next"
import type { User } from "@/lib/types"

interface DashboardClientProps {
    user: User
    topics: any[]
    tickets: any[]
    totalTestsCount: number | null
    examStatsMap: Record<number, number>
    topicStatsMap: Record<string, number>
    telegramLink: string
}

export function DashboardClient({
    user,
    topics,
    tickets,
    totalTestsCount,
    examStatsMap,
    topicStatsMap,
    telegramLink,
}: DashboardClientProps) {
    const { t } = useTranslation()
    const hasAccess = hasActiveAccess(user)

    return (
        <>
            {/* Subscription Banner */}
            <div className="max-w-2xl mx-auto mb-8">
                <SubscriptionBanner user={user} telegramLink={telegramLink} />
            </div>

            <div className="mb-8 text-center relative">
                <h1 className="text-3xl font-bold mb-2">{t("dashboard.welcome")}</h1>
                <p className="text-muted-foreground mb-4">{t("dashboard.chooseMode")}</p>
                <div className="flex justify-center">
                    <ClearResultsButton />
                </div>
            </div>

            <div className="max-w-2xl mx-auto space-y-4">
                {/* Imtihonlar */}
                <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <GraduationCap className="h-5 w-5" />
                            {t("dashboard.exams")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.randomQuestions")}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {[20, 50, 100].map((count) => {
                            const percentage = examStatsMap[count]
                            return (
                                <Button
                                    key={count}
                                    asChild
                                    className="w-full relative justify-between px-4"
                                    disabled={!hasAccess || !totalTestsCount || totalTestsCount < count}
                                >
                                    {hasAccess ? (
                                        <Link href={`/test/exam/${count}`} className="w-full flex items-center justify-between">
                                            <span>{t(`dashboard.exam${count}`)}</span>
                                            {percentage !== undefined && (
                                                <Badge variant={percentage >= 90 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                                                    {percentage}%
                                                </Badge>
                                            )}
                                        </Link>
                                    ) : (
                                        <div className="flex items-center justify-center gap-2 w-full">
                                            <Lock className="h-4 w-4" />
                                            {t(`dashboard.exam${count}`)} ({t("subscription.premium")})
                                        </div>
                                    )}
                                </Button>
                            )
                        })}
                    </CardContent>
                </Card>

                {/* Biletlar */}
                <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-5 w-5" />
                            {t("dashboard.tickets")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.ticketsDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full" disabled={!tickets || tickets.length === 0}>
                            <Link href="/tickets">{t("dashboard.viewTickets")}</Link>
                        </Button>
                    </CardContent>
                </Card>

                {/* Mavzular */}
                <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            {t("dashboard.topics")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.topicsDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {topics && topics.length > 0 ? (
                            <div className="space-y-2">
                                {topics.map((topic: any) => {
                                    const isPublic = topic.is_public
                                    const canAccess = isPublic || hasAccess
                                    const percentage = topicStatsMap[topic.id]

                                    return (
                                        <div key={topic.id} className="flex items-center justify-between p-2 rounded-lg border">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{topic.title}</span>
                                                {!isPublic && <Badge variant="destructive">{t("subscription.premium")}</Badge>}
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {canAccess && percentage !== undefined && (
                                                    <Badge variant={percentage >= 90 ? "default" : percentage >= 60 ? "secondary" : "destructive"}>
                                                        {percentage}%
                                                    </Badge>
                                                )}
                                                <Button asChild size="sm" disabled={!canAccess}>
                                                    {canAccess ? (
                                                        <Link href={`/test/topic/${topic.id}`}>{t("common.start")}</Link>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            {t("subscription.premium")}
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-4">
                                {t("dashboard.noTopics")}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Tasodifiy */}
                <Card className="hover:border-primary transition-colors">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Shuffle className="h-5 w-5" />
                            {t("dashboard.randomTests")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.randomDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            asChild
                            className="w-full"
                            disabled={!hasAccess || !totalTestsCount || totalTestsCount < 1}
                        >
                            {hasAccess ? (
                                <Link href="/test/random">{t("dashboard.startRandom")}</Link>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Lock className="h-4 w-4" />
                                    {t("dashboard.premiumRequired")}
                                </div>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
