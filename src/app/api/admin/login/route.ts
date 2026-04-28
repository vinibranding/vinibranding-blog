import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { password } = await request.json()
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1234'

  if (password !== adminPassword) {
    return NextResponse.json({ error: '비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin-token', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7일
    path: '/',
  })

  return response
}
