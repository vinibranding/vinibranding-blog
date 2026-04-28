import type { Metadata } from 'next'
import AdminSidebar from './AdminSidebar'

export const metadata: Metadata = {
  title: 'Admin — Vini\'s Branding Lab',
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-auto">
        {children}
      </main>
    </div>
  )
}
