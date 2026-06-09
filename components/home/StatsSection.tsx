import { Briefcase, Building2, Calendar, BookOpen, ShoppingBag, Users } from 'lucide-react'

const benefits = [
  {
    icon: Briefcase,
    title: 'Empleos',
    description: 'Ofertas de trabajo publicadas por empresas y particulares para la comunidad brasileña en BCN.',
    color: 'text-[#009C3B]',
    bg: 'bg-[#009C3B]/10',
  },
  {
    icon: Building2,
    title: 'Empresas',
    description: 'Directorio de negocios y profesionales brasileños establecidos en Barcelona.',
    color: 'text-[#002776]',
    bg: 'bg-[#002776]/10',
  },
  {
    icon: Calendar,
    title: 'Eventos',
    description: 'Fiestas, encuentros culturales y actividades de la comunidade en Barcelona.',
    color: 'text-[#009C3B]',
    bg: 'bg-[#009C3B]/10',
  },
  {
    icon: BookOpen,
    title: 'Guía',
    description: 'Todo lo que necesitas saber para vivir y trabajar legalmente en España.',
    color: 'text-[#002776]',
    bg: 'bg-[#002776]/10',
  },
  {
    icon: ShoppingBag,
    title: 'Compra y Venta',
    description: 'Vende lo que no usas y compra de confianza dentro de la comunidade brasileña.',
    color: 'text-[#009C3B]',
    bg: 'bg-[#009C3B]/10',
  },
  {
    icon: Users,
    title: 'Comunidade',
    description: 'Grupos de WhatsApp, redes sociales y conexiones entre brasileños en BCN.',
    color: 'text-[#002776]',
    bg: 'bg-[#002776]/10',
  },
]

export function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-14">
          <p className="text-[#009C3B] font-semibold text-sm uppercase tracking-wider mb-3">
            Todo en un lugar
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Lo que encontrarás
            <span className="block text-[#002776]">en Brasil BCN</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div
                key={benefit.title}
                className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:border-[#009C3B]/30 hover:shadow-xl hover:shadow-green-50 transition-all duration-300"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${benefit.bg} mb-5`}>
                  <Icon className={`w-6 h-6 ${benefit.color}`} />
                </div>
                <p className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
                <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl bg-gradient-to-r from-[#009C3B] to-[#002776] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
