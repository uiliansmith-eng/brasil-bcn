'use server'

import { createClient } from '@/lib/supabase/server'

export async function trackStoreEventAction(companyId: string, eventType: string, sessionId?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  await supabase.from('store_analytics_events').insert({
    company_id: companyId,
    event_type: eventType,
    session_id: sessionId ?? null,
    user_id: user?.id ?? null,
  })
}
