import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-[220px_1fr] gap-8">
          <AdminSidebar />
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  )
}
