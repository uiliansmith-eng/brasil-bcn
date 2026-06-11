'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Briefcase, Building2, Calendar, BookOpen, ShoppingBag, Rocket } from 'lucide-react'
import { LangContext, translations, type Lang, type TKey } from '@/lib/auth-i18n'

const LANG_FLAGS: { lang: Lang; flag: string; label: string }[] = [
  { lang: 'pt', flag: '🇧🇷', label: 'PT' },
  { lang: 'es', flag: '🇪🇸', label: 'ES' },
  { lang: 'ca', flag: '🏴󠁥󠁳󠁣󠁴󠁿', label: 'CA' },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt')

  useEffect(() => {
    const stored = localStorage.getItem('brasil-bcn-lang') as Lang | null
    if (stored && stored in translations) setLangState(stored)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    localStorage.setItem('brasil-bcn-lang', l)
  }

  const t = (key: TKey) => translations[lang][key]

  const features = [
    { icon: Briefcase, key: 'layout_f1' as TKey },
    { icon: Building2, key: 'layout_f2' as TKey },
    { icon: Calendar, key: 'layout_f3' as TKey },
    { icon: BookOpen, key: 'layout_f4' as TKey },
    { icon: ShoppingBag, key: 'layout_f5' as TKey },
  ]

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      <div className="min-h-screen grid lg:grid-cols-2">

        {/* Left panel — branding */}
        <div className="hidden lg:flex flex-col relative overflow-hidden bg-[#002776]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#001a5c] via-[#002776] to-[#003a99]" />
          <div className="absolute -top-40 -right-20 w-96 h-96 bg-[#009C3B]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFDF00]/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col h-full p-12">
            {/* Logo */}
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Brasil BCN" className="h-14 w-auto rounded-2xl object-contain bg-white px-3 py-1.5" />
            </Link>

            {/* Main copy */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 mb-8">
                <span className="text-4xl" role="img" aria-label="Brasil">🇧🇷</span>
                <span className="text-4xl" role="img" aria-label="Barcelona">🏴󠁥󠁳󠁣󠁴󠁿</span>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight mb-4">
                {t('layout_heading').split(' ').slice(0, 3).join(' ')}
                <span className="block text-[#FFDF00]">
                  {t('layout_heading').split(' ').slice(3, 5).join(' ')}
                </span>
                <span className="block text-white/80 text-3xl font-bold">
                  {t('layout_heading').split(' ').slice(5).join(' ')}
                </span>
              </h2>
              <p className="text-blue-200 text-lg leading-relaxed mb-10">
                {t('layout_desc')}
              </p>

              <ul className="space-y-4">
                {features.map((f) => (
                  <li key={f.key} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                      <f.icon className="w-4 h-4 text-[#FFDF00]" />
                    </div>
                    <span className="text-blue-100 font-medium">{t(f.key)}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Launch badge */}
            <div className="bg-[#FFDF00]/10 border border-[#FFDF00]/30 rounded-2xl p-5">
              <div className="flex items-center gap-3">
                <Rocket className="w-5 h-5 text-[#FFDF00] shrink-0" />
                <p className="text-[#FFDF00] font-semibold text-sm leading-relaxed">
                  {t('layout_new')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col min-h-screen bg-white">
          {/* Top bar */}
          <div className="flex items-center justify-between p-6 border-b">
            <Link href="/">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Brasil BCN" className="h-12 w-auto rounded-xl object-contain" />
            </Link>

            {/* Language selector */}
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1">
              {LANG_FLAGS.map(({ lang: l, flag, label }) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    lang === l
                      ? 'bg-white shadow-sm text-gray-900'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span>{flag}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>

          <div className="p-6 text-center">
            <p className="text-gray-400 text-xs">
              © {new Date().getFullYear()} BrasilBCN ·{' '}
              <Link href="/privacidad" className="hover:text-gray-600">{t('layout_privacy')}</Link>
              {' · '}
              <Link href="/terminos" className="hover:text-gray-600">{t('layout_terms')}</Link>
            </p>
          </div>
        </div>

      </div>
    </LangContext.Provider>
  )
}
