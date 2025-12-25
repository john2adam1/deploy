"use client"

import { useEffect, useState } from "react"
import { getTimeRemaining } from "@/lib/access-control"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  endTime: string
  label: string
}

export function CountdownTimer({ endTime, label }: CountdownTimerProps) {
  const [time, setTime] = useState<{ expired: boolean; hours: number; minutes: number; seconds: number } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setTime(getTimeRemaining(endTime))
    
    const interval = setInterval(() => {
      setTime(getTimeRemaining(endTime))
    }, 1000)

    return () => clearInterval(interval)
  }, [endTime])

  if (!mounted || !time || time.expired) {
    return null
  }

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
        <Clock className="h-4 w-4" />
        <span>{label}</span>
      </div>
      <div className="flex gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold tabular-nums">{String(time.hours).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Hours</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold tabular-nums">{String(time.minutes).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Minutes</div>
        </div>
        <div className="text-2xl font-bold">:</div>
        <div className="text-center">
          <div className="text-2xl font-bold tabular-nums">{String(time.seconds).padStart(2, "0")}</div>
          <div className="text-xs text-muted-foreground">Seconds</div>
        </div>
      </div>
    </div>
  )
}
