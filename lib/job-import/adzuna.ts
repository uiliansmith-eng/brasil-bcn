export interface AdzunaJob {
  id: string
  title: string
  company: { display_name: string }
  location: { display_name: string; area: string[] }
  description: string
  salary_min?: number
  salary_max?: number
  created: string
  redirect_url: string
}

const SEARCH_LOCATIONS = ['Barcelona', 'Girona', 'Tarragona', 'Lleida']

function detectCity(area: string[]): string {
  const text = area.join(' ')
  if (/girona/i.test(text)) return 'Girona'
  if (/tarragona/i.test(text)) return 'Tarragona'
  if (/lleida/i.test(text)) return 'Lleida'
  return 'Barcelona'
}

export async function fetchAdzunaJobs(): Promise<AdzunaJob[]> {
  const appId = process.env.ADZUNA_APP_ID
  const appKey = process.env.ADZUNA_APP_KEY
  if (!appId || !appKey) {
    console.warn('[Adzuna] Missing credentials — skipping')
    return []
  }

  const seen = new Set<string>()
  const results: AdzunaJob[] = []

  for (const location of SEARCH_LOCATIONS) {
    for (let page = 1; page <= 2; page++) {
      try {
        const url = new URL(`https://api.adzuna.com/v1/api/jobs/es/search/${page}`)
        url.searchParams.set('app_id', appId)
        url.searchParams.set('app_key', appKey)
        url.searchParams.set('results_per_page', '50')
        url.searchParams.set('where', location)
        url.searchParams.set('distance', '20')
        url.searchParams.set('content-type', 'application/json')

        const res = await fetch(url.toString(), { cache: 'no-store' })
        if (!res.ok) break

        const data = await res.json() as { results?: AdzunaJob[] }
        if (!data.results?.length) break

        for (const job of data.results) {
          if (!seen.has(job.id)) {
            seen.add(job.id)
            results.push(job)
          }
        }
      } catch (e) {
        console.error(`[Adzuna] Error fetching page ${page} for ${location}:`, e)
        break
      }
    }
  }

  return results
}

export function mapAdzunaJob(job: AdzunaJob) {
  const city = detectCity(job.location?.area ?? [])
  const salaryMin = job.salary_min ? Math.round(job.salary_min / 12) : null
  const salaryMax = job.salary_max ? Math.round(job.salary_max / 12) : null

  return {
    source: 'adzuna' as const,
    external_id: job.id,
    source_url: job.redirect_url,
    title: job.title.slice(0, 100),
    description: job.description.slice(0, 5000),
    company_name: job.company?.display_name?.slice(0, 100) ?? null,
    city,
    salary_min: salaryMin,
    salary_max: salaryMax,
    created_at: job.created,
  }
}
