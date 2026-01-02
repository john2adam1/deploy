// lib/access-control.ts
import type { User } from "./types"

// Premium access: user must have an active subscription
// OR the content they're trying to access is public
export function hasActiveAccess(user: User): boolean {
  const subscriptionEnd = user.subscription_end
    ? new Date(user.subscription_end)
    : null

  const now = new Date()
  return subscriptionEnd !== null && subscriptionEnd > now
}

// Check if user can access specific content (topic/ticket/exam)
export function canAccessContent(user: User, isPublic: boolean = false): boolean {
  // Public content is always accessible
  if (isPublic) return true
  
  // Premium content requires active subscription
  return hasActiveAccess(user)
}

// ⏳ Subscription tugashigacha qolgan vaqt
export function getTimeRemaining(subscriptionEnd: string | Date) {
  const end = new Date(subscriptionEnd).getTime()
  const now = Date.now()

  const diff = end - now

  if (diff <= 0) {
    return {
      expired: true,
      total: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const totalSeconds = Math.floor(diff / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return {
    expired: false,
    total: diff,
    hours,
    minutes,
    seconds,
  }
}