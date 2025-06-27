import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      data: {
        message: 'Logged out successfully',
      },
      timestamp: new Date().toISOString(),
    })

    // Clear the authentication cookie
    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to logout',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
} 