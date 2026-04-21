import PostCard from "@/components/PostCard";

const MOCK_POSTS = [
  {
    id: "1",
    title: "2026년 하반기 대기업 공채 트렌드 완벽 분석",
    excerpt: "변화하는 채용 시장에서 살아남기 위한 필수 전략과 직무 역량 중심의 자소서 작성법을 알아봅니다.",
    category: "브랜딩 인사이트",
    imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.20",
  },
  {
    id: "2",
    title: "성공하는 사람들의 아침 루틴 5가지",
    excerpt: "하루의 시작을 어떻게 하느냐가 인생을 바꿉니다. 생산성을 200% 끌어올리는 효과적인 미라클 모닝 루틴.",
    category: "교육 소식",
    imageUrl: "https://images.unsplash.com/photo-1506784365847-bbad939e9335?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.18",
  },
  {
    id: "3",
    title: "비전공자도 한 달 만에 따는 빅데이터 분석기사",
    excerpt: "데이터 시대의 필수 스펙! 체계적인 공부 방법과 기출문제 분석으로 단기 합격하는 비법 공개.",
    category: "브랜딩 인사이트",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.15",
  },
  {
    id: "4",
    title: "면접관을 사로잡는 나만의 퍼스널 컬러와 비즈니스 캐주얼",
    excerpt: "첫인상이 합격을 좌우합니다. 신뢰감을 주는 색상 매치와 깔끔한 면접 복장 가이드라인.",
    category: "커리어 이미지",
    imageUrl: "https://images.unsplash.com/photo-1573164574572-cb89e39749b4?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.10",
  },
  {
    id: "5",
    title: "노션(Notion)으로 완벽한 포트폴리오 만들기",
    excerpt: "개발자, 디자이너, 마케터 모두에게 유용한 노션 포트폴리오 템플릿과 구성 팁을 소개합니다.",
    category: "브랜딩 인사이트",
    imageUrl: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.05",
  },
  {
    id: "6",
    title: "스타트업 vs 대기업, 나에게 맞는 회사는?",
    excerpt: "성향과 직업 가치관에 따른 기업 규모별 장단점 비교. 나의 커리어 패스에 맞는 선택은 무엇일까요?",
    category: "커리어 이미지",
    imageUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=800&auto=format&fit=crop",
    date: "2026.04.01",
  },
];

export default function Home() {
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
            {MOCK_POSTS.map((post) => (
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

          {/* 3. 구글 애드센스 (버튼 아래 배치) */}
          <div className="sticky top-28 rounded-2xl bg-gray-50 border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[400px]">
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
