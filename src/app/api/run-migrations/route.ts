import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST() {
  try {
    // Run Prisma migrations
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy', {
      cwd: process.cwd(),
      env: process.env
    })
    
    console.log('Migration output:', stdout)
    if (stderr) console.error('Migration stderr:', stderr)
    
    return NextResponse.json({
      success: true,
      message: 'Migrations completed successfully',
      output: stdout
    })
  } catch (error) {
    console.error('Migration failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 