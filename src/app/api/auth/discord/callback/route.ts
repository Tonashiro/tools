import { NextRequest, NextResponse } from 'next/server'
import { exchangeCodeForToken, fetchDiscordUser, generateJWT, getDiscordConfig } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const error = searchParams.get('error')

    // Handle OAuth errors
    if (error) {
      console.error('Discord OAuth error:', error)
      return NextResponse.redirect(`${getDiscordConfig().returnTo}?error=auth_failed`)
    }

    // Validate authorization code
    if (!code) {
      return NextResponse.redirect(`${getDiscordConfig().returnTo}?error=no_code`)
    }

    // Exchange code for Discord token
    const tokenResponse = await exchangeCodeForToken(code)
    const accessToken = tokenResponse.access_token

    // Fetch Discord user information
    const discordUser = await fetchDiscordUser(accessToken)

    if (!discordUser?.id) {
      console.error('Invalid Discord user response:', discordUser)
      return NextResponse.redirect(`${getDiscordConfig().returnTo}?error=invalid_user`)
    }

    // Generate JWT token
    const token = generateJWT(discordUser)

    // Create response with redirect
    const response = NextResponse.redirect(getDiscordConfig().returnTo)

    // Set HTTP-only cookie with JWT token
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Discord callback error:', error)
    return NextResponse.redirect(`${getDiscordConfig().returnTo}?error=callback_failed`)
  }
} 