import Link from 'next/link';

// NOTE: In a real app, this should match your MOCK_POSTS in page.tsx or come from a database.
const MOCK_POSTS = {
  "1": {
    title: "2026년 하반기 대기업 공채 트렌드 완벽 분석",
    content: `
      <p>채용 시장이 빠르게 변화하고 있습니다. 단순한 스펙 나열보다는 실질적인 직무 역량을 증명하는 것이 더욱 중요해졌습니다.</p>
      <h2>1. 직무 역량 중심의 자소서</h2>
      <p>경험을 나열하는 대신, 해당 경험을 통해 얻은 인사이트와 직무 관련성을 구체적으로 작성해야 합니다.</p>
      <h2>2. AI 면접 대비</h2>
      <p>AI 면접의 비중이 늘어나고 있습니다. 일관성 있는 답변과 긍정적인 표정을 유지하는 훈련이 필요합니다.</p>
    `,
    category: "취업정보",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop",
    date: "2026.04.20",
    author: "Vini"
  }
};

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Get post data or use a fallback if not found in our simple mock
  const post = MOCK_POSTS[resolvedParams.id as keyof typeof MOCK_POSTS] || {
    title: "상세 내용을 준비 중입니다.",
    content: "<p>요청하신 게시글의 상세 내용을 현재 준비 중입니다.</p>",
    category: "안내",
    imageUrl: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
    date: "2026.04.21",
    author: "Admin"
  };

  return (
    <article className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 max-w-4xl">
      <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-500 mb-8 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        목록으로 돌아가기
      </Link>

      <header className="mb-10 text-center">
        <div className="mb-4 text-sm font-semibold text-primary-600 tracking-wide uppercase">
          {post.category}
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-5xl mb-6">
          {post.title}
        </h1>
        <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
          <span>{post.author}</span>
          <span>•</span>
          <time dateTime={post.date}>{post.date}</time>
        </div>
      </header>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-gray-100 mb-12 shadow-lg">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div 
        className="prose prose-lg prose-pink mx-auto mb-16"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[250px]">
        <p className="text-sm font-medium text-gray-400 text-center">
          Google AdSense<br />(Post Bottom Advertisement)
        </p>
      </div>
    </article>
  );
}
