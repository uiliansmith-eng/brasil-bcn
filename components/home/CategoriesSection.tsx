import Link from 'next/link'
import { Briefcase, Building2, Calendar, Users, BookOpen, ShoppingBag, ArrowRight } from 'lucide-react'

const categories = [
  {
    icon: Briefcase,
    label: 'Empleo',
    description: 'Encuentra trabajo en Barcelona. Ofertas verificadas para brasileños.',
    href: '/empleos',
    count: '180+ ofertas',
    color: 'from-[#009C3B] to-[#00b847]',
    bgLight: 'bg-[#009C3B]/5 hover:bg-[#009C3B]/10',
    iconBg: 'bg-[#009C3B]/10',
    iconColor: 'text-[#009C3B]',
    featured: true,
  },
  {
    icon: Building2,
    label: 'Empresas',
    description: 'Directorio de empresas y negocios brasileños en Cataluña.',
    href: '/empresas',
    count: '320+ empresas',
    color: 'from-[#002776] to-[#003a99]',
    bgLight: 'bg-[#002776]/5 hover:bg-[#002776]/10',
    iconBg: 'bg-[#002776]/10',
    iconColor: 'text-[#002776]',
    featured: true,
  },
  {
    icon: Calendar,
    label: 'Eventos',
    description: 'Festas, meetups y eventos de la comunidad en Barcelona.',
    href: '/eventos',
    count: '45+ este mes',
    color: 'from-orange-500 to-orange-600',
    bgLight: 'bg-orange-50 hover:bg-orange-100',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    featured: false,
  },
  {
    icon: Users,
    label: 'Comunidad',
    description: 'Conecta con otros brasileños. Grupos, foros y ayuda mutua.',
    href: '/comunidad',
    count: '2.400+ membros',
    color: 'from-purple-500 to-purple-600',
    bgLight: 'bg-purple-50 hover:bg-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    featured: false,
  },
  {
    icon: BookOpen,
    label: 'Guía',
    description: 'NIE, empadronamiento, autónomos. Todo lo que necesitas saber.',
    href: '/guia',
    count: '50+ artículos',
    color: 'from-teal-500 to-teal-600',
    bgLight: 'bg-teal-50 hover:bg-teal-100',
    iconBg: 'bg-teal-100',
    iconColor: 'text-teal-600',
    featured: false,
  },
  {
    icon: ShoppingBag,
    label: 'Compra y Venta',
    description: 'Anuncios de particulares. Compra y vende en la comunidad.',
    href: '/anuncios',
    count: '95+ anuncios',
    color: 'from-rose-500 to-rose-600',
    bgLight: 'bg-rose-50 hover:bg-rose-100',
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-600',
    featured: false,
  },
]

export function CategoriesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-[#009C3B] font-semibold text-sm uppercase tracking-wider mb-3">
            Tudo em um só lugar
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight mb-4">
            Todo lo que necesitas
            <span className="block text-[#009C3B]">en un solo lugar</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Desde encontrar trabajo hasta conocer eventos. BrasilBCN es el punto de encuentro de la comunidad.
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className={`group relative rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${cat.featured ? 'ring-2 ring-[#009C3B] ring-offset-2' : ''}`}
              >
                {cat.featured && (
                  <div className={`absolute -top-3 left-6 bg-gradient-to-r ${cat.color} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}>
                    Popular
                  </div>
                )}

                <div className="flex items-start justify-between mb-5">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${cat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className={`w-7 h-7 ${cat.iconColor}`} />
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300 mt-1" />
                </div>

                <h3 className="text-xl font-black text-gray-900 mb-2">{cat.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{cat.description}</p>

                <div className={`inline-flex items-center gap-1.5 text-xs font-semibold ${cat.iconColor} ${cat.iconBg} px-3 py-1.5 rounded-full`}>
                  {cat.count}
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl bg-gradient-to-r ${cat.color} scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  )
}
