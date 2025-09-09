import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API Test Route Working',
    timestamp: new Date().toISOString(),
    url: request.url
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'POST API Test Route Working',
    timestamp: new Date().toISOString(),
    url: request.url
  })
}
