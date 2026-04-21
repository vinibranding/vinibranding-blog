import { NextResponse } from 'next/server';

const MOCK_POSTS = [
  {
    id: "1",
    title: "2026년 하반기 대기업 공채 트렌드 완벽 분석",
    excerpt: "변화하는 채용 시장에서 살아남기 위한 필수 전략과 직무 역량 중심의 자소서 작성법을 알아봅니다.",
    date: "2026-04-20",
  },
  {
    id: "2",
    title: "성공하는 사람들의 아침 루틴 5가지",
    excerpt: "하루의 시작을 어떻게 하느냐가 인생을 바꿉니다. 생산성을 200% 끌어올리는 효과적인 미라클 모닝 루틴.",
    date: "2026-04-18",
  },
  {
    id: "3",
    title: "비전공자도 한 달 만에 따는 빅데이터 분석기사",
    excerpt: "데이터 시대의 필수 스펙! 체계적인 공부 방법과 기출문제 분석으로 단기 합격하는 비법 공개.",
    date: "2026-04-15",
  },
  {
    id: "4",
    title: "면접관을 사로잡는 나만의 퍼스널 컬러와 비즈니스 캐주얼",
    excerpt: "첫인상이 합격을 좌우합니다. 신뢰감을 주는 색상 매치와 깔끔한 면접 복장 가이드라인.",
    date: "2026-04-10",
  },
  {
    id: "5",
    title: "노션(Notion)으로 완벽한 포트폴리오 만들기",
    excerpt: "개발자, 디자이너, 마케터 모두에게 유용한 노션 포트폴리오 템플릿과 구성 팁을 소개합니다.",
    date: "2026-04-05",
  },
  {
    id: "6",
    title: "스타트업 vs 대기업, 나에게 맞는 회사는?",
    excerpt: "성향과 직업 가치관에 따른 기업 규모별 장단점 비교. 나의 커리어 패스에 맞는 선택은 무엇일까요?",
    date: "2026-04-01",
  },
];

export async function GET() {
  const baseUrl = 'https://vinibranding.com';
  
  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Vini's Branding Lab</title>
      <link>${baseUrl}</link>
      <description>개인의 잠재력을 발견하고 독보적인 커리어 가치로 브랜딩하는 전문 연구소</description>
      <language>ko</language>
      ${MOCK_POSTS.map((post) => `
        <item>
          <title><![CDATA[${post.title}]]></title>
          <link>${baseUrl}/post/${post.id}</link>
          <description><![CDATA[${post.excerpt}]]></description>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <guid>${baseUrl}/post/${post.id}</guid>
        </item>
      `).join('')}
    </channel>
  </rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}
