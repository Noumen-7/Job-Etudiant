'use client'
import { useState, useRef } from 'react'
import { FileText, Upload, Trash2, Eye, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { resolveCvUrl } from '@/lib/cv'
import { getCvDisplayName } from '@/lib/cv.client'

interface DefaultCvUploadProps {
  cvUrl?: string | null
  onUploaded: (cvUrl: string) => void
  onDeleted: () => void
}

export function DefaultCvUpload({ cvUrl, onUploaded, onDeleted }: DefaultCvUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [error, setError] = useState('')

  const hasCv = Boolean(cvUrl)
  const displayName = getCvDisplayName(cvUrl)
  const previewUrl = resolveCvUrl(cvUrl)

  const handleUpload = async (file: File) => {
    setError('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('cv', file)
      const res = await fetch('/api/etudiant/profil/cv', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        onUploaded(data.data.cvUrl)
      } else {
        setError(data.error || 'Erreur lors de l\'upload')
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch('/api/etudiant/profil/cv', { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setConfirmDelete(false)
        onDeleted()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="rounded-xl border border-border bg-muted/50 p-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 shrink-0">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-fg">CV par défaut</p>
            <p className="text-xs text-fg-secondary mt-0.5">
              Utilisé automatiquement lors de vos candidatures (modifiable à chaque postulation).
            </p>

            {hasCv ? (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-surface border border-emerald-200 text-emerald-700 rounded-lg truncate max-w-full">
                  <FileText size={12} className="shrink-0" />
                  {displayName}
                </span>
                {previewUrl && (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                  >
                    <Eye size={12} />
                    Aperçu
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-fg-muted mt-2">Aucun CV enregistré — PDF uniquement, max 10 Mo</p>
            )}

            {error && <p className="text-xs text-red-500 mt-2">{error}</p>}

            <div className="flex flex-wrap gap-2 mt-3">
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleUpload(file)
                  e.target.value = ''
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="secondary"
                loading={uploading}
                onClick={() => inputRef.current?.click()}
                className="gap-1.5"
              >
                <Upload size={14} />
                {hasCv ? 'Remplacer' : 'Importer un CV'}
              </Button>
              {hasCv && (
                <Button
                  type="button"
                  size="sm"
                  variant="danger"
                  disabled={uploading}
                  onClick={() => setConfirmDelete(true)}
                  className="gap-1.5"
                >
                  <Trash2 size={14} />
                  Supprimer
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {confirmDelete && (
        <div className="modal-overlay p-4">
          <div className="modal-panel rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-fg">Supprimer le CV par défaut ?</h3>
                <p className="text-sm text-fg-secondary mt-1">
                  Vous devrez importer un CV à chaque candidature tant qu&apos;aucun nouveau CV par défaut n&apos;est défini.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="secondary" className="flex-1" disabled={deleting} onClick={() => setConfirmDelete(false)}>
                Annuler
              </Button>
              <Button type="button" variant="danger" className="flex-1" loading={deleting} onClick={handleDelete}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
