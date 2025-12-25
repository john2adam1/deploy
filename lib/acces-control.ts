export function hasActiveAccess(user: { trial_end: string; subscription_end: string | null }): boolean {
    const now = new Date()
    const trialEnd = new Date(user.trial_end)
    const subscriptionEnd = user.subscription_end ? new Date(user.subscription_end) : null
  
    const trialActive = trialEnd > now
    const subscriptionActive = subscriptionEnd && subscriptionEnd > now
  
    return trialActive || !!subscriptionActive
  }
  
  export function getTimeRemaining(endTime: string): {
    hours: number
    minutes: number
    seconds: number
    expired: boolean
  } {
    const now = new Date().getTime()
    const end = new Date(endTime).getTime()
    const distance = end - now
  
    if (distance <= 0) {
      return { hours: 0, minutes: 0, seconds: 0, expired: true }
    }
  
    return {
      hours: Math.floor(distance / (1000 * 60 * 60)),
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
      expired: false,
    }
  }
  