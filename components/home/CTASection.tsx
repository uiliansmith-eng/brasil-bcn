import Link from 'next/link'
import { ArrowRight, CheckCircle2, Briefcase, Building2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

const benefits = [
  'Acceso gratuito a todas las ofertas de empleo',
  'Directorio de empresas y negocios brasileños',
  'Eventos y actividades de la comunidad',
  'Guía completa de trámites en España',
  'Compra y vende en la comunidad',
  'Red de contactos brasileños en BCN',
]

const actions = [
  {
    icon: Briefcase,
    title: 'Soy profesional',
    description: 'Busco trabajo o quiero publicar mi CV',
    href: '/auth/register?type=user',
    cta: 'Registrarme gratis',
    color: 'bg-[#009C3B] hover:bg-[#007a2f] text-white shadow-lg hover:shadow-green-200',
  },
  {
    icon: Building2,
    title: 'Tengo una empresa',
    description: 'Quiero publicar empleos o registrar mi negocio',
    href: '/auth/register?type=company',
    cta: 'Registrar empresa',
    color: 'bg-[#002776] hover:bg-[#001a5c] text-white shadow-lg hover:shadow-blue-200',
  },
]

export function CTASection() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main CTA card */}
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#002776] via-[#002776] to-[#001a5c]" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#009C3B]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#FFDF00]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative z-10 px-8 py-16 lg:px-16 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div>
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight mb-6">
                  Únete a la
                  <span className="block text-[#FFDF00]">comunidade</span>
                </h2>

                <p className="text-blue-200 text-lg leading-relaxed mb-8">
                  Regístrate gratis y accede a todo lo que BrasilBCN tiene para ofrecerte.
                </p>

                {/* Benefits list */}
                <ul className="space-y-3 mb-10">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#009C3B] shrink-0 mt-0.5" />
                      <span className="text-blue-100 text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-blue-300 text-sm">
                  100% gratis · Sin tarjeta de crédito · Cancela cuando quieras
                </p>
              </div>

              {/* Right: Action cards */}
              <div className="flex flex-col gap-5">
                {actions.map((action) => {
                  const Icon = action.icon
                  return (
                    <div
                      key={action.href}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{action.title}</h3>
                          <p className="text-blue-200 text-sm">{action.description}</p>
                        </div>
                      </div>
                      <Link href={action.href}>
                        <Button className={`w-full font-semibold transition-all duration-300 ${action.color}`}>
                          {action.cta}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  )
                })}

                {/* Already member */}
                <p className="text-center text-blue-300 text-sm">
                  ¿Ya tienes cuenta?{' '}
                  <Link href="/auth/login" className="text-white font-semibold hover:underline">
                    Inicia sesión
                  </Link>
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
