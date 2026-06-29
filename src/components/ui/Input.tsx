import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="form-label">{label}</label>}
        <input
          ref={ref}
          id={id}
          className={cn(
            'w-full px-3.5 py-2.5 border rounded-xl text-sm transition-all',
            'bg-input-bg text-fg placeholder:text-fg-muted',
            'focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500',
            error ? 'border-red-400' : 'border-border hover:border-fg-muted',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
