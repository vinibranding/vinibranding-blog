'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export default function AdminEditPostPage() {
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    fetch(`/api/admin/posts/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.post) setPost(data.post)
        else setError('포스트를 찾을 수 없습니다.')
      })
      .catch(() => setError('데이터를 불러오는 데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/posts" className="hover:text-rose-500 transition-colors">포스트 관리</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">수정</span>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">포스트 수정</h1>
        <p className="text-sm text-gray-500 mt-1">기존 포스트 내용을 수정합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        {loading ? (
          <div className="py-20 flex justify-center">
            <svg className="animate-spin w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-sm text-red-500">{error}</div>
        ) : post ? (
          <PostForm
            isEdit
            initialData={{
              _id: post._id,
              title: post.title,
              slug: post.slug,
              category: post.category,
              status: post.status,
              publishedAt: post.publishedAt,
              scheduledAt: post.scheduledAt,
              author: post.author,
              contentHtml: '',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
