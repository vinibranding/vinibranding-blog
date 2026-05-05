import { NextRequest, NextResponse } from 'next/server'
import { getSortedPostsData, savePostData } from '@/lib/posts'

// Next.js 16: force-dynamic for API routes
export const dynamic = 'force-dynamic'

// GET: 포스트 목록
export async function GET() {
  try {
    const posts = getSortedPostsData().map(p => ({
      ...p,
      _id: p.id, // For backward compatibility with the frontend
    }))
    return NextResponse.json({ posts })
  } catch (error) {
    console.error('Local fetch error:', error)
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 })
  }
}

// POST: 새 포스트 생성
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('[API] Creating post with body:', body)
    const { title, slug, category, content, status, publishedAt, scheduledAt, author, imageUrl } = body

    if (!title || !slug) {
      console.error('[API] Missing title or slug')
      return NextResponse.json({ error: '제목과 슬러그는 필수입니다.' }, { status: 400 })
    }

    // TipTap content might come as an array (PortableText style) or HTML string
    let contentHtml = ''
    if (typeof content === 'string') {
      contentHtml = content
    } else if (Array.isArray(content)) {
      contentHtml = content[0]?.children[0]?.text || ''
    }

    const postData = {
      title,
      slug,
      category,
      contentHtml,
      status: status || 'published',
      date: publishedAt || new Date().toISOString(),
      publishedAt: publishedAt || new Date().toISOString(),
      scheduledAt,
      author: author || '비니',
      imageUrl: imageUrl || '/images/default-post.jpg', 
    }

    console.log('[API] Saving to local storage:', slug)
    savePostData(slug, postData)
    
    return NextResponse.json({ post: { _id: slug, ...postData } }, { status: 201 })
  } catch (error: any) {
    console.error('[API] Local create error:', error)
    return NextResponse.json({ error: `포스트 생성에 실패했습니다: ${error.message}` }, { status: 500 })
  }
}
