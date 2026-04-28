'use client'

import Link from 'next/link'
import PostForm from '@/components/admin/PostForm'

export default function AdminNewPostPage() {
  return (
    <div className="p-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/admin/posts" className="hover:text-rose-500 transition-colors">포스트 관리</Link>
        <span>/</span>
        <span className="text-gray-700 font-medium">새 글 작성</span>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">새 글 작성</h1>
        <p className="text-sm text-gray-500 mt-1">새 블로그 포스트를 작성합니다.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-8">
        <PostForm />
      </div>
    </div>
  )
}
