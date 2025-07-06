// Get Discord avatar URL
export function getDiscordAvatarUrl(
  userId: string,
  avatar: string | null
): string {
  if (!avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${
      parseInt(userId) % 5
    }.png`;
  }

  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
}
