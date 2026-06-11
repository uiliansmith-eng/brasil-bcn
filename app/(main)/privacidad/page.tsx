import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'

export const metadata: Metadata = {
  title: 'Política de privacidad — BrasilBCN',
  description: 'Cómo tratamos y protegemos tus datos personales en BrasilBCN',
}

export default function PrivacidadPage() {
  return (
    <LegalLayout
      title="Política de privacidad"
      subtitle="Cómo tratamos y protegemos tus datos personales"
      updated="10 de junio de 2026"
    >
      <p>
        En BrasilBCN nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política explica qué datos
        recopilamos, cómo los usamos y qué derechos tienes sobre ellos, de conformidad con el{' '}
        <strong>Reglamento General de Protección de Datos (RGPD)</strong> y la Ley Orgánica 3/2018 (LOPDGDD).
      </p>

      <h2>1. Responsable del tratamiento</h2>
      <ul>
        <li><strong>Nombre:</strong> BrasilBCN</li>
        <li><strong>Email:</strong> <a href="mailto:hola@brasilbcn.com">hola@brasilbcn.com</a></li>
        <li><strong>Ubicación:</strong> Barcelona, España</li>
      </ul>

      <h2>2. Datos que recopilamos</h2>

      <h3>Datos que nos proporcionas directamente</h3>
      <ul>
        <li>Nombre completo y dirección de email (al registrarte)</li>
        <li>Teléfono y WhatsApp (opcional, en tu perfil)</li>
        <li>Información biográfica y ciudad (opcional)</li>
        <li>Contenido que publicas: empleos, eventos, anuncios, etc.</li>
      </ul>

      <h3>Datos que recopilamos automáticamente</h3>
      <ul>
        <li>Dirección IP y datos del navegador (para seguridad y análisis)</li>
        <li>Páginas visitadas y acciones en la plataforma</li>
        <li>Cookies técnicas necesarias para el funcionamiento del servicio</li>
      </ul>

      <h2>3. Finalidad del tratamiento</h2>
      <p>Usamos tus datos para:</p>
      <ul>
        <li><strong>Gestión de cuenta:</strong> crear y mantener tu perfil de usuario</li>
        <li><strong>Prestación del servicio:</strong> publicar y moderar contenido</li>
        <li><strong>Comunicaciones transaccionales:</strong> confirmación de registro, recuperación de contraseña, avisos sobre tu contenido</li>
        <li><strong>Seguridad:</strong> prevenir fraudes y usos indebidos</li>
        <li><strong>Mejora del servicio:</strong> análisis de uso agregado y anónimo</li>
      </ul>

      <h2>4. Base legal del tratamiento</h2>
      <ul>
        <li><strong>Ejecución del contrato:</strong> para prestarte el servicio que solicitas</li>
        <li><strong>Consentimiento:</strong> para comunicaciones opcionales</li>
        <li><strong>Interés legítimo:</strong> para seguridad y mejora del servicio</li>
        <li><strong>Obligación legal:</strong> cuando sea requerido por ley</li>
      </ul>

      <h2>5. Proveedores de servicios (subencargados)</h2>
      <p>Trabajamos con proveedores que tratan datos en nuestro nombre:</p>
      <ul>
        <li><strong>Supabase</strong> — base de datos y autenticación (UE)</li>
        <li><strong>Vercel</strong> — alojamiento web (EE.UU., con garantías adecuadas)</li>
        <li><strong>Resend</strong> — envío de emails transaccionales (EE.UU., con garantías adecuadas)</li>
      </ul>
      <p>
        Todos los proveedores están sujetos a acuerdos de tratamiento de datos y ofrecen garantías adecuadas
        conforme al RGPD.
      </p>

      <h2>6. Conservación de datos</h2>
      <p>
        Conservamos tus datos mientras mantengas una cuenta activa. Si eliminas tu cuenta, tus datos personales
        serán anonimizados o eliminados en un plazo máximo de 30 días, salvo que la ley exija conservarlos más tiempo.
      </p>

      <h2>7. Tus derechos</h2>
      <p>Tienes derecho a:</p>
      <ul>
        <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
        <li><strong>Rectificación:</strong> corregir datos inexactos</li>
        <li><strong>Supresión:</strong> solicitar la eliminación de tus datos</li>
        <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
        <li><strong>Limitación:</strong> restringir el tratamiento en ciertos casos</li>
        <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo</li>
      </ul>
      <p>
        Para ejercer cualquiera de estos derechos, escríbenos a{' '}
        <a href="mailto:hola@brasilbcn.com">hola@brasilbcn.com</a>. Responderemos en un plazo máximo de 30 días.
        También tienes derecho a presentar una reclamación ante la{' '}
        <strong>Agencia Española de Protección de Datos (AEPD)</strong> en <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">aepd.es</a>.
      </p>

      <h2>8. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: cifrado en tránsito (HTTPS),
        contraseñas hasheadas, acceso restringido a datos personales y revisiones periódicas de seguridad.
      </p>

      <h2>9. Cambios en esta política</h2>
      <p>
        Podemos actualizar esta política de privacidad. Cuando los cambios sean significativos, te lo comunicaremos
        por email o mediante un aviso destacado en la plataforma.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta sobre privacidad: <a href="mailto:hola@brasilbcn.com">hola@brasilbcn.com</a>
      </p>
    </LegalLayout>
  )
}
