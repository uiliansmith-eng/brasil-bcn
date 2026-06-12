import { CITIES_BY_PROVINCE } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface CitySelectProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  // For react-hook-form compatibility
  name?: string
  id?: string
}

export function CitySelect({ value, onChange, placeholder = 'Todas las ciudades', className, ...props }: CitySelectProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'w-full px-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#009C3B] focus:ring-2 focus:ring-[#009C3B]/20 transition-colors',
        className
      )}
      {...props}
    >
      <option value="">{placeholder}</option>
      {CITIES_BY_PROVINCE.map(({ region, cities }) => (
        <optgroup key={region} label={region}>
          {cities.map((city) => (
            <option key={city} value={city}>{city}</option>
          ))}
        </optgroup>
      ))}
    </select>
  )
}
