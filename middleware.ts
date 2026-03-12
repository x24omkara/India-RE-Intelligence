import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {

  const authHeader = req.headers.get('authorization')

  if (authHeader) {
    const encoded = authHeader.split(' ')[1]
    const decoded = atob(encoded)
    const password = decoded.split(':')[1]

    if (password === process.env.AVAADA_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new Response('Password required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Avaada Dashboard"',
    },
  })
}

export const config = {
  matcher: ['/avaada/:path*']
}
