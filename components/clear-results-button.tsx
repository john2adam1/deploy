"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { clearUserResults } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

export function ClearResultsButton() {
    const [loading, setLoading] = useState(false)
    const { toast } = useToast()

    const handleClear = async () => {
        setLoading(true)
        try {
            const result = await clearUserResults()
            if (result.error) {
                toast({
                    title: "Xatolik",
                    description: "Natijalarni o'chirishda xatolik yuz berdi",
                    variant: "destructive",
                })
            } else {
                toast({
                    title: "Muvaffaqiyatli",
                    description: "Barcha test natijalari tozalandi",
                })
            }
        } catch (error) {
            toast({
                title: "Xatolik",
                description: "Tizim xatoligi",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Natijalarni tozalash
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Haqiqatan ham o'chirmoqchimisiz?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bu amal barcha test natijalaringizni (biletlar, mavzular va imtihonlar) o'chirib yuboradi. Bu amalni ortga qaytarib bo'lmaydi.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Bekor qilish</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClear} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {loading ? "O'chirilmoqda..." : "Ha, o'chirish"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
