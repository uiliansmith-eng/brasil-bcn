import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de cookies — BrasilBCN',
  description: 'Información sobre el uso de cookies en BrasilBCN',
}

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Política de cookies"
      subtitle="Qué cookies usamos y para qué"
      updated="10 de junio de 2026"
    >
      <p>
        Esta política explica qué son las cookies, cuáles utilizamos en BrasilBCN y cómo puedes gestionarlas,
        de conformidad con la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI) y el RGPD.
      </p>

      <h2>¿Qué son las cookies?</h2>
      <p>
        Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas.
        Permiten que el sitio recuerde tus preferencias y te ofrezca una experiencia más personalizada.
      </p>

      <h2>Cookies que utilizamos</h2>

      <h3>Cookies estrictamente necesarias</h3>
      <p>
        Son imprescindibles para el funcionamiento del servicio. Sin ellas no podrías iniciar sesión ni usar
        las funcionalidades básicas de la plataforma. No requieren tu consentimiento.
      </p>
      <ul>
        <li><strong>sb-*</strong> (Supabase) — gestión de sesión de usuario y autenticación. Duración: sesión / 1 año.</li>
      </ul>

      <h3>Cookies de preferencias</h3>
      <p>
        Recuerdan tus configuraciones para mejorar tu experiencia.
      </p>
      <ul>
        <li><strong>brasil-bcn-lang</strong> — guarda el idioma seleccionado en las páginas de acceso (PT, ES, CA). Almacenada en localStorage. Duración: indefinida.</li>
      </ul>

      <h3>Cookies analíticas</h3>
      <p>
        Actualmente BrasilBCN <strong>no utiliza cookies analíticas ni de seguimiento</strong> de terceros
        (como Google Analytics). Podríamos incorporarlas en el futuro, en cuyo caso actualizaremos esta política
        y solicitaremos tu consentimiento.
      </p>

      <h3>Cookies de publicidad</h3>
      <p>
        BrasilBCN <strong>no utiliza cookies publicitarias</strong>.
      </p>

      <h2>Cookies de terceros</h2>
      <p>
        Algunos servicios integrados en la plataforma pueden establecer sus propias cookies:
      </p>
      <ul>
        <li><strong>Supabase</strong> — proveedor de autenticación y base de datos</li>
        <li><strong>Vercel</strong> — plataforma de alojamiento (cookies técnicas de rendimiento)</li>
      </ul>

      <h2>Cómo gestionar las cookies</h2>
      <p>
        Puedes configurar tu navegador para bloquear o eliminar cookies. Ten en cuenta que si bloqueas las
        cookies necesarias, algunas funcionalidades de la plataforma podrían no funcionar correctamente.
      </p>
      <ul>
        <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
        <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
        <li><strong>Safari:</strong> Preferencias → Privacidad → Cookies</li>
        <li><strong>Edge:</strong> Configuración → Privacidad → Cookies</li>
      </ul>

      <h2>Cambios en esta política</h2>
      <p>
        Si modificamos el uso de cookies de forma significativa, actualizaremos esta página y, si es necesario,
        volveremos a solicitar tu consentimiento.
      </p>

      <h2>Contacto</h2>
      <p>
        Para consultas sobre el uso de cookies:{' '}
        <a href="mailto:hola@brasilbcn.com">hola@brasilbcn.com</a>
      </p>
    </LegalLayout>
  )
}
