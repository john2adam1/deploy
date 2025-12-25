"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, XCircle } from "lucide-react"
import type { User } from "@/lib/types"

export function UsersManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })

    if (data) setUsers(data)
    setLoading(false)
  }

  const grantSubscription = async (userId: string) => {
    const subscriptionEnd = new Date()
    subscriptionEnd.setMonth(subscriptionEnd.getMonth() + 1)

    const { error } = await supabase
      .from("users")
      .update({ subscription_end: subscriptionEnd.toISOString() })
      .eq("id", userId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to grant subscription",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Subscription granted for 1 month",
      })
      fetchUsers()
    }
  }

  const revokeSubscription = async (userId: string) => {
    const { error } = await supabase.from("users").update({ subscription_end: null }).eq("id", userId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to revoke subscription",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Subscription revoked",
      })
      fetchUsers()
    }
  }

  const hasActiveSubscription = (user: User) => {
    if (!user.subscription_end) return false
    return new Date(user.subscription_end) > new Date()
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>Manage user subscriptions and access</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{user.email}</p>
                  {user.role === "admin" && <Badge variant="secondary">Admin</Badge>}
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>Trial: {new Date(user.trial_end).toLocaleDateString()}</span>
                  {user.subscription_end && (
                    <span>Subscription: {new Date(user.subscription_end).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveSubscription(user) ? (
                  <>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Active
                    </Badge>
                    <Button variant="outline" size="sm" onClick={() => revokeSubscription(user.id)}>
                      Revoke
                    </Button>
                  </>
                ) : (
                  <>
                    <Badge variant="destructive">
                      <XCircle className="mr-1 h-3 w-3" />
                      No Subscription
                    </Badge>
                    <Button variant="default" size="sm" onClick={() => grantSubscription(user.id)}>
                      Grant (1 Month)
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
