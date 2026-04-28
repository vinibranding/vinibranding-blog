'use client'

import { useState, useEffect, useCallback } from 'react'

interface Inquiry {
  _id: string
  name: string
  email: string
  phone?: string
  type: string
  message: string
  isRead: boolean
  createdAt: string
}

const typeLabel: Record<string, string> = {
  consulting: '1:1 컨설팅',
  collaboration: '출강/협업 제안',
  other: '기타',
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all')

  const fetchInquiries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/inquiries')
      const data = await res.json()
      setInquiries(data.inquiries || [])
    } catch {
      setInquiries([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchInquiries() }, [fetchInquiries])

  const handleRead = async (id: string, isRead: boolean) => {
    await fetch('/api/admin/inquiries', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, isRead }),
    })
    setInquiries((prev) =>
      prev.map((inq) => (inq._id === id ? { ...inq, isRead } : inq))
    )
    if (selected?._id === id) setSelected((s) => s ? { ...s, isRead } : null)
  }

  const handleOpen = (inq: Inquiry) => {
    setSelected(inq)
    if (!inq.isRead) handleRead(inq._id, true)
  }

  const filtered = inquiries.filter((inq) => {
    if (filter === 'unread') return !inq.isRead
    if (filter === 'read') return inq.isRead
    return true
  })

  const unreadCount = inquiries.filter((i) => !i.isRead).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-playfair)]">문의 관리</h1>
          <p className="text-sm text-gray-500 mt-1">
            총 {inquiries.length}건
            {unreadCount > 0 && <span className="ml-2 text-rose-500 font-semibold">미확인 {unreadCount}건</span>}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {f === 'all' ? '전체' : f === 'unread' ? '미확인' : '확인됨'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* 목록 */}
        <div className={`${selected ? 'w-1/2' : 'w-full'} transition-all`}>
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
                {filter === 'unread' ? '미확인 문의가 없습니다.' : '문의 내역이 없습니다.'}
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">이름</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">유형</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">이메일</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">날짜</th>
                    <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">보기</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((inq) => (
                    <tr
                      key={inq._id}
                      onClick={() => handleOpen(inq)}
                      className={`cursor-pointer transition-colors ${
                        selected?._id === inq._id
                          ? 'bg-rose-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="px-5 py-4">
                        <span className={`inline-block w-2 h-2 rounded-full ${inq.isRead ? 'bg-gray-300' : 'bg-rose-500'}`} />
                      </td>
                      <td className="px-4 py-4">
                        <p className={`font-semibold ${inq.isRead ? 'text-gray-500' : 'text-gray-900'}`}>
                          {inq.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 sm:hidden">{typeLabel[inq.type] || inq.type}</p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600">
                          {typeLabel[inq.type] || inq.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-xs text-gray-500 hidden md:table-cell">{inq.email}</td>
                      <td className="px-4 py-4 text-xs text-gray-400 hidden lg:table-cell">
                        {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString('ko-KR') : '—'}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleRead(inq._id, !inq.isRead) }}
                          className="text-xs text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          {inq.isRead ? '미확인으로' : '확인'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 상세 패널 */}
        {selected && (
          <div className="w-1/2 shrink-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-8">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-gray-900">{selected.name}</h2>
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 mt-1.5 inline-block">
                    {typeLabel[selected.type] || selected.type}
                  </span>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <dl className="space-y-3 text-sm mb-6">
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-gray-400 font-medium">이메일</dt>
                  <dd className="text-gray-700">
                    <a href={`mailto:${selected.email}`} className="hover:text-rose-500 transition-colors">
                      {selected.email}
                    </a>
                  </dd>
                </div>
                {selected.phone && (
                  <div className="flex gap-3">
                    <dt className="w-16 shrink-0 text-gray-400 font-medium">연락처</dt>
                    <dd className="text-gray-700">{selected.phone}</dd>
                  </div>
                )}
                <div className="flex gap-3">
                  <dt className="w-16 shrink-0 text-gray-400 font-medium">접수일</dt>
                  <dd className="text-gray-700">
                    {selected.createdAt ? new Date(selected.createdAt).toLocaleString('ko-KR') : '—'}
                  </dd>
                </div>
              </dl>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 mb-2">문의 내용</p>
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
              </div>

              <div className="mt-5 flex gap-2">
                <a
                  href={`mailto:${selected.email}`}
                  className="flex-1 text-center py-2.5 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
                >
                  이메일 답장
                </a>
                <button
                  onClick={() => handleRead(selected._id, !selected.isRead)}
                  className="flex-1 py-2.5 text-sm font-semibold border border-gray-200 hover:border-gray-300 text-gray-600 rounded-xl transition-colors"
                >
                  {selected.isRead ? '미확인으로 변경' : '확인 처리'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
