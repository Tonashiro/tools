import jwt from 'jsonwebtoken'
import type { DiscordUser, DiscordTokenResponse, JWTPayload, UserSession, DiscordConfig } from '@/types/auth'

// Get Discord configuration from environment variables
export function getDiscordConfig(): DiscordConfig {
  const config = {
    clientId: process.env.DISCORD_CLIENT_ID!,
    clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    redirectUri: process.env.DISCORD_REDIRECT_URI!,
    returnTo: process.env.DISCORD_RETURN_TO!,
    jwtSecret: process.env.JWT_SECRET!,
  }

  // Validate that all required environment variables are present
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`)
    }
  }

  return config
}

// Generate Discord OAuth URL
export function generateDiscordAuthUrl(): string {
  const config = getDiscordConfig()
  const scope = 'identify guilds.members.read'
  
  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope,
  })

  return `https://discord.com/api/oauth2/authorize?${params.toString()}`
}

// Exchange authorization code for Discord token
export async function exchangeCodeForToken(code: string): Promise<DiscordTokenResponse> {
  const config = getDiscordConfig()
  
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: config.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: config.redirectUri,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to exchange code for token: ${error}`)
  }

  return response.json()
}

// Fetch Discord user information
export async function fetchDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to fetch Discord user: ${error}`)
  }

  return response.json()
}

// Generate JWT token for user session
export function generateJWT(user: DiscordUser): string {
  const config = getDiscordConfig()
  
  const payload: JWTPayload = {
    id: user.id,
    discord_id: user.id,
    username: user.username,
    avatar: user.avatar,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
  }

  return jwt.sign(payload, config.jwtSecret)
}

// Verify JWT token and extract user session
export function verifyJWT(token: string): UserSession | null {
  try {
    const config = getDiscordConfig()
    const payload = jwt.verify(token, config.jwtSecret) as JWTPayload
    
    return {
      id: payload.id,
      discord_id: payload.discord_id,
      username: payload.username,
      avatar: payload.avatar,
      isAuthenticated: true,
    }
  } catch (error) {
    console.error('JWT verification failed:', error)
    return null
  }
}

// Get user avatar URL
export function getDiscordAvatarUrl(userId: string, avatar: string | null): string {
  if (!avatar) {
    // Return default Discord avatar
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`
  }
  
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`
} 