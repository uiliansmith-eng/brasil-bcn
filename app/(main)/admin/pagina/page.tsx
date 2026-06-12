import { getSettings } from '@/actions/settings'
import { PageSettingsForm } from './PageSettingsForm'

export default async function AdminPaginaPage() {
  const settings = await getSettings()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Configuración de la página</h1>
        <p className="text-gray-500 text-sm mt-1">Edita textos, secciones y colores de la homepage sin tocar código.</p>
      </div>
      <PageSettingsForm settings={settings} />
    </div>
  )
}
