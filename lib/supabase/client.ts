import { createBrowserClient } from '@supabase/ssr'

// TODO: Replace `any` with `Database` type once connected to Supabase:
// npx supabase gen types typescript --project-id <id> > types/supabase.ts
export function createClient() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return createBrowserClient<any>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
