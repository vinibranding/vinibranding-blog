import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

export const dynamic = 'force-dynamic'

async function getStats() {
  try {
    const allPosts = await getSortedPostsData()
    const recentPosts = allPosts.slice(0, 5).map(p => ({
      _id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      status: p.status || 'published',
      publishedAt: p.date
    }))
    
    // For now, inquiries are still from Sanity if they exist, or just 0
    return { 
      postCount: allPosts.length, 
      inquiryCount: 0, 
      unreadCount: 0, 
      recentPosts 
    }
  } catch (err) {
    console.error('[Admin Dashboard] Stats error:', err)
    return { postCount: 0, inquiryCount: 0, unreadCount: 0, recentPosts: [] }
  }
}

const statusLabel: Record<string, { label: string; cls: string }> = {
  published: { label: '발행됨', cls: 'bg-emerald-50 text-emerald-700' },
  draft: { label: '초안', cls: 'bg-gray-100 text-gray-600' },
  scheduled: { label: '예약발행', cls: 'bg-blue-50 text-blue-700' },
}

export default async function AdminDashboardPage() {
  const { postCount, inquiryCount, unreadCount, recentPosts } = await getStats()

  const stats = [
    {
      label: '전체 포스트',
      value: postCount,
      icon: '📝',
      href: '/admin/posts',
      color: 'bg-rose-50 border-rose-100',
      textColor: 'text-rose-600',
    },
    {
      label: '전체 문의',
      value: inquiryCount,
      icon: '💬',
      href: '/admin/inquiries',
      color: 'bg-violet-50 border-violet-100',
      textColor: 'text-violet-600',
    },
    {
      label: '미확인 문의',
      value: unreadCount,
      icon: '🔔',
      href: '/admin/inquiries',
      color: 'bg-amber-50 border-amber-100',
      textColor: 'text-amber-600',
    },
  ]

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">
          대시보드
        </h1>
        <p className="text-sm text-gray-500 mt-1">Vini&apos;s Branding Lab 관리자 페이지에 오신 것을 환영합니다.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`group flex items-center gap-5 rounded-2xl border p-6 bg-white transition-all hover:-translate-y-0.5 hover:shadow-md ${stat.color}`}
          >
            <span className="text-3xl">{stat.icon}</span>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className={`text-3xl font-bold mt-0.5 ${stat.textColor}`}>{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-10">
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          새 글 작성
        </Link>
        <Link
          href="/admin/inquiries"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 hover:border-rose-300 text-gray-700 hover:text-rose-600 text-sm font-semibold rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          문의 확인
          {unreadCount > 0 && (
            <span className="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold bg-rose-500 text-white rounded-full">
              {unreadCount}
            </span>
          )}
        </Link>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">최근 포스트</h2>
          <Link href="/admin/posts" className="text-xs font-medium text-rose-500 hover:text-rose-700">
            전체 보기 →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">
            아직 게시된 포스트가 없습니다.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentPosts.map((post) => {
              const st = statusLabel[post.status || 'published'] || statusLabel.published
              return (
                <div key={post._id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.category || '카테고리 없음'} · {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('ko-KR') : '날짜 없음'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${st.cls}`}>
                    {st.label}
                  </span>
                  <Link
                    href={`/admin/posts/${post._id}/edit`}
                    className="shrink-0 text-xs font-medium text-gray-400 hover:text-rose-500 transition-colors"
                  >
                    수정
                  </Link>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
