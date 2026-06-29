'use client'
import { useState, useEffect } from 'react'
import { Camera, Trash2, AlertTriangle } from 'lucide-react'
import { ProfileAvatar } from './ProfileAvatar'
import { AvatarCropModal } from './AvatarCropModal'
import { Button } from '@/components/ui/Button'
import { resolveAvatarUrl } from '@/lib/avatar'

interface AvatarUploadProps {
  name: string
  avatarUrl?: string | null
  uploadUrl: string
  onUploaded: (avatarUrl: string) => void
  onDeleted?: () => void
  size?: 'lg' | 'xl'
}

export function AvatarUpload({ name, avatarUrl, uploadUrl, onUploaded, onDeleted, size = 'xl' }: AvatarUploadProps) {
  const [currentUrl, setCurrentUrl] = useState(avatarUrl)
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const displaySrc = currentUrl ?? avatarUrl
  const hasPhoto = Boolean(resolveAvatarUrl(displaySrc))

  useEffect(() => {
    setCurrentUrl(avatarUrl)
  }, [avatarUrl])

  const handleUpload = async (blob: Blob) => {
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('avatar', new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
      const res = await fetch(uploadUrl, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        const cleanUrl = data.data.avatarUrl as string
        setCurrentUrl(`${resolveAvatarUrl(cleanUrl)}?t=${Date.now()}`)
        onUploaded(cleanUrl)
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(uploadUrl, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setCurrentUrl(null)
        setConfirmDelete(false)
        onDeleted?.()
      }
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="relative group">
          <ProfileAvatar src={currentUrl} name={name} size={size} />
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={uploading || deleting}
            className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
            aria-label="Modifier la photo"
          >
            <Camera size={24} className="text-white drop-shadow" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            disabled={uploading || deleting}
            className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            {hasPhoto ? 'Modifier la photo' : 'Ajouter une photo'}
          </button>
          {hasPhoto && (
            <>
              <span className="text-fg-muted">·</span>
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                disabled={uploading || deleting}
                className="flex items-center gap-1 text-sm font-medium text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
              >
                <Trash2 size={14} />
                Supprimer
              </button>
            </>
          )}
        </div>

        <p className="text-xs text-fg-muted text-center max-w-[220px]">
          Recadrez votre image — elle s&apos;affichera en rond sur le site
        </p>
      </div>

      <AvatarCropModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleUpload}
      />

      {confirmDelete && (
        <div className="modal-overlay p-4">
          <div className="modal-panel rounded-2xl w-full max-w-sm p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-red-50 text-red-500 shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-fg">Supprimer la photo ?</h3>
                <p className="text-sm text-fg-secondary mt-1">
                  Votre photo de profil sera définitivement supprimée. Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                className="flex-1"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
              >
                Annuler
              </Button>
              <Button
                type="button"
                variant="danger"
                className="flex-1"
                loading={deleting}
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
