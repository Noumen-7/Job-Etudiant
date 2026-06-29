'use client'
import { useState, useEffect, useCallback } from 'react'
import { X, FileText, Loader2 } from 'lucide-react'
import { resolveCvUrl } from '@/lib/cv'

interface PdfViewerModalProps {
  open: boolean
  url: string
  title?: string
  onClose: () => void
}

export function PdfViewerModal({ open, url, title = 'Document PDF', onClose }: PdfViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadPdf = useCallback(async (cvUrl: string) => {
    const apiUrl = resolveCvUrl(cvUrl)
    if (!apiUrl) {
      setError('URL du document invalide')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(apiUrl)
      if (!res.ok) throw new Error('Fichier introuvable')

      const raw = await res.blob()
      const pdfBlob = raw.type === 'application/pdf'
        ? raw
        : new Blob([raw], { type: 'application/pdf' })

      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return URL.createObjectURL(pdfBlob)
      })
    } catch {
      setError('Impossible de charger le PDF')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
      setError(null)
      return
    }

    loadPdf(url)

    return () => {
      setBlobUrl(prev => {
        if (prev) URL.revokeObjectURL(prev)
        return null
      })
    }
  }, [open, url, loadPdf])

  if (!open) return null

  return (
    <div
      className="modal-overlay p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
      onClick={onClose}
    >
      <div
        className="modal-panel rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="modal-header px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
              <FileText size={18} />
            </div>
            <h3 id="pdf-viewer-title" className="font-bold text-fg truncate">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-fg-muted hover:bg-muted hover:text-fg-secondary"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 bg-stone-800 min-h-0 relative">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/80">
              <Loader2 size={32} className="animate-spin text-emerald-400" />
              <p className="text-sm">Chargement du document...</p>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center text-stone-300 text-sm px-6 text-center">
              {error}
            </div>
          )}

          {blobUrl && !loading && (
            <iframe
              src={blobUrl}
              title={title}
              className="w-full h-full border-0 bg-stone-800"
            />
          )}
        </div>
      </div>
    </div>
  )
}
