import { unlink } from 'fs/promises'
import path from 'path'

export function getAvatarFilename(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null
  const clean = avatarUrl.split('?')[0]
  return path.basename(clean)
}

export async function deleteAvatarFile(avatarUrl: string | null | undefined) {
  const filename = getAvatarFilename(avatarUrl)
  if (!filename) return
  try {
    await unlink(path.join(process.cwd(), 'public', 'uploads', 'avatars', filename))
  } catch {
    // fichier déjà absent
  }
}

export function validateAvatarFile(file: File) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowed.includes(file.type)) {
    return 'Format accepté : JPG, PNG ou WebP'
  }
  if (file.size > 5 * 1024 * 1024) {
    return 'L\'image ne doit pas dépasser 5 Mo'
  }
  return null
}
