import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '@/sanity/env'

const writeClient = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

// GET: 문의 목록
export async function GET() {
  try {
    const inquiries = await writeClient.fetch(`
      *[_type == "inquiry"] | order(createdAt desc) {
        _id,
        name,
        email,
        phone,
        type,
        message,
        isRead,
        createdAt
      }
    `)
    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 })
  }
}

// PATCH: 읽음 처리
export async function PATCH(request: NextRequest) {
  try {
    const { id, isRead } = await request.json()
    await writeClient.patch(id).set({ isRead }).commit()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sanity patch error:', error)
    return NextResponse.json({ error: '업데이트에 실패했습니다.' }, { status: 500 })
  }
}

// POST: 새 문의 접수 (contact 폼에서 사용)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, type, message } = body

    const doc = {
      _type: 'inquiry',
      name,
      email,
      phone: phone || '',
      type,
      message,
      isRead: false,
      createdAt: new Date().toISOString(),
    }

    const result = await writeClient.create(doc)
    return NextResponse.json({ inquiry: result }, { status: 201 })
  } catch (error) {
    console.error('Sanity create error:', error)
    return NextResponse.json({ error: '문의 접수에 실패했습니다.' }, { status: 500 })
  }
}
