import type { Metadata } from 'next'
import { getAdminHomeBanners } from '@/actions/promotions'
import { HomeBannersManager } from '@/components/admin/HomeBannersManager'

export const metadata: Metadata = { title: 'Promociones — Admin' }

export default async function AdminPromocionesPage() {
  const banners = await getAdminHomeBanners()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Promociones</h1>
        <p className="text-gray-500 text-sm mt-1">Banners curados para la portada del sitio.</p>
      </div>

      <HomeBannersManager banners={banners} />
    </div>
  )
}
