import type { User } from "./types"

// Premium access: user must have an active subscription.
// Free 24-hour trial is no longer used.
export function hasActiveAccess(user: User): boolean {
  const subscriptionEnd = user.subscription_end ? new Date(user.subscription_end) : null
  const now = new Date()

  return subscriptionEnd !== null && subscriptionEnd > now
}

