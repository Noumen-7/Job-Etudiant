'use client'
import { CheckCircle2, XCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastProps {
  message: string
  type?: 'success' | 'error'
  onClose?: () => void
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const isSuccess = type === 'success'

  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-6 right-6 z-[100] flex items-center gap-3 pl-4 pr-3 py-3.5 rounded-xl shadow-xl animate-fade-in max-w-sm',
        isSuccess
          ? 'bg-emerald-600 text-white shadow-emerald-600/30'
          : 'bg-red-600 text-white shadow-red-600/30'
      )}
    >
      {isSuccess ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
      <p className="text-sm font-medium flex-1">{message}</p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 transition-colors shrink-0"
          aria-label="Fermer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
