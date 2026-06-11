'use client'

import { useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'

const PATHS = [
  {
    key: 'turismo',
    icon: '✈️',
    title: 'Turismo',
    desc: 'Estoy de visita o de paso',
    color: 'border-sky-200 bg-sky-50 hover:bg-sky-100',
    selectedColor: 'border-sky-400 bg-sky-50',
    explanation: 'Llegaste a España sin un visado de larga duración, acogido al acuerdo de exención de visados entre Brasil y el espacio Schengen.',
    whenApplies: 'Cuando vienes a explorar, hacer turismo o valorar si quieres quedarte, sin un permiso específico de residencia o trabajo.',
    nextSteps: [
      'Puedes permanecer hasta 90 días en el espacio Schengen dentro de cada período de 180 días.',
      'Si decides quedarte más tiempo, necesitarás iniciar un trámite de regularización antes de que venza ese plazo.',
      'Consulta con un abogado especializado en extranjería para conocer las opciones disponibles según tu situación.',
    ],
    warning: 'Este artículo es orientativo. No determina tu situación legal ni reemplaza el asesoramiento de un profesional.',
  },
  {
    key: 'estudiante',
    icon: '🎓',
    title: 'Estudios',
    desc: 'Tengo visa o permiso de estudios',
    color: 'border-violet-200 bg-violet-50 hover:bg-violet-100',
    selectedColor: 'border-violet-400 bg-violet-50',
    explanation: 'Tienes una visa de larga duración o permiso de residencia que te autoriza a vivir en España durante el período de tu formación.',
    whenApplies: 'Si tienes una carta de admisión en una universidad, escuela de idiomas, máster u otro centro de formación reconocido.',
    nextSteps: [
      'Solicita la TIE (Tarjeta de Identidad de Extranjero) una vez en España.',
      'Empadróname en Barcelona en cuanto tengas dirección fija.',
      'Abre una cuenta bancaria para gestionar pagos y becas.',
      'Si quieres trabajar a tiempo parcial, verifica si tu permiso lo permite.',
    ],
    warning: 'Los requisitos y procedimientos pueden variar. Consulta siempre con tu universidad o un especialista en extranjería.',
  },
  {
    key: 'trabajo',
    icon: '💼',
    title: 'Trabajo',
    desc: 'Tengo contrato o permiso laboral',
    color: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100',
    selectedColor: 'border-emerald-400 bg-emerald-50',
    explanation: 'Tienes un contrato de trabajo en España y los permisos necesarios para trabajar legalmente, ya sea porque los tramitaste antes de llegar o estás en proceso de obtenerlos.',
    whenApplies: 'Si una empresa española te ha contratado y has tramitado el visado de trabajo, o si estás en un proceso de regularización por arraigo laboral.',
    nextSteps: [
      'Solicita la TIE (Tarjeta de Identidad de Extranjero) si no la tienes.',
      'Consigue tu número de la Seguridad Social para poder cotizar.',
      'Empadrómate en Barcelona si aún no lo has hecho.',
      'Abre una cuenta bancaria española para recibir tu nómina.',
    ],
    warning: 'Las autorizaciones de trabajo tienen condiciones específicas. Consulta con un especialista si tienes dudas sobre tu permiso.',
  },
  {
    key: 'familiar_ue',
    icon: '👨‍👩‍👧',
    title: 'Familiar de UE',
    desc: 'Familiar de ciudadano europeo',
    color: 'border-amber-200 bg-amber-50 hover:bg-amber-100',
    selectedColor: 'border-amber-400 bg-amber-50',
    explanation: 'Eres cónyuge, hijo, ascendiente u otro familiar dependiente de una persona con ciudadanía de un país de la Unión Europea que reside en España.',
    whenApplies: 'Cuando el familiar europeo ya reside legalmente en España y quieres reagruparte con él o ella.',
    nextSteps: [
      'Solicita la Tarjeta de Residencia de Familiar de Ciudadano de la UE (es un trámite diferente al permiso de residencia ordinario).',
      'Empadrómate en Barcelona en cuanto tengas dirección.',
      'Abre una cuenta bancaria y organiza el resto de tu documentación.',
    ],
    warning: 'Este trámite tiene particularidades propias. Consulta con un abogado de extranjería para asegurarte de seguir el proceso correcto.',
  },
  {
    key: 'emprendedor',
    icon: '🚀',
    title: 'Emprendedor',
    desc: 'Quiero montar un negocio en España',
    color: 'border-orange-200 bg-orange-50 hover:bg-orange-100',
    selectedColor: 'border-orange-400 bg-orange-50',
    explanation: 'Tienes un proyecto empresarial o quieres establecerte como autónomo en España.',
    whenApplies: 'Si quieres crear una empresa, trabajar como freelance o desarrollar un proyecto propio en España de forma legal.',
    nextSteps: [
      'Estudia las opciones de visado: visado de emprendedor o autorización de residencia por cuenta propia.',
      'Consulta con una gestoría o asesoría especializada en autónomos y extranjería.',
      'Ten en cuenta los requisitos económicos y de plan de negocio que suelen exigirse.',
    ],
    warning: 'Los requisitos para emprender en España como no comunitario son específicos. Es muy recomendable contar con asesoramiento profesional.',
  },
  {
    key: 'nomada',
    icon: '💻',
    title: 'Nómada Digital',
    desc: 'Trabajo remoto para empresa extranjera',
    color: 'border-teal-200 bg-teal-50 hover:bg-teal-100',
    selectedColor: 'border-teal-400 bg-teal-50',
    explanation: 'Tu fuente de ingresos principal proviene de trabajar de forma remota para empresas o clientes fuera de España, y quieres vivir en el país.',
    whenApplies: 'Si eres freelance remoto, trabajas para una empresa internacional o tienes clientes en el extranjero y quieres residir en España.',
    nextSteps: [
      'España tiene una Visa de Nómada Digital disponible desde 2023.',
      'Infórmate sobre los requisitos de ingresos mínimos y la documentación necesaria.',
      'Consulta con un gestor o asesoría especializada en extranjería para iniciar el trámite correctamente.',
    ],
    warning: 'Los requisitos y condiciones de este visado pueden actualizarse. Verifica siempre en fuentes oficiales o con un especialista.',
  },
  {
    key: 'otros',
    icon: '🔹',
    title: 'Otros',
    desc: 'Mi situación es diferente',
    color: 'border-gray-200 bg-gray-50 hover:bg-gray-100',
    selectedColor: 'border-gray-400 bg-gray-50',
    explanation: 'Tu situación no encaja claramente en ninguna de las categorías anteriores: reagrupación familiar, proceso de regularización, situación mixta u otras circunstancias.',
    whenApplies: 'Cuando llegas en una situación migratoria compleja, no tienes claro qué permiso tienes o estás en proceso de regularización.',
    nextSteps: [
      'Consulta con una asesoría especializada en extranjería o con una entidad de apoyo a migrantes.',
      'En Barcelona existen organizaciones que ofrecen orientación jurídica gratuita o a bajo coste.',
      'No tomes decisiones importantes sobre tu situación sin información fiable de un profesional.',
    ],
    warning: 'Las situaciones migratorias complejas requieren asesoramiento personalizado. Este artículo solo ofrece orientación general.',
  },
] as const

type PathKey = typeof PATHS[number]['key']

export function RouteDecisionCards() {
  const [selected, setSelected] = useState<PathKey | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem('ruta_situacion') as PathKey | null
    if (s) setSelected(s)
    setMounted(true)
  }, [])

  function handleSelect(key: PathKey) {
    setSelected(key)
    localStorage.setItem('ruta_situacion', key)
  }

  const selectedPath = PATHS.find(p => p.key === selected)

  return (
    <div>
      <p className="text-sm text-gray-600 font-medium mb-3">
        ¿Cuál describe mejor tu situación actual?
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {PATHS.map((p) => (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className={`
              relative p-3 rounded-xl border-2 text-left transition-all duration-200
              ${selected === p.key ? p.selectedColor + ' ring-2 ring-[#002776] ring-offset-1' : p.color}
            `}
          >
            {selected === p.key && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#002776] rounded-full flex items-center justify-center text-white text-[10px] font-bold">✓</span>
            )}
            <div className="text-2xl mb-1">{p.icon}</div>
            <p className="font-bold text-gray-900 text-xs leading-tight">{p.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-tight">{p.desc}</p>
          </button>
        ))}
      </div>

      {mounted && selectedPath && (
        <div className="mt-4 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl">{selectedPath.icon}</span>
            <p className="font-black text-gray-900 text-sm">{selectedPath.title}</p>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-3">{selectedPath.explanation}</p>

          <div className="mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">¿Cuándo aplica?</p>
            <p className="text-gray-600 text-sm leading-relaxed">{selectedPath.whenApplies}</p>
          </div>

          <div className="mb-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Próximos pasos habituales</p>
            <ul className="space-y-1.5">
              {selectedPath.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="w-5 h-5 rounded-full bg-[#009C3B]/10 text-[#009C3B] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5 flex items-start gap-2">
            <span className="text-base shrink-0">⚠️</span>
            <p className="text-xs text-amber-700 leading-relaxed">{selectedPath.warning}</p>
          </div>

          <a
            href="/ruta-brasileno/situacion-migratoria"
            className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#002776] hover:text-[#009C3B] transition-colors"
          >
            Ver guía completa <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  )
}
