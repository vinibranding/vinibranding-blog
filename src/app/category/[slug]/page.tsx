import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSortedPostsData } from '@/lib/posts';
import PostCard from '@/components/PostCard';

const categoryNames: Record<string, string> = {
  branding: 'Branding Insight',
  career: 'Career Design',
  interview: 'InterviewMaster',
  contact: 'Contact',
};

const koreanMapping: Record<string, string> = {
  '브랜딩 인사이트': 'Branding Insight',
  '브랜딩인사이트': 'Branding Insight',
  '커리어': 'Career Design',
  '커리어 디자인': 'Career Design',
  '인터뷰 마스터': 'InterviewMaster',
  '인터뷰마스터': 'InterviewMaster',
  '콘택트': 'Contact',
  '문의': 'Contact',
};

export async function generateStaticParams() {
  return Object.keys(categoryNames).map((slug) => ({
    slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categoryName = categoryNames[slug];

  if (!categoryName) {
    notFound();
  }

  const allPosts = await getSortedPostsData();
  const filteredPosts = allPosts.filter((post) => {
    const postCat = post.category || '';
    const normalizedCat = koreanMapping[postCat] || postCat;
    return normalizedCat === categoryName || normalizedCat.toLowerCase() === slug;
  });

  return (
    <div className="w-full pb-20">
      <div className="mb-14 flex flex-col items-center text-center py-16 bg-white border-b border-gray-100">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl font-[family-name:var(--font-playfair)]">
          <span className="text-rose-600">{categoryName}</span>
        </h1>
        <p className="mt-4 text-gray-500 font-medium italic">
          {categoryName} 관련 아티클 모음
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4">
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400">아직 이 카테고리에 게시된 글이 없습니다.</p>
            <Link href="/" className="mt-6 inline-block text-rose-500 font-semibold hover:underline">
              홈으로 돌아가기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
