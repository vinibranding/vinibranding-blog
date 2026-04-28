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

// GET: 단일 포스트 조회
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  try {
    const post = await writeClient.fetch(
      `*[_type == "post" && _id == $id][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        category,
        content,
        status,
        publishedAt,
        scheduledAt,
        author,
        "imageUrl": mainImage.asset->url
      }`,
      { id }
    )
    if (!post) return NextResponse.json({ error: '포스트를 찾을 수 없습니다.' }, { status: 404 })
    return NextResponse.json({ post })
  } catch (error) {
    console.error('Sanity fetch error:', error)
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
    const { title, slug, excerpt, category, content, status, publishedAt, scheduledAt, author } = body

    const patch: any = {}
    if (title !== undefined) patch.title = title
    if (slug !== undefined) patch.slug = { _type: 'slug', current: slug }
    if (excerpt !== undefined) patch.excerpt = excerpt
    if (category !== undefined) patch.category = category
    if (content !== undefined) patch.content = content
    if (status !== undefined) patch.status = status
    if (publishedAt !== undefined) patch.publishedAt = publishedAt
    if (scheduledAt !== undefined) patch.scheduledAt = scheduledAt
    if (author !== undefined) patch.author = author

    const result = await writeClient.patch(id).set(patch).commit()
    return NextResponse.json({ post: result })
  } catch (error) {
    console.error('Sanity patch error:', error)
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
    await writeClient.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Sanity delete error:', error)
    return NextResponse.json({ error: '포스트 삭제에 실패했습니다.' }, { status: 500 })
  }
}
