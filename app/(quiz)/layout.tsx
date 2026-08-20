import Link from 'next/link'

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex flex-col">{children}</div>
      <footer className="py-4 text-center">
        <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
          Brasil<span className="text-[#009C3B] font-semibold">BCN</span> · a comunidade brasileira em Barcelona
        </Link>
      </footer>
    </div>
  )
}
