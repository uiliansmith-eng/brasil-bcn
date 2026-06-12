import type { JobCategory } from '@/types'

const RULES: [RegExp, JobCategory][] = [
  [/hostel|camarero|camarera|cocinero|chef|hotel|restaurante|barista|\bcafé\b|\bcafe\b|cocina|gastronomía|bar\b|maitre|sommelier|pastelero/i, 'hosteleria'],
  [/construc|albañil|electricist|fontaner|\bobra\b|carpinter|pintor|soldador|instalador|aparejador|arquitecto|paleta|mantenimiento|reformas/i, 'construccion'],
  [/limpieza|limpiador|cleaning|conserje|aseo|governanta|housekeeper|portero|jardinero/i, 'limpieza'],
  [/peluquer|estétic|beauty|nail\b|spa\b|esteticist|estilis|manicur|depilación|masajista|cosmetolog/i, 'belleza'],
  [/transport|conductor|repartidor|chofer|chófer|logístic|delivery|mensajer|camionero|taxista|motoboy|courrier/i, 'transporte'],
  [/tienda|comercial|ventas|retail|dependient|cajero|vendedor|jefe de ventas|store|promotor/i, 'comercio'],
  [/programad|developer|software|informátic|tecnolog|\bweb\b|full.?stack|frontend|backend|devops|cloud|datos|data|IT\b|ciberseg|QA\b|scrum/i, 'tecnologia'],
  [/profesor|docente|educación|teacher|monitor|formador|instructor|tutor|academia|apoyo escolar|pedagog/i, 'educacion'],
  [/médico|enfermero|farmacia|salud|sanitario|clínica|hospital|auxiliar|cuidador|terapeut|dentist|fisio|óptico|psicolog/i, 'salud'],
  [/administrat|recepción|oficina|secretar|contabilidad|recursos humanos|\bRRHH\b|asistente|auxiliar administrativo|facturación|contable/i, 'administracion'],
]

export function categorizeJob(title: string, description = ''): JobCategory {
  const text = `${title} ${description}`
  for (const [regex, category] of RULES) {
    if (regex.test(text)) return category
  }
  return 'otro'
}

export function parseSalaryString(raw: string): { min: number | null; max: number | null } {
  if (!raw) return { min: null, max: null }
  const nums = raw.match(/\d[\d.,]*/g)?.map(n => parseFloat(n.replace(/[.,]/g, (m, i, s) =>
    s.indexOf(',') > s.indexOf('.') ? (m === '.' ? '' : '.') : (m === ',' ? '.' : '')
  ))) ?? []
  if (!nums.length) return { min: null, max: null }
  // Convert annual to monthly if values look annual (> 12 000)
  const monthly = nums.map(n => n > 12_000 ? Math.round(n / 12) : Math.round(n))
  return { min: monthly[0] ?? null, max: monthly[1] ?? monthly[0] ?? null }
}
