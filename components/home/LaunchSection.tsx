import Link from 'next/link'
import { Rocket, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { SiteSettings } from '@/lib/settings-types'

type LaunchProps = {
  settings?: SiteSettings['launch']
}

export function LaunchSection({ settings }: LaunchProps) {
  const s = settings ?? {
    title: 'Brasil BCN está comenzando 🇧🇷',
    description: 'Somos la plataforma más nueva de la comunidad. Publica tu empresa o tu oferta de trabajo de forma totalmente gratuita y crece con nosotros desde el inicio.',
    cta_text: 'Únete gratis',
    cta_href: '/auth/register',
  }

  return (
    <section className="py-14 bg-[#FFDF00]/5 border-y border-[#FFDF00]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#FFDF00] rounded-2xl flex items-center justify-center shrink-0">
              <Rocket className="w-7 h-7 text-[#002776]" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-xl">{s.title}</p>
              <p className="text-gray-600 text-sm mt-1 max-w-xl">
                {s.description}
              </p>
            </div>
          </div>
          <div className="shrink-0">
            <Link href={s.cta_href}>
              <Button className="bg-[#009C3B] hover:bg-[#007a2f] text-white font-bold px-6">
                {s.cta_text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
