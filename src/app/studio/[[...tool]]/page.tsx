'use client'

import dynamic from 'next/dynamic'

// Sanity Studio는 SSR 불가 — 클라이언트에서만 렌더링
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

// sanity.config도 dynamic import로 처리
export default function StudioPage() {
  if (typeof window === 'undefined') return null

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const config = require('../../../../sanity.config').default
  return <NextStudio config={config} />
}
