// app/dashboard/loading.tsx
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Navbar skeleton */}
            <header className="sticky top-0 z-50 border-b bg-card">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-32" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="mb-8 text-center space-y-2">
                    <Skeleton className="h-9 w-48 mx-auto" />
                    <Skeleton className="h-5 w-64 mx-auto" />
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                    {/* Skeleton cards */}
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i} className="hover:border-primary transition-colors">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-5 w-5" />
                                    <Skeleton className="h-6 w-32" />
                                </div>
                                <Skeleton className="h-4 w-48 mt-2" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                {i === 1 && (
                                    <>
                                        <Skeleton className="h-10 w-full" />
                                        <Skeleton className="h-10 w-full" />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}