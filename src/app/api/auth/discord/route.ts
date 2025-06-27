import { NextResponse } from 'next/server'
import { generateDiscordAuthUrl } from '@/lib/auth'

export async function GET() {
  try {
    const authUrl = generateDiscordAuthUrl()
    return NextResponse.redirect(authUrl)
  } catch (error) {
    console.error('Discord auth URL generation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate Discord authentication URL' 
      },
      { status: 500 }
    )
  }
} 