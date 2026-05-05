'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'

const TipTapEditor = dynamic(() => import('@/components/admin/TipTapEditor'), { ssr: false })

const categories = [
  { label: 'Branding Insight', value: 'Branding Insight' },
  { label: 'Career Design', value: 'Career Design' },
  { label: 'InterviewMaster', value: 'InterviewMaster' },
]

const statusOptions = [
  { label: '발행됨', value: 'published' },
  { label: '초안', value: 'draft' },
  { label: '예약발행', value: 'scheduled' },
]

interface PostFormData {
  _id?: string
  title: string
  slug: string
  excerpt: string
  category: string
  status: string
  publishedAt: string
  scheduledAt: string
  author: string
  contentHtml: string
  imageUrl: string
}

interface PostFormProps {
  initialData?: Partial<PostFormData>
  isEdit?: boolean
}

function slugify(text: string) {
  // 간단한 한글 -> 영문 변환 (초성 중심 또는 간단 표기)
  const koreanMap: { [key: string]: string } = {
    'ㄱ': 'g', 'ㄴ': 'n', 'ㄷ': 'd', 'ㄹ': 'r', 'ㅁ': 'm', 'ㅂ': 'b', 'ㅅ': 's', 'ㅇ': '', 'ㅈ': 'j', 'ㅊ': 'ch', 'ㅋ': 'k', 'ㅌ': 't', 'ㅍ': 'p', 'ㅎ': 'h',
    'ㅏ': 'a', 'ㅑ': 'ya', 'ㅓ': 'eo', 'ㅕ': 'yeo', 'ㅗ': 'o', 'ㅛ': 'yo', 'ㅜ': 'u', 'ㅠ': 'yu', 'ㅡ': 'eu', 'ㅣ': 'i',
    'ㅐ': 'ae', 'ㅒ': 'yae', 'ㅔ': 'e', 'ㅖ': 'ye', 'ㅘ': 'wa', 'ㅙ': 'wae', 'ㅚ': 'oe', 'ㅝ': 'wo', 'ㅞ': 'we', 'ㅟ': 'wi', 'ㅢ': 'ui'
  };

  // 한글 음절을 분해하여 근사한 영문으로 변환 (완벽한 로마자 표기는 아니지만 URL용으로 적합)
  const transliterate = (str: string) => {
    return str.split('').map(char => {
      const code = char.charCodeAt(0) - 0xAC00;
      if (code > -1 && code < 11172) {
        const cho = Math.floor(code / 588);
        const jung = Math.floor((code % 588) / 28);
        const jong = code % 28;
        const choList = ['g', 'gg', 'n', 'd', 'dd', 'r', 'm', 'b', 'bb', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
        const jungList = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yo', 'yu', 'eu', 'ui', 'i'];
        const jongList = ['', 'g', 'gg', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'];
        return choList[cho] + jungList[jung] + jongList[jong];
      }
      return char;
    }).join('');
  };

  const latinText = transliterate(text);

  return latinText
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'post-' + Math.random().toString(36).slice(2, 7);
}

export default function PostForm({ initialData, isEdit = false }: PostFormProps) {
  const router = useRouter()
  const [form, setForm] = useState<PostFormData>({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    category: initialData?.category || categories[0].value,
    status: initialData?.status || 'published',
    publishedAt: initialData?.publishedAt ? initialData.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
    scheduledAt: initialData?.scheduledAt ? initialData.scheduledAt.slice(0, 16) : '',
    author: initialData?.author || '비니',
    contentHtml: initialData?.contentHtml || '',
    imageUrl: initialData?.imageUrl || '/images/default-post.jpg',
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setForm((f) => ({
      ...f,
      title,
      slug: isEdit ? f.slug : slugify(title),
    }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleContent = (html: string) => {
    setForm((f) => ({ ...f, contentHtml: html }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')
    
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.url) {
        setForm(f => ({ ...f, imageUrl: data.url }))
        setSuccess('이미지가 업로드되었습니다.')
      } else {
        throw new Error(data.error || '업로드 실패')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!form.title.trim()) { 
      setError('제목을 입력해주세요.')
      return 
    }

    let finalSlug = form.slug.trim()
    if (!finalSlug) {
      finalSlug = slugify(form.title)
      setForm(f => ({ ...f, slug: finalSlug }))
    }

    setSaving(true)
    try {
      const payload = {
        title: form.title,
        slug: finalSlug,
        excerpt: form.excerpt,
        category: form.category,
        status: form.status,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt).toISOString() : null,
        author: form.author,
        imageUrl: form.imageUrl,
        // TipTap HTML을 Sanity portable text로 변환하기 어려우므로 HTML 블록으로 저장
        content: [
          {
            _type: 'block',
            _key: 'content',
            style: 'normal',
            markDefs: [],
            children: [{ _type: 'span', _key: 'span1', text: form.contentHtml, marks: [] }],
          },
        ],
      }

      let res: Response
      if (isEdit && initialData?._id) {
        res = await fetch(`/api/admin/posts/${initialData._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      } else {
        res = await fetch('/api/admin/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || '저장에 실패했습니다.')
      }

      setSuccess(isEdit ? '포스트가 수정되었습니다.' : '포스트가 생성되었습니다.')
      setTimeout(() => router.push('/admin/posts'), 1200)
    } catch (err: any) {
      setError(err.message || '저장 중 오류가 발생했습니다.')
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-rose-400 transition-all text-gray-900'
  const labelCls = 'block text-sm font-semibold text-gray-700 mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {/* 제목 */}
      <div>
        <label className={labelCls} htmlFor="title">제목 *</label>
        <input
          id="title"
          name="title"
          type="text"
          value={form.title}
          onChange={handleTitleChange}
          placeholder="포스트 제목을 입력하세요"
          className={inputCls}
          required
        />
      </div>

      {/* 슬러그 */}
      <div>
        <label className={labelCls} htmlFor="slug">
          슬러그 (URL) *
          <span className="ml-2 text-xs font-normal text-gray-400">영문·숫자·하이픈만 사용 가능</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 shrink-0">/posts/</span>
          <input
            id="slug"
            name="slug"
            type="text"
            value={form.slug}
            onChange={handleChange}
            placeholder="자동 생성됨"
            className={`${inputCls} bg-gray-50`}
            readOnly
            required
          />
        </div>
      </div>

      {/* 카테고리 + 상태 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="category">카테고리</label>
          <select id="category" name="category" value={form.category} onChange={handleChange} className={inputCls}>
            {categories.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls} htmlFor="status">발행 상태</label>
          <select id="status" name="status" value={form.status} onChange={handleChange} className={inputCls}>
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 날짜 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls} htmlFor="publishedAt">발행 날짜</label>
          <input
            id="publishedAt"
            name="publishedAt"
            type="datetime-local"
            value={form.publishedAt}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls} htmlFor="scheduledAt">
            예약 발행 날짜
            <span className="ml-2 text-xs font-normal text-gray-400">상태: 예약발행 시 사용</span>
          </label>
          <input
            id="scheduledAt"
            name="scheduledAt"
            type="datetime-local"
            value={form.scheduledAt}
            onChange={handleChange}
            className={inputCls}
          />
        </div>
      </div>

      {/* 작성자 */}
      <div>
        <label className={labelCls} htmlFor="author">작성자</label>
        <input
          id="author"
          name="author"
          type="text"
          value={form.author}
          onChange={handleChange}
          className={inputCls}
        />
      </div>

      {/* 대표 이미지 */}
      <div>
        <label className={labelCls} htmlFor="imageUrl">대표 이미지 URL</label>
        <div className="flex gap-2">
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            value={form.imageUrl}
            onChange={handleChange}
            placeholder="이미지 URL을 입력하거나 파일을 업로드하세요"
            className={inputCls}
          />
          <label className="shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl cursor-pointer transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            {uploading ? '...' : '파일 선택'}
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </label>
        </div>
        {form.imageUrl && (
          <div className="mt-2 relative aspect-video w-32 overflow-hidden rounded-lg border border-gray-100">
            <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {/* 요약 */}
      <div>
        <label className={labelCls} htmlFor="excerpt">요약 (Excerpt)</label>
        <textarea
          id="excerpt"
          name="excerpt"
          value={form.excerpt}
          onChange={handleChange}
          rows={3}
          placeholder="포스트 카드에 표시될 짧은 요약문을 입력하세요."
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* 본문 에디터 */}
      <div>
        <label className={labelCls}>본문</label>
        <TipTapEditor
          content={form.contentHtml}
          onChange={handleContent}
          placeholder="여기에 본문 내용을 작성하세요..."
        />
      </div>

      {/* 메시지 */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {success}
        </div>
      )}

      {/* 버튼 */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          {saving ? (
            <>
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              저장 중...
            </>
          ) : isEdit ? '수정 저장' : '포스트 발행'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/posts')}
          className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 rounded-xl transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}
