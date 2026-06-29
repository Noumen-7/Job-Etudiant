'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, Camera, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const CROP_SIZE = 280
const OUTPUT_SIZE = 400

interface AvatarCropModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (file: Blob) => Promise<void>
}

function getImageLayout(naturalWidth: number, naturalHeight: number, scale: number, position: { x: number; y: number }) {
  const baseScale = Math.max(CROP_SIZE / naturalWidth, CROP_SIZE / naturalHeight)
  const currentScale = baseScale * scale
  const w = naturalWidth * currentScale
  const h = naturalHeight * currentScale
  const x = CROP_SIZE / 2 - w / 2 + position.x
  const y = CROP_SIZE / 2 - h / 2 + position.y
  return { w, h, x, y }
}

export function AvatarCropModal({ open, onClose, onConfirm }: AvatarCropModalProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [scale, setScale] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [uploading, setUploading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  const reset = useCallback(() => {
    setImageSrc(null)
    setScale(1)
    setPosition({ x: 0, y: 0 })
    setLoaded(false)
    if (fileRef.current) fileRef.current.value = ''
  }, [])

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(reader.result as string)
      setScale(1)
      setPosition({ x: 0, y: 0 })
      setLoaded(false)
    }
    reader.readAsDataURL(file)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (!imageSrc || !loaded) return
    setDragging(true)
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y })
  }

  const onPointerUp = () => setDragging(false)

  const getCroppedBlob = useCallback((): Promise<Blob | null> => {
    return new Promise(resolve => {
      const img = imgRef.current
      if (!img || !loaded) { resolve(null); return }

      const temp = document.createElement('canvas')
      temp.width = CROP_SIZE
      temp.height = CROP_SIZE
      const tctx = temp.getContext('2d')
      if (!tctx) { resolve(null); return }

      const { w, h, x, y } = getImageLayout(img.naturalWidth, img.naturalHeight, scale, position)
      tctx.drawImage(img, x, y, w, h)

      const output = document.createElement('canvas')
      output.width = OUTPUT_SIZE
      output.height = OUTPUT_SIZE
      const octx = output.getContext('2d')
      if (!octx) { resolve(null); return }
      octx.drawImage(temp, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE)
      output.toBlob(blob => resolve(blob), 'image/jpeg', 0.92)
    })
  }, [loaded, scale, position])

  const handleConfirm = async () => {
    setUploading(true)
    try {
      const blob = await getCroppedBlob()
      if (!blob) return
      await onConfirm(blob)
      onClose()
    } finally {
      setUploading(false)
    }
  }

  const layout = loaded && imgRef.current
    ? getImageLayout(imgRef.current.naturalWidth, imgRef.current.naturalHeight, scale, position)
    : null

  if (!open) return null

  return (
    <div className="modal-overlay p-4">
      <div className="modal-panel rounded-2xl w-full max-w-md overflow-hidden">
        <div className="modal-header px-6 py-4">
          <h3 className="font-bold text-fg">Photo de profil</h3>
          <button type="button" onClick={onClose} className="p-1.5 rounded-lg text-fg-muted hover:bg-muted hover:text-fg-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!imageSrc ? (
            <label className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-emerald-400 hover:bg-accent-soft transition-all">
              <Camera size={32} className="text-emerald-500 mb-3" />
              <span className="text-sm font-medium text-fg">Choisir une image</span>
              <span className="text-xs text-fg-muted mt-1">JPG, PNG ou WebP — max 5 Mo</span>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
            </label>
          ) : (
            <>
              <div
                className="relative mx-auto rounded-2xl overflow-hidden bg-stone-900 select-none touch-none cursor-grab active:cursor-grabbing"
                style={{ width: CROP_SIZE, height: CROP_SIZE }}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Aperçu"
                  className="absolute pointer-events-none max-w-none"
                  style={layout ? { left: layout.x, top: layout.y, width: layout.w, height: layout.h } : { opacity: 0 }}
                  onLoad={() => setLoaded(true)}
                  draggable={false}
                />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute inset-4 rounded-full ring-4 ring-white/25 shadow-[inset_0_0_0_9999px_rgba(0,0,0,0.35)]" />
                </div>
              </div>

              <p className="text-xs text-center text-fg-secondary">Glissez pour repositionner, zoomez pour ajuster</p>

              <div className="flex items-center gap-3">
                <ZoomOut size={16} className="text-fg-muted shrink-0" />
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.01}
                  value={scale}
                  onChange={e => setScale(Number(e.target.value))}
                  className="flex-1 accent-emerald-600"
                />
                <ZoomIn size={16} className="text-fg-muted shrink-0" />
              </div>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-sm text-emerald-600 font-medium hover:underline"
              >
                Choisir une autre image
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />
            </>
          )}
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border-subtle bg-muted/50">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Annuler</Button>
          <Button type="button" className="flex-1" disabled={!loaded} loading={uploading} onClick={handleConfirm}>
            Enregistrer
          </Button>
        </div>
      </div>
    </div>
  )
}
