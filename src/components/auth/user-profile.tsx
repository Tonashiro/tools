'use client'

import { Button } from '@/components/ui/button'
import { useCurrentUser, useLogout } from '@/hooks/use-auth'
import { getDiscordAvatarUrl } from '@/lib/auth'

export function UserProfile() {
  const user = useCurrentUser()
  const logoutMutation = useLogout()

  if (!user?.isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync()
  }

  const avatarUrl = getDiscordAvatarUrl(user.discord_id, user.avatar)

  return (
    <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
      <img
        src={avatarUrl}
        alt={user.username}
        className="w-10 h-10 rounded-full border-2 border-primary/20"
      />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">
          {user.username}
        </h3>
        <p className="text-xs text-muted-foreground">
          Discord ID: {user.discord_id}
        </p>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        disabled={logoutMutation.isPending}
      >
        {logoutMutation.isPending ? 'Logging out...' : 'Logout'}
      </Button>
    </div>
  )
} 