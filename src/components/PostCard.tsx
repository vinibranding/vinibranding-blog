import Link from 'next/link';

interface PostCardProps {
  id: string;
  title: string;
  excerpt?: string;
  category: string;
  imageUrl: string;
  date: string;
}

export default function PostCard({ id, title, excerpt, category, imageUrl, date }: PostCardProps) {
  return (
    <Link href={`/posts/${id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all hover:-translate-y-1 hover:shadow-lg hover:ring-primary-300">
      <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary-600 backdrop-blur-sm">
          {category}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-x-4 text-xs text-gray-500">
          <time dateTime={date}>{date}</time>
        </div>
        <div className="group relative mt-3 flex-1">
          <h3 className="line-clamp-2 text-lg font-bold leading-tight text-gray-900 group-hover:text-primary-600">
            {title}
          </h3>
          {excerpt && (
            <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-gray-600">
              {excerpt}
            </p>
          )}
        </div>
        <div className="mt-6 flex items-center gap-x-2 text-sm font-medium text-primary-500">
          자세히 보기
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
