'use server'

import { createClient } from '@/lib/supabase/server'

export async function getCommunityStats() {
  const supabase = await createClient()

  const [
    { count: users },
    { count: companies },
    { count: jobs },
    { count: events },
    { count: guides },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', true),
    supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', true).gt('expires_at', new Date().toISOString()),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true).eq('is_approved', true).gte('date_start', new Date().toISOString()),
    supabase.from('guides').select('*', { count: 'exact', head: true }).eq('is_published', true),
  ])

  return {
    users: users ?? 0,
    companies: companies ?? 0,
    jobs: jobs ?? 0,
    events: events ?? 0,
    guides: guides ?? 0,
  }
}

export async function getRecentActivity() {
  const supabase = await createClient()

  const [{ data: jobs }, { data: events }] = await Promise.all([
    supabase
      .from('jobs')
      .select('id, title, category, job_type, city, created_at, company:companies(name, logo_url)')
      .eq('is_active', true)
      .eq('is_approved', true)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(4),
    supabase
      .from('events')
      .select('id, title, slug, category, city, date_start, image_url, is_free, price')
      .eq('is_active', true)
      .eq('is_approved', true)
      .gte('date_start', new Date().toISOString())
      .order('date_start', { ascending: true })
      .limit(3),
  ])

  return {
    jobs: jobs ?? [],
    events: events ?? [],
  }
}
