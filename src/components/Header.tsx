import Link from 'next/link';

const categories = [
  { name: 'Branding Insight', href: '/category/branding' },
  { name: 'Career Design', href: '/category/career' },
  { name: 'InterviewMaster', href: '/category/interview' },
  { name: 'Contact', href: '/category/contact' },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold tracking-tight text-primary-500 font-[family-name:var(--font-playfair)]">
            Vini's <span className="text-gray-900">Branding Lab</span>
          </Link>
        </div>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {categories.map((category) => (
              <li key={category.name}>
                <Link
                  href={category.href}
                  className="text-sm font-medium text-gray-600 transition-colors hover:text-primary-500"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Mobile menu button could go here */}
        <div className="md:hidden">
          <button className="text-gray-500 hover:text-primary-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
