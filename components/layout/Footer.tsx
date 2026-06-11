import Link from 'next/link'
import { Briefcase, Building2, Calendar, BookOpen, Users, ShoppingBag, MessageCircle, Mail, MapPin, Share2 } from 'lucide-react'

const footerLinks = {
  plataforma: [
    { label: 'Empleos', href: '/empleos', icon: Briefcase },
    { label: 'Empresas', href: '/empresas', icon: Building2 },
    { label: 'Eventos', href: '/eventos', icon: Calendar },
    { label: 'Comunidad', href: '/comunidad', icon: Users },
  ],
  recursos: [
    { label: 'Guía del Brasileño', href: '/guia', icon: BookOpen },
    { label: 'Compra y Venta', href: '/compraventa', icon: ShoppingBag },
    { label: 'Publicar Empleo', href: '/empleos/publicar', icon: Briefcase },
    { label: 'Registrar Empresa', href: '/empresas/registrar', icon: Building2 },
  ],
  legal: [
    { label: 'Términos de uso', href: '/terminos' },
    { label: 'Privacidad', href: '/privacidad' },
    { label: 'Cookies', href: '/cookies' },
    { label: 'Contacto', href: '/contacto' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-[#002776] text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Brasil BCN" className="h-14 w-auto object-contain bg-white rounded-xl px-3 py-1.5" />
            </Link>
            <p className="text-blue-200 text-sm leading-relaxed mb-6">
              La comunidad de referencia para brasileños en Barcelona y Cataluña.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/brasilbcn"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Instagram"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="https://wa.me/34600000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="mailto:hola@brasilbcn.com"
                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFDF00] mb-4">
              Plataforma
            </h3>
            <ul className="space-y-3">
              {footerLinks.plataforma.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm group"
                    >
                      <Icon className="w-4 h-4 text-blue-300 group-hover:text-[#009C3B] transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFDF00] mb-4">
              Recursos
            </h3>
            <ul className="space-y-3">
              {footerLinks.recursos.map((link) => {
                const Icon = link.icon
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm group"
                    >
                      <Icon className="w-4 h-4 text-blue-300 group-hover:text-[#009C3B] transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#FFDF00] mb-4">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-blue-200 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-blue-300 shrink-0" />
                <span>Barcelona, Cataluña, España</span>
              </li>
              <li>
                <a
                  href="mailto:hola@brasilbcn.com"
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                >
                  <Mail className="w-4 h-4 text-blue-300" />
                  hola@brasilbcn.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/34600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-200 hover:text-white transition-colors text-sm"
                >
                  <MessageCircle className="w-4 h-4 text-blue-300" />
                  WhatsApp
                </a>
              </li>
            </ul>

            {/* Flags */}
            <div className="mt-6 flex items-center gap-2">
              <span className="text-2xl" role="img" aria-label="Brasil">🇧🇷</span>
              <span className="text-blue-300 text-sm">+</span>
              <span className="text-2xl" role="img" aria-label="España">🇪🇸</span>
              <span className="text-blue-200 text-sm ml-1">Barcelona</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-blue-300 text-sm">
              © {new Date().getFullYear()} BrasilBCN. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-blue-300 hover:text-white text-sm transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
