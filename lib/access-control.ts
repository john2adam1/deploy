import type { User } from "./types"

export function hasActiveAccess(user: User): boolean {
  const now = new Date()
  const trialEnd = new Date(user.trial_end)
  const subscriptionEnd = user.subscription_end ? new Date(user.subscription_end) : null

  return trialEnd > now || (subscriptionEnd !== null && subscriptionEnd > now)
}

export function getTimeRemaining(endTime: string) {
  const now = new Date()
  const end = new Date(endTime)
  const diff = end.getTime() - now.getTime()

  if (diff <= 0) {
    return {
      expired: true,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return {
    expired: false,
    hours,
    minutes,
    seconds,
  }
}

