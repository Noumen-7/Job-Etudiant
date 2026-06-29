import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface AlertProps {
  type?: 'error' | 'success' | 'info'
  children: ReactNode
  className?: string
}

export function Alert({ type = 'info', children, className }: AlertProps) {
  const styles = {
    error: 'alert-error',
    success: 'alert-success',
    info: 'alert-info',
  }
  return (
    <div className={cn('alert-box', styles[type], className)}>
      {children}
    </div>
  )
}
