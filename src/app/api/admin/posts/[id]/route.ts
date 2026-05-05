import { NextRequest, NextResponse } from 'next/server'
import { getPostData, savePostData, deletePostData } from '@/lib/posts'

export const dynamic = 'force-dynamic'

// GET: 단일 포스트 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const post = await getPostData(id)
    if (!post) return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json({ post: { ...post, _id: post.id } })
  } catch (error) {
    console.error('Local fetch error:', error)
    return NextResponse.json({ error: '데이터를 불러오는 데 실패했습니다.' }, { status: 500 })
  }
}

// PATCH: 포스트 수정
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const body = await request.json()
    const { title, slug, category, content, status, publishedAt, scheduledAt, author, imageUrl } = body

    const existingPost = await getPostData(id)
    if (!existingPost) {
      return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 })
    }

    let contentHtml = existingPost.contentHtml
    if (typeof content === 'string') {
      contentHtml = content
    } else if (Array.isArray(content)) {
      contentHtml = content[0]?.children[0]?.text || ''
    }

    const updatedData = {
      ...existingPost,
      ...(title !== undefined && { title }),
      ...(slug !== undefined && { slug }),
      ...(category !== undefined && { category }),
      ...(content !== undefined && { contentHtml }),
      ...(status !== undefined && { status }),
      ...(publishedAt !== undefined && { date: publishedAt, publishedAt }),
      ...(scheduledAt !== undefined && { scheduledAt }),
      ...(author !== undefined && { author }),
      ...(imageUrl !== undefined && { imageUrl }),
    }

    // If slug changed, we need to delete old file and create new one
    if (slug && slug !== id) {
      await deletePostData(id)
      await savePostData(slug, updatedData)
    } else {
      await savePostData(id, updatedData)
    }

    return NextResponse.json({ post: { ...updatedData, _id: slug || id } })
  } catch (error) {
    console.error('Local patch error:', error)
    return NextResponse.json({ error: '포스트 수정에 실패했습니다.' }, { status: 500 })
  }
}

// DELETE: 포스트 삭제
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const success = await deletePostData(id)
    if (!success) return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Local delete error:', error)
    return NextResponse.json({ error: '포스트 삭제에 실패했습니다.' }, { status: 500 })
  }
}
