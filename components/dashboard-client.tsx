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
            <div className="max-w-2xl mx-auto mb-10">
                <SubscriptionBanner user={user} telegramLink={telegramLink} />
            </div>

            <div className="mb-12 text-center relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] -z-10" />

                <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    {t("dashboard.welcome")}
                </h1>
                <p className="text-lg text-muted-foreground mb-6 max-w-lg mx-auto leading-relaxed">
                    {t("dashboard.chooseMode")}
                </p>
                <div className="flex justify-center">
                    <ClearResultsButton />
                </div>
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
                {/* Imtihonlar */}
                <div className="group relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500" />
                    <Card className="relative bg-background/60 backdrop-blur-xl border-white/10 shadow-xl transition-all hover:-translate-y-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3 text-2xl">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <GraduationCap className="h-6 w-6 text-primary" />
                                </div>
                                {t("dashboard.exams")}
                            </CardTitle>
                            <CardDescription className="text-base">{t("dashboard.randomQuestions")}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[20, 50, 100].map((count) => {
                                const percentage = examStatsMap[count]
                                return (
                                    <Button
                                        key={count}
                                        asChild
                                        className={`w-full relative justify-between px-6 h-14 text-base ${!hasAccess
                                                ? "opacity-80"
                                                : "bg-card/50 hover:bg-primary/5 border border-primary/10 hover:border-primary/30 text-foreground"
                                            }`}
                                        variant={!hasAccess ? "secondary" : "ghost"}
                                        disabled={!hasAccess || !totalTestsCount || totalTestsCount < count}
                                    >
                                        {hasAccess ? (
                                            <Link href={`/test/exam/${count}`} className="w-full flex items-center justify-between">
                                                <span className="font-semibold">{t(`dashboard.exam${count}`)}</span>
                                                {percentage !== undefined && (
                                                    <Badge className={percentage >= 90 ? "bg-green-500 hover:bg-green-600" : percentage >= 60 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"}>
                                                        {percentage}%
                                                    </Badge>
                                                )}
                                            </Link>
                                        ) : (
                                            <div className="flex items-center justify-center gap-2 w-full text-muted-foreground">
                                                <Lock className="h-4 w-4" />
                                                <span>{t(`dashboard.exam${count}`)}</span>
                                                <Badge variant="outline" className="ml-auto border-primary/20 text-primary">Premium</Badge>
                                            </div>
                                        )}
                                    </Button>
                                )
                            })}
                        </CardContent>
                    </Card>
                </div>

                {/* Biletlar va Tasodifiy (Grid) */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Biletlar */}
                    <Card className="bg-background/60 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <Ticket className="h-5 w-5 text-purple-600" />
                                </div>
                                {t("dashboard.tickets")}
                            </CardTitle>
                            <CardDescription>{t("dashboard.ticketsDescription")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full h-12 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-500/20" disabled={!tickets || tickets.length === 0}>
                                <Link href="/tickets">{t("dashboard.viewTickets")}</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Tasodifiy */}
                    <Card className="bg-background/60 backdrop-blur-xl border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 group">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform">
                                    <Shuffle className="h-5 w-5 text-blue-600" />
                                </div>
                                {t("dashboard.randomTests")}
                            </CardTitle>
                            <CardDescription>{t("dashboard.randomDescription")}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                asChild
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/20"
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

                {/* Mavzular */}
                <Card className="bg-background/60 backdrop-blur-xl border-white/10 shadow-xl overflow-hidden">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <div className="p-2 bg-orange-500/10 rounded-xl">
                                <BookOpen className="h-6 w-6 text-orange-600" />
                            </div>
                            {t("dashboard.topics")}
                        </CardTitle>
                        <CardDescription>{t("dashboard.topicsDescription")}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {topics && topics.length > 0 ? (
                            <div className="divide-y divide-border/50">
                                {topics.map((topic: any) => {
                                    const isPublic = topic.is_public
                                    const canAccess = isPublic || hasAccess
                                    const percentage = topicStatsMap[topic.id]

                                    return (
                                        <div key={topic.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-foreground/90">{topic.title}</span>
                                                    {!isPublic && <Badge variant="secondary" className="text-xs px-1.5 py-0 h-5 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400">Premium</Badge>}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {canAccess && percentage !== undefined && (
                                                    <Badge className={percentage >= 90 ? "bg-green-500 hover:bg-green-600" : percentage >= 60 ? "bg-yellow-500 hover:bg-yellow-600" : "bg-red-500 hover:bg-red-600"}>
                                                        {percentage}%
                                                    </Badge>
                                                )}
                                                <Button asChild size="sm" variant={canAccess ? "outline" : "secondary"} className={canAccess ? "border-primary/20 hover:bg-primary/5 hover:text-primary" : "opacity-70"} disabled={!canAccess}>
                                                    {canAccess ? (
                                                        <Link href={`/test/topic/${topic.id}`}>{t("common.start")}</Link>
                                                    ) : (
                                                        <div className="flex items-center gap-1">
                                                            <Lock className="h-3 w-3" />
                                                            <span className="hidden sm:inline">{t("subscription.premium")}</span>
                                                        </div>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                {t("dashboard.noTopics")}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
