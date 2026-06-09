'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  const getPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', page.toString())
    return `${pathname}?${params.toString()}`
  }

  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1
    if (currentPage <= 4) return i + 1
    if (currentPage >= totalPages - 3) return totalPages - 6 + i
    return currentPage - 3 + i
  })

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <Link
        href={getPageUrl(currentPage - 1)}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-xl border text-sm transition-all',
          currentPage <= 1
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:border-[#009C3B] hover:text-[#009C3B]'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={getPageUrl(page)}
          className={cn(
            'flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-medium transition-all',
            page === currentPage
              ? 'bg-[#009C3B] text-white border-[#009C3B]'
              : 'border-gray-200 text-gray-600 hover:border-[#009C3B] hover:text-[#009C3B]'
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={getPageUrl(currentPage + 1)}
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-xl border text-sm transition-all',
          currentPage >= totalPages
            ? 'pointer-events-none border-gray-100 text-gray-300'
            : 'border-gray-200 text-gray-600 hover:border-[#009C3B] hover:text-[#009C3B]'
        )}
      >
        <ChevronRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
