'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Post {
  _id: string
  title: string
  slug: string
  category: string
  status: string
  publishedAt: string
  scheduledAt?: string
  author: string
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  published: { label: '발행됨', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  draft: { label: '초안', cls: 'bg-gray-100 text-gray-600 border-gray-200' },
  scheduled: { label: '예약발행', cls: 'bg-blue-50 text-blue-700 border-blue-200' },
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/posts')
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" 포스트를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return
    setDeleting(id)
    try {
      await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      await fetchPosts()
    } finally {
      setDeleting(null)
    }
  }

  const filtered = posts.filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">포스트 관리</h1>
          <p className="text-sm text-gray-500 mt-1">총 {posts.length}개의 포스트</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 글 작성
        </Link>
      </div>

      {/* Search */}
      <div className="mb-5">
        <div className="relative max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목 또는 카테고리 검색"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <svg className="animate-spin w-7 h-7 text-rose-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-sm text-gray-400">
            {search ? '검색 결과가 없습니다.' : '아직 작성된 포스트가 없습니다.'}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">제목</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">카테고리</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">상태</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">날짜</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((post) => {
                const st = statusLabel[post.status || 'published'] || statusLabel.published
                return (
                  <tr key={post._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className="text-xs text-gray-600">{post.category || '—'}</span>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${st.cls}`}>
                        {st.label}
                      </span>
                      {post.scheduledAt && (
                        <p className="text-xs text-blue-500 mt-1">
                          {new Date(post.scheduledAt).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-xs text-gray-400 hidden lg:table-cell">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ko-KR') : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.slug && (
                          <a
                            href={`/posts/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            보기
                          </a>
                        )}
                        <Link
                          href={`/admin/posts/${post._id}/edit`}
                          className="text-xs font-medium text-gray-500 hover:text-rose-500 transition-colors px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-rose-200"
                        >
                          수정
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id, post.title)}
                          disabled={deleting === post._id}
                          className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg border border-gray-200 hover:border-red-200 disabled:opacity-50"
                        >
                          {deleting === post._id ? '...' : '삭제'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
