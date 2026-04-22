import PostCard from "@/components/PostCard";
import { getSortedPostsData } from "@/lib/posts";

export default function Home() {
  const posts = getSortedPostsData();

  return (
    <div className="w-full pb-20">
      {/* Hero Section */}
      <div className="mb-14 flex flex-col items-center text-center py-16 bg-white border-b border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl font-[family-name:var(--font-playfair)]">
          Vini's <span className="text-rose-600">Branding Lab</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-gray-500 font-medium tracking-wide">
          개인의 잠재력을 발견하고 독보적인 커리어 가치로 브랜딩하는 전문 연구소
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main Content Area (Wide) */}
        <div className="lg:w-[70%]">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 font-[family-name:var(--font-playfair)] tracking-wide">
              <span className="w-1.5 h-6 bg-rose-400 rounded-sm inline-block"></span>
              Latest Insights
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        </div>
        
        {/* Sidebar Area */}
        <aside className="lg:w-[30%] space-y-8">
          
          {/* 1. 소개글 섹션 */}
          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.05)]">
            <h3 className="text-xl font-bold text-gray-900 mb-4 font-[family-name:var(--font-playfair)]">About Lab</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              안녕하세요, Vini입니다. 이 곳은 변화하는 커리어 시장 속에서 나만의 고유한 가치를 발굴하고, 이를 매력적인 브랜딩으로 연결하는 방법을 연구하고 나누는 공간입니다.
            </p>
            <a href="#" className="inline-flex items-center text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors">
              소개 자세히 보기
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* 2. 컨설팅 및 강의 문의 버튼 (인디핑크 테두리) */}
          <div className="space-y-4">
            <a href="#" className="group flex flex-col justify-center rounded-2xl border border-rose-200 bg-rose-50/40 p-5 text-center transition-all hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm">
              <span className="text-xs font-bold text-rose-500 tracking-widest mb-1.5 opacity-80 group-hover:opacity-100">PERSONAL BRANDING</span>
              <span className="text-lg font-bold text-gray-800 group-hover:text-gray-900">더빛날랩: 컨설팅 상담</span>
            </a>
            
            <a href="#" className="group flex flex-col justify-center rounded-2xl border border-rose-200 bg-rose-50/40 p-5 text-center transition-all hover:bg-rose-50 hover:border-rose-300 hover:shadow-sm">
              <span className="text-xs font-bold text-rose-500 tracking-widest mb-1.5 opacity-80 group-hover:opacity-100">CORPORATE LECTURE</span>
              <span className="text-lg font-bold text-gray-800 group-hover:text-gray-900">이룸HRD: 강의 문의</span>
            </a>
          </div>

          {/* 3. 구글 애드센스 (버튼 아래 배치) - 임시 숨김 처리 */}
          <div className="hidden sticky top-28 rounded-2xl bg-gray-50 border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-center">
              <span className="inline-flex items-center justify-center w-12 h-12 bg-gray-200 rounded-full mb-4 text-gray-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              </span>
              <p className="text-sm font-bold text-gray-500">Google AdSense</p>
              <p className="text-xs text-gray-400 mt-1 font-medium">(Sidebar Ad)</p>
            </div>
          </div>
          
        </aside>
      </div>
    </div>
  );
}
