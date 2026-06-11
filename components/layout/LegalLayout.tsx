import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface LegalLayoutProps {
  title: string
  subtitle: string
  updated: string
  children: React.ReactNode
}

export function LegalLayout({ title, subtitle, updated, children }: LegalLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#002776] text-white py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <h1 className="text-3xl font-black">{title}</h1>
          <p className="text-blue-200 mt-2">{subtitle}</p>
          <p className="text-blue-300 text-xs mt-3">Última actualización: {updated}</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 sm:p-10 prose prose-gray prose-sm max-w-none
          prose-headings:font-bold prose-headings:text-gray-900
          prose-h2:text-lg prose-h2:mt-8 prose-h2:mb-3
          prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
          prose-p:text-gray-600 prose-p:leading-relaxed
          prose-li:text-gray-600
          prose-a:text-[#009C3B] prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-800
        ">
          {children}
        </div>
      </div>
    </div>
  )
}
