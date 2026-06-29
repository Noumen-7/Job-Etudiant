'use client'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { resolveAvatarUrl } from '@/lib/avatar'

const sizes = {
  xs: 'w-7 h-7 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-24 h-24 text-2xl',
  xl: 'w-32 h-32 text-3xl',
}

interface ProfileAvatarProps {
  src?: string | null
  name: string
  size?: keyof typeof sizes
  className?: string
}

export function ProfileAvatar({ src, name, size = 'md', className }: ProfileAvatarProps) {
  const [failed, setFailed] = useState(false)
  const initial = (name.trim().charAt(0) || '?').toUpperCase()
  const resolved = resolveAvatarUrl(src)

  useEffect(() => {
    setFailed(false)
  }, [src])

  if (resolved && !failed) {
    const imgSrc = resolved.includes('?') ? resolved : `${resolved}?v=${encodeURIComponent(src ?? '')}`
    return (
      <img
        key={imgSrc}
        src={imgSrc}
        alt={name}
        onError={() => setFailed(true)}
        className={cn(sizes[size], 'rounded-full object-cover ring-2 ring-emerald-200/80 shadow-sm', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        sizes[size],
        'rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center ring-2 ring-emerald-200/80 shadow-sm font-bold text-emerald-700',
        className
      )}
    >
      {initial}
    </div>
  )
}
