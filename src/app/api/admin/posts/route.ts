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

// GET: 포스트 목록
export async function GET() {
  try {
    const posts = await writeClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) {
        _id,
        title,
        "slug": slug.current,
        category,
        status,
        publishedAt,
        scheduledAt,
        author,
        excerpt
      }
    `)
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 })
  }
}

// POST: 새 포스트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, excerpt, category, content, status, publishedAt, scheduledAt, author } = body

    const doc: any = {
      _type: 'post',
      title,
      slug: { _type: 'slug', current: slug },
      excerpt,
      category,
      content,
      status: status || 'published',
      author: author || '비니',
    }

    if (publishedAt) doc.publishedAt = publishedAt
    if (scheduledAt) doc.scheduledAt = scheduledAt

    const result = await writeClient.create(doc)
    return NextResponse.json({ post: result }, { status: 201 })
  } catch (error) {
    console.error('Sanity create error:', error)
    return NextResponse.json({ error: '포스트 생성에 실패했습니다.' }, { status: 500 })
  }
}
