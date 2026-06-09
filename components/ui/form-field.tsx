import { forwardRef } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  hint?: string
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="space-y-1.5">
        <Label htmlFor={fieldId} className="text-sm font-medium text-gray-700">
          {label}
        </Label>
        <Input
          id={fieldId}
          ref={ref}
          className={cn(
            'h-11 rounded-xl border-gray-200 focus:border-[#009C3B] focus:ring-[#009C3B]/20 transition-colors',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-100',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500 flex items-center gap-1">{error}</p>}
        {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      </div>
    )
  }
)
FormField.displayName = 'FormField'
