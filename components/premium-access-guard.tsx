// components/premium-access-guard.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Crown } from "lucide-react"

export function PremiumAccessGuard({ telegramLink }: { telegramLink?: string }) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams?.get("premium") === "required") {
      setOpen(true)
    }
  }, [searchParams])

  const handleBuySubscription = () => {
    window.open(telegramLink || "https://t.me/yourusername", "_blank")
    setOpen(false)
    router.push("/dashboard")
  }

  const handleGoBack = () => {
    setOpen(false)
    router.push("/dashboard")
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Crown className="h-8 w-8 text-primary" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Premium obuna kerak
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Bu test yoki mavzu premium foydalanuvchilar uchun mo'ljallangan.
            Barcha testlar va funksiyalarga kirish uchun premium obuna sotib oling.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <AlertDialogAction
            onClick={handleGoBack}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/80"
          >
            Orqaga
          </AlertDialogAction>
          <AlertDialogAction onClick={handleBuySubscription}>
            <Crown className="h-4 w-4 mr-2" />
            Obuna sotib olish
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}