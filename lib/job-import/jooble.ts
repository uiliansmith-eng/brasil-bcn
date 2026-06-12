import { parseSalaryString } from './categorize'

export interface JoobleJob {
  title: string
  company: string
  location: string
  salary: string
  snippet: string
  link: string
  updated: string
  id?: string
}

const KEYWORDS = ['trabajo Barcelona', 'empleo Barcelona', 'trabajo Cataluña', 'trabajo Girona']

function detectCity(location: string): string {
  if (/girona/i.test(location)) return 'Girona'
  if (/tarragona/i.test(location)) return 'Tarragona'
  if (/lleida/i.test(location)) return 'Lleida'
  return 'Barcelona'
}

function stableId(job: JoobleJob): string {
  return job.id ?? Buffer.from(job.link).toString('base64').slice(0, 40)
}

export async function fetchJoobleJobs(): Promise<JoobleJob[]> {
  const apiKey = process.env.JOOBLE_API_KEY
  if (!apiKey) {
    console.warn('[Jooble] Missing API key — skipping')
    return []
  }

  const seen = new Set<string>()
  const results: JoobleJob[] = []

  for (const keyword of KEYWORDS) {
    try {
      const res = await fetch(`https://jooble.org/api/${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords: keyword, location: 'Barcelona, España', page: 1, resultonpage: 25 }),
        cache: 'no-store',
      })
      if (!res.ok) continue

      const data = await res.json() as { jobs?: JoobleJob[] }
      for (const job of data.jobs ?? []) {
        const id = stableId(job)
        if (!seen.has(id)) {
          seen.add(id)
          results.push({ ...job, id })
        }
      }
    } catch (e) {
      console.error(`[Jooble] Error fetching keyword "${keyword}":`, e)
    }
  }

  return results
}

export function mapJoobleJob(job: JoobleJob) {
  const { min, max } = parseSalaryString(job.salary ?? '')
  return {
    source: 'jooble' as const,
    external_id: stableId(job),
    source_url: job.link,
    title: (job.title ?? '').slice(0, 100),
    description: (job.snippet ?? '').slice(0, 5000),
    company_name: (job.company ?? '').slice(0, 100) || null,
    city: detectCity(job.location ?? ''),
    salary_min: min,
    salary_max: max,
    created_at: job.updated ?? new Date().toISOString(),
  }
}

