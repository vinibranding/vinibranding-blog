import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostData, getSortedPostsData } from '@/lib/posts';

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let post;
  try {
    post = await getPostData(resolvedParams.id);
  } catch (e) {
    notFound();
  }

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
        dangerouslySetInnerHTML={{ __html: post.contentHtml || "" }}
      />

      <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-100 p-6 flex flex-col items-center justify-center min-h-[250px]">
        <p className="text-sm font-medium text-gray-400 text-center">
          Google AdSense<br />(Post Bottom Advertisement)
        </p>
      </div>
    </article>
  );
}
