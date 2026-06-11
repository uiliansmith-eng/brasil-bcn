'use client'

import { useState, useEffect } from 'react'

const PATHS = [
  { key: 'turismo',      icon: '✈️', title: 'Turismo',        desc: 'Estoy de visita o vacaciones',              color: 'border-sky-200     bg-sky-50     hover:bg-sky-100'     },
  { key: 'estudiante',   icon: '🎓', title: 'Estudiante',     desc: 'Tengo visa o permiso de estudios',          color: 'border-violet-200  bg-violet-50  hover:bg-violet-100'  },
  { key: 'trabajo',      icon: '💼', title: 'Trabajo',        desc: 'Tengo contrato o permiso laboral',          color: 'border-emerald-200 bg-emerald-50 hover:bg-emerald-100' },
  { key: 'familiar_ue',  icon: '👨‍👩‍👧', title: 'Familiar UE',   desc: 'Familiar de ciudadano europeo',             color: 'border-amber-200   bg-amber-50   hover:bg-amber-100'   },
  { key: 'emprendedor',  icon: '🚀', title: 'Emprendedor',    desc: 'Quiero montar un negocio en España',        color: 'border-orange-200  bg-orange-50  hover:bg-orange-100'  },
  { key: 'nomada',       icon: '💻', title: 'Nómada Digital', desc: 'Trabajo remoto para empresa extranjera',    color: 'border-teal-200    bg-teal-50    hover:bg-teal-100'    },
  { key: 'otros',        icon: '🔹', title: 'Otros',          desc: 'Mi situación es diferente',                 color: 'border-gray-200    bg-gray-50    hover:bg-gray-100'    },
] as const

type PathKey = typeof PATHS[number]['key']

export function RouteDecisionCards() {
  const [selected, setSelected] = useState<PathKey | null>(null)

  useEffect(() => {
    const s = localStorage.getItem('ruta_situacion') as PathKey | null
    if (s) setSelected(s)
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {PATHS.map((p) => (
          <button
            key={p.key}
            onClick={() => handleSelect(p.key)}
            className={`
              relative p-3.5 rounded-xl border-2 text-left transition-all duration-200
              ${p.color}
              ${selected === p.key ? 'ring-2 ring-[#002776] ring-offset-1 border-[#002776]' : ''}
            `}
          >
            {selected === p.key && (
              <span className="absolute top-2 right-2 w-4 h-4 bg-[#002776] rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </span>
            )}
            <div className="text-2xl mb-1.5">{p.icon}</div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{p.title}</p>
            <p className="text-xs text-gray-500 mt-0.5 leading-tight">{p.desc}</p>
          </button>
        ))}
      </div>
      {selectedPath && (
        <p className="mt-3 text-xs text-[#009C3B] font-semibold">
          ✓ Ruta guardada para: {selectedPath.title}
        </p>
      )}
    </div>
  )
}
