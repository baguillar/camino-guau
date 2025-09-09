import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest } from "next/server"

const handler = NextAuth(authOptions)

export async function GET(request: NextRequest, context: any) {
  try {
    console.log('NextAuth GET request:', request.url)
    return await handler(request, context)
  } catch (error) {
    console.error('NextAuth GET error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

export async function POST(request: NextRequest, context: any) {
  try {
    console.log('NextAuth POST request:', request.url)
    return await handler(request, context)
  } catch (error) {
    console.error('NextAuth POST error:', error)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
