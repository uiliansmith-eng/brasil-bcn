'use client'

import { useState } from 'react'
import { updateSettings, toggleMaintenanceMode } from '@/actions/settings'
import type { SiteSettings } from '@/lib/settings-types'
import { Save, Loader2, Eye, EyeOff, AlertTriangle, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'

type Props = { settings: SiteSettings }

function useSection<T extends object>(initial: T, section: 'hero' | 'launch' | 'brand' | 'sections') {
  const [values, setValues] = useState<T>(initial)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (key: keyof T, val: T[keyof T]) =>
    setValues((p) => ({ ...p, [key]: val }))

  const save = async () => {
    setSaving(true)
    const { error } = await updateSettings(section, values as never)
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } else {
      alert(error)
    }
  }

  return { values, set, save, saving, saved }
}

function SaveBtn({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <Button
      type="submit"
      disabled={saving}
      className="bg-[#002776] hover:bg-[#001a5c] text-white"
    >
      {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
      {saved ? '¡Guardado!' : 'Guardar'}
    </Button>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/30 resize-none"
          rows={3}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={type}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#002776]/30"
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

function Card({ title, children, onSave, saving, saved }: {
  title: string
  children: React.ReactNode
  onSave: () => void
  saving: boolean
  saved: boolean
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6">
      <h2 className="font-bold text-gray-900 mb-5">{title}</h2>
      <div className="space-y-4">{children}</div>
      <div className="mt-6 flex justify-end">
        <SaveBtn saving={saving} saved={saved} />
      </div>
      <button type="button" className="hidden" onClick={onSave} />
    </div>
  )
}

function MaintenanceToggle({ initial }: { initial: boolean }) {
  const [enabled, setEnabled] = useState(initial)
  const [saving, setSaving] = useState(false)

  const toggle = async () => {
    const next = !enabled
    setSaving(true)
    const { error } = await toggleMaintenanceMode(next)
    setSaving(false)
    if (error) { alert(error); return }
    setEnabled(next)
  }

  return (
    <div className={`rounded-2xl border-2 p-6 transition-colors ${enabled ? 'border-orange-400 bg-orange-50' : 'border-gray-100 bg-white'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${enabled ? 'bg-orange-100' : 'bg-gray-100'}`}>
            {enabled ? <AlertTriangle className="w-5 h-5 text-orange-500" /> : <Globe className="w-5 h-5 text-gray-400" />}
          </div>
          <div>
            <p className="font-bold text-gray-900">
              {enabled ? 'Modo mantenimiento ACTIVO' : 'Sitio público'}
            </p>
            <p className="text-sm text-gray-500">
              {enabled
                ? 'Los visitantes ven la página de mantenimiento. Solo admins acceden al sitio.'
                : 'El sitio es visible para todos los visitantes.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={toggle}
          disabled={saving}
          role="switch"
          aria-checked={enabled}
          className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors shrink-0 ${
            enabled ? 'bg-orange-400' : 'bg-gray-200'
          }`}
        >
          {saving
            ? <Loader2 className="w-4 h-4 animate-spin text-white absolute left-1/2 -translate-x-1/2" />
            : <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-8' : 'translate-x-1'}`} />
          }
        </button>
      </div>
    </div>
  )
}

export function PageSettingsForm({ settings }: Props) {
  const hero = useSection(settings.hero, 'hero')
  const launch = useSection(settings.launch, 'launch')
  const brand = useSection(settings.brand, 'brand')
  const sections = useSection(settings.sections, 'sections')

  const sectionLabels: Record<keyof SiteSettings['sections'], string> = {
    election_banner: 'Banner de elecciones',
    launch_section: 'Sección de lanzamiento',
    stats: 'Estadísticas',
    ad_slot: 'Publicidad',
    jobs: 'Empleos destacados',
    companies: 'Empresas destacadas',
    news: 'Noticias de Brasil',
    cta: 'Sección de registro',
  }

  return (
    <div className="space-y-6 max-w-3xl">

      <MaintenanceToggle initial={settings.maintenance_mode} />

      {/* Hero */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Hero — sección principal</h2>
        <div className="space-y-4">
          <Field label="Texto del badge" value={hero.values.badge_text} onChange={(v) => hero.set('badge_text', v)} />
          <Field label="Subtítulo" value={hero.values.subtitle} onChange={(v) => hero.set('subtitle', v)} type="textarea" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Botón 1 — texto" value={hero.values.cta1_text} onChange={(v) => hero.set('cta1_text', v)} />
            <Field label="Botón 1 — enlace" value={hero.values.cta1_href} onChange={(v) => hero.set('cta1_href', v)} placeholder="/empleos" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Botón 2 — texto" value={hero.values.cta2_text} onChange={(v) => hero.set('cta2_text', v)} />
            <Field label="Botón 2 — enlace" value={hero.values.cta2_href} onChange={(v) => hero.set('cta2_href', v)} placeholder="/empresas" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Botón 3 — texto" value={hero.values.cta3_text} onChange={(v) => hero.set('cta3_text', v)} />
            <Field label="Botón 3 — enlace" value={hero.values.cta3_href} onChange={(v) => hero.set('cta3_href', v)} placeholder="/eventos" />
          </div>
          <Field label="Nota inferior" value={hero.values.footnote} onChange={(v) => hero.set('footnote', v)} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={hero.save}
            disabled={hero.saving}
            className="bg-[#002776] hover:bg-[#001a5c] text-white"
          >
            {hero.saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {hero.saved ? '¡Guardado!' : 'Guardar hero'}
          </Button>
        </div>
      </div>

      {/* Launch section */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-5">Banner de lanzamiento</h2>
        <div className="space-y-4">
          <Field label="Título" value={launch.values.title} onChange={(v) => launch.set('title', v)} />
          <Field label="Descripción" value={launch.values.description} onChange={(v) => launch.set('description', v)} type="textarea" />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Botón — texto" value={launch.values.cta_text} onChange={(v) => launch.set('cta_text', v)} />
            <Field label="Botón — enlace" value={launch.values.cta_href} onChange={(v) => launch.set('cta_href', v)} placeholder="/auth/register" />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={launch.save}
            disabled={launch.saving}
            className="bg-[#002776] hover:bg-[#001a5c] text-white"
          >
            {launch.saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {launch.saved ? '¡Guardado!' : 'Guardar banner'}
          </Button>
        </div>
      </div>

      {/* Brand colors */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-1">Colores de marca</h2>
        <p className="text-xs text-gray-400 mb-5">Los colores se aplican en el hero, botones y acentos visuales.</p>
        <div className="grid grid-cols-3 gap-6">
          {(['primary', 'secondary', 'accent'] as const).map((key) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {key === 'primary' ? 'Principal' : key === 'secondary' ? 'Secundario' : 'Acento'}
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={brand.values[key]}
                  onChange={(e) => brand.set(key, e.target.value)}
                  className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={brand.values[key]}
                  onChange={(e) => brand.set(key, e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#002776]/30"
                  placeholder="#000000"
                />
              </div>
              <div className="mt-2 h-6 rounded-lg" style={{ backgroundColor: brand.values[key] }} />
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={brand.save}
            disabled={brand.saving}
            className="bg-[#002776] hover:bg-[#001a5c] text-white"
          >
            {brand.saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {brand.saved ? '¡Guardado!' : 'Guardar colores'}
          </Button>
        </div>
      </div>

      {/* Section visibility */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-1">Secciones visibles</h2>
        <p className="text-xs text-gray-400 mb-5">Activa o desactiva cada sección de la homepage.</p>
        <div className="space-y-2">
          {(Object.keys(sectionLabels) as Array<keyof SiteSettings['sections']>).map((key) => (
            <label
              key={key}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 cursor-pointer"
            >
              <span className="text-sm font-medium text-gray-700">{sectionLabels[key]}</span>
              <div className="flex items-center gap-2">
                {sections.values[key]
                  ? <Eye className="w-4 h-4 text-[#009C3B]" />
                  : <EyeOff className="w-4 h-4 text-gray-300" />
                }
                <button
                  type="button"
                  role="switch"
                  aria-checked={sections.values[key]}
                  onClick={() => sections.set(key, !sections.values[key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    sections.values[key] ? 'bg-[#009C3B]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                      sections.values[key] ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </label>
          ))}
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={sections.save}
            disabled={sections.saving}
            className="bg-[#002776] hover:bg-[#001a5c] text-white"
          >
            {sections.saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            {sections.saved ? '¡Guardado!' : 'Guardar secciones'}
          </Button>
        </div>
      </div>

    </div>
  )
}
