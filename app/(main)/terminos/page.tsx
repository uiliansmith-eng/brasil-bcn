import type { Metadata } from 'next'
import { LegalLayout } from '@/components/layout/LegalLayout'

export const metadata: Metadata = {
  title: 'Términos de uso — BrasilBCN',
  description: 'Condiciones de uso de la plataforma BrasilBCN',
}

export default function TerminosPage() {
  return (
    <LegalLayout
      title="Términos de uso"
      subtitle="Condiciones que rigen el uso de la plataforma BrasilBCN"
      updated="10 de junio de 2026"
    >
      <h2>1. Aceptación de los términos</h2>
      <p>
        Al acceder y utilizar BrasilBCN (<strong>brasilbcn.com</strong>), aceptas quedar vinculado por estos Términos de Uso.
        Si no estás de acuerdo con alguna parte de estos términos, no podrás utilizar el servicio.
      </p>

      <h2>2. Descripción del servicio</h2>
      <p>
        BrasilBCN es una plataforma comunitaria orientada a la comunidad brasileña en Barcelona y Cataluña. Ofrece:
      </p>
      <ul>
        <li>Publicación y búsqueda de ofertas de empleo</li>
        <li>Directorio de empresas y negocios brasileños</li>
        <li>Gestión y difusión de eventos comunitarios</li>
        <li>Guía de recursos para brasileños en Barcelona</li>
        <li>Tablón de anuncios de compra y venta</li>
      </ul>

      <h2>3. Registro de cuenta</h2>
      <p>
        Para publicar contenido debes crear una cuenta proporcionando información veraz y actualizada.
        Eres responsable de mantener la confidencialidad de tu contraseña y de todas las actividades realizadas desde tu cuenta.
        BrasilBCN se reserva el derecho de suspender cuentas que incumplan estas condiciones.
      </p>

      <h2>4. Contenido publicado por usuarios</h2>
      <p>
        Al publicar contenido en BrasilBCN, declaras que:
      </p>
      <ul>
        <li>Eres el autor o tienes los derechos necesarios para publicarlo</li>
        <li>El contenido es veraz, no engañoso ni fraudulento</li>
        <li>No vulnera derechos de terceros ni la legislación vigente</li>
        <li>No contiene spam, publicidad no autorizada ni contenido ofensivo</li>
      </ul>
      <p>
        Todo el contenido publicado está sujeto a revisión y moderación. Nos reservamos el derecho de rechazar
        o eliminar contenido que no cumpla con estas condiciones sin previo aviso.
      </p>

      <h2>5. Conducta prohibida</h2>
      <p>Queda expresamente prohibido:</p>
      <ul>
        <li>Publicar información falsa, engañosa o fraudulenta</li>
        <li>Acosar, amenazar o discriminar a otros usuarios</li>
        <li>Usar la plataforma para fines ilegales</li>
        <li>Intentar acceder a cuentas ajenas o sistemas de la plataforma</li>
        <li>Publicar contenido que infrinja derechos de autor o propiedad intelectual</li>
        <li>Enviar comunicaciones no solicitadas (spam)</li>
      </ul>

      <h2>6. Moderación de contenido</h2>
      <p>
        BrasilBCN modera el contenido publicado antes de su aprobación. Los tiempos de revisión habituales son
        inferiores a 24 horas en días laborables. El equipo de moderación puede rechazar cualquier publicación
        sin necesidad de justificación detallada si considera que no cumple los estándares de la comunidad.
      </p>

      <h2>7. Limitación de responsabilidad</h2>
      <p>
        BrasilBCN actúa como plataforma intermediaria y no es parte en las relaciones entre usuarios
        (empleadores/candidatos, compradores/vendedores, etc.). No garantizamos la veracidad del contenido
        publicado por terceros ni nos hacemos responsables de los daños derivados de dichas relaciones.
      </p>

      <h2>8. Propiedad intelectual</h2>
      <p>
        El diseño, logotipos, textos y software de BrasilBCN son propiedad de sus creadores y están protegidos
        por la legislación de propiedad intelectual. No está permitida su reproducción sin autorización expresa.
      </p>

      <h2>9. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos en cualquier momento. Los cambios significativos se comunicarán
        mediante aviso en la plataforma o por email. El uso continuado del servicio tras los cambios implica
        la aceptación de los nuevos términos.
      </p>

      <h2>10. Legislación aplicable</h2>
      <p>
        Estos términos se rigen por la legislación española. Para cualquier controversia, las partes se someten
        a los Juzgados y Tribunales de la ciudad de Barcelona, renunciando a cualquier otro fuero.
      </p>

      <h2>Contacto</h2>
      <p>
        Para cualquier consulta sobre estos términos, puedes escribirnos a{' '}
        <a href="mailto:hola@brasilbcn.com">hola@brasilbcn.com</a>.
      </p>
    </LegalLayout>
  )
}
