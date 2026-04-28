import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Next.js 16: middleware -> proxy 로 변경됨
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin/login 은 인증 없이 접근 가능
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // /admin/** 경로에 대해 쿠키 확인
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')
    if (!token || token.value !== 'authenticated') {
      const loginUrl = new URL('/admin/login', request.url)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
