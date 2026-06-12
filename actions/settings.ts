'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createClient as createPublicClient } from '@supabase/supabase-js'
import { type SiteSettings, DEFAULT_SETTINGS } from '@/lib/settings-types'

export async function getSettings(): Promise<SiteSettings> {
  try {
    const supabase = createPublicClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data } = await supabase
      .from('site_settings')
      .select('hero, launch, brand, sections, maintenance_mode')
      .eq('id', 1)
      .single()

    if (!data) return DEFAULT_SETTINGS

    return {
      maintenance_mode: data.maintenance_mode ?? false,
      hero: { ...DEFAULT_SETTINGS.hero, ...(data.hero ?? {}) },
      launch: { ...DEFAULT_SETTINGS.launch, ...(data.launch ?? {}) },
      brand: { ...DEFAULT_SETTINGS.brand, ...(data.brand ?? {}) },
      sections: { ...DEFAULT_SETTINGS.sections, ...(data.sections ?? {}) },
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export async function updateSettings(
  section: 'hero' | 'launch' | 'brand' | 'sections',
  values: Partial<SiteSettings[typeof section]>
): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos' }

  const current = await getSettings()
  const merged = { ...current[section], ...values }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, [section]: merged, updated_at: new Date().toISOString() })

  if (error) return { error: error.message }

  revalidatePath('/')
  revalidatePath('/admin/pagina')
  return { error: null }
}

export async function toggleMaintenanceMode(enabled: boolean): Promise<{ error: string | null }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'No autenticado' }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Sin permisos' }

  const { error } = await supabase
    .from('site_settings')
    .upsert({ id: 1, maintenance_mode: enabled, updated_at: new Date().toISOString() })

  if (error) return { error: error.message }

  revalidatePath('/', 'layout')
  revalidatePath('/admin/pagina')
  return { error: null }
}
