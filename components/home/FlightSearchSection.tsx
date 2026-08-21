import { Plane } from 'lucide-react'
import { FlightSearchWidget } from '@/components/shared/FlightSearchWidget'

export function FlightSearchSection() {
  return (
    <section className="py-10 sm:py-12 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#009C3B]/10 flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5 text-[#009C3B]" />
            </div>
            <div>
              <h2 className="font-black text-gray-900 text-lg sm:text-xl leading-tight">
                Passagens Brasil ↔ Barcelona
              </h2>
              <p className="text-gray-500 text-sm">Compare preços de voos direto aqui</p>
            </div>
          </div>

          <FlightSearchWidget />
        </div>
      </div>
    </section>
  )
}
