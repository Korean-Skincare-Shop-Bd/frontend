import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  try {
    // Verify the request is authorized
    const authHeader = request.headers.get('authorization')
    const webhookSecret = process.env.WEBHOOK_SECRET || 'your-secret-key'
    
    if (authHeader !== `Bearer ${webhookSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    console.log('Regenerating static sitemap...')
    
    // Regenerate the static sitemap files
    await execAsync('npx next-sitemap')
    
    console.log('✅ Static sitemap regenerated successfully')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Sitemap regenerated successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error regenerating sitemap:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate sitemap', details: error }, 
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Sitemap regeneration endpoint',
    usage: 'POST with Authorization header to regenerate sitemap'
  })
}
