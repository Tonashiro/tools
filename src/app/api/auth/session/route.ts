import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const authToken = request.cookies.get('auth-token')?.value

    if (!authToken) {
      return NextResponse.json({
        success: true,
        data: {
          user: {
            id: '',
            discord_id: '',
            username: '',
            avatar: null,
            isAuthenticated: false,
          },
        },
        timestamp: new Date().toISOString(),
      })
    }

    const userSession = verifyJWT(authToken)

    if (!userSession) {
      // Clear invalid token
      const response = NextResponse.json({
        success: true,
        data: {
          user: {
            id: '',
            discord_id: '',
            username: '',
            avatar: null,
            isAuthenticated: false,
          },
        },
        timestamp: new Date().toISOString(),
      })
      
      response.cookies.delete('auth-token')
      return response
    }

    return NextResponse.json({
      success: true,
      data: {
        user: userSession,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to verify session',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 