import { NextRequest, NextResponse } from 'next/server'
import { getSortedPostsData, savePostData } from '@/lib/posts'

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
    const { title, slug, excerpt, category, content, status, publishedAt, scheduledAt, author } = body

    if (!title || !slug) {
      return NextResponse.json({ error: '제목과 슬러그는 필수입니다.' }, { status: 400 })
    }

    // TipTap content might come as an array (PortableText style) or HTML string
    let contentHtml = ''
    if (typeof content === 'string') {
      contentHtml = content
    } else if (Array.isArray(content)) {
      // If it's the structure from PostForm.tsx (line 103-111)
      contentHtml = content[0]?.children[0]?.text || ''
    }

    const postData = {
      title,
      slug,
      excerpt,
      category,
      contentHtml,
      status: status || 'published',
      date: publishedAt || new Date().toISOString(),
      publishedAt: publishedAt || new Date().toISOString(),
      scheduledAt,
      author: author || '비니',
      imageUrl: '/images/default-post.jpg', // Default image if not provided
    }

    savePostData(slug, postData)
    
    return NextResponse.json({ post: { _id: slug, ...postData } }, { status: 201 })
  } catch (error) {
    console.error('Local create error:', error)
    return NextResponse.json({ error: '포스트 생성에 실패했습니다.' }, { status: 500 })
  }
}
