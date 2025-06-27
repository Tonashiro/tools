'use client'

import { useCurrentUser } from '@/hooks/use-auth'
import { getDiscordAvatarUrl } from '@/lib/auth'

export function UserWelcome() {
  const user = useCurrentUser()

  if (!user?.isAuthenticated) {
    return null
  }

  const avatarUrl = getDiscordAvatarUrl(user.discord_id, user.avatar)

  return (
    <section className="container px-4 py-8 mx-auto">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 border">
          <div className="flex items-center gap-4">
            <img
              src={avatarUrl}
              alt={user.username}
              className="w-16 h-16 rounded-full border-4 border-primary/20"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-foreground">
                Welcome back, {user.username}! 👋
              </h2>
              <p className="text-muted-foreground mt-1">
                You&apos;re successfully authenticated with Discord. Your session is secure and will persist across browser refreshes.
              </p>
            </div>
          </div>
          <div className="mt-4 p-4 bg-background/50 rounded-lg">
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
              Your Discord Information:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Username:</span>
                <span className="ml-2 font-medium">{user.username}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Discord ID:</span>
                <span className="ml-2 font-medium">{user.discord_id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 