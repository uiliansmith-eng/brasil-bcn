import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchAdzunaJobs, mapAdzunaJob } from '@/lib/job-import/adzuna'
import { fetchJoobleJobs, mapJoobleJob } from '@/lib/job-import/jooble'
import { categorizeJob } from '@/lib/job-import/categorize'

const EXPIRES_IN_DAYS = 30

function expiresAt(): string {
  return new Date(Date.now() + EXPIRES_IN_DAYS * 86_400_000).toISOString()
}

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

type ImportedRow = {
  source: string
  external_id: string
  source_url: string
  title: string
  description: string
  company_name: string | null
  city: string
  salary_min: number | null
  salary_max: number | null
  created_at: string
}

async function upsertJobs(supabase: ReturnType<typeof serviceClient>, rows: ImportedRow[], source: string) {
  if (!rows.length) return { inserted: 0, errors: 0 }

  // Fetch all existing external_ids for this source in one query
  const externalIds = rows.map(r => r.external_id)
  const { data: existing } = await supabase
    .from('jobs')
    .select('external_id')
    .eq('source', source)
    .in('external_id', externalIds)

  const existingSet = new Set((existing ?? []).map((r: { external_id: string }) => r.external_id))
  const newRows = rows.filter(r => !existingSet.has(r.external_id))

  if (!newRows.length) return { inserted: 0, errors: 0 }

  let inserted = 0
  let errors = 0

  for (const row of newRows) {
    const { error } = await supabase.from('jobs').insert({
      source: row.source,
      external_id: row.external_id,
      source_url: row.source_url,
      title: row.title,
      description: row.description,
      company_name: row.company_name,
      category: categorizeJob(row.title, row.description),
      job_type: 'full_time',
      city: row.city,
      salary_min: row.salary_min,
      salary_max: row.salary_max,
      salary_visible: !!(row.salary_min || row.salary_max),
      is_active: true,
      is_approved: true,
      is_urgent: false,
      posted_by: null,
      expires_at: expiresAt(),
    })
    if (error) {
      console.error(`[import-jobs] ${source} insert error:`, error.message)
      errors++
    } else {
      inserted++
    }
  }

  return { inserted, errors }
}

export async function GET(request: Request) {
  // Verify cron secret
  const auth = request.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = serviceClient()
  const report: Record<string, unknown> = { timestamp: new Date().toISOString() }

  // ── Adzuna ──────────────────────────────────────────
  try {
    const raw = await fetchAdzunaJobs()
    const rows = raw.map(mapAdzunaJob)
    const { inserted, errors } = await upsertJobs(supabase, rows, 'adzuna')
    report.adzuna = { fetched: raw.length, inserted, errors }
  } catch (e) {
    report.adzuna = { error: e instanceof Error ? e.message : String(e) }
    console.error('[import-jobs] Adzuna failed:', e)
  }

  // ── Jooble ──────────────────────────────────────────
  try {
    const raw = await fetchJoobleJobs()
    const rows = raw.map(mapJoobleJob)
    const { inserted, errors } = await upsertJobs(supabase, rows, 'jooble')
    report.jooble = { fetched: raw.length, inserted, errors }
  } catch (e) {
    report.jooble = { error: e instanceof Error ? e.message : String(e) }
    console.error('[import-jobs] Jooble failed:', e)
  }

  // ── Cleanup expired imported jobs ───────────────────
  const { error: cleanErr } = await supabase
    .from('jobs')
    .update({ is_active: false })
    .in('source', ['adzuna', 'jooble'])
    .lt('expires_at', new Date().toISOString())

  if (cleanErr) console.error('[import-jobs] Cleanup error:', cleanErr.message)

  console.log('[import-jobs] Done:', JSON.stringify(report))
  return NextResponse.json(report)
}
