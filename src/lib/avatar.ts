import path from 'path'

/** Convertit l'URL stockée en DB vers la route API qui sert réellement le fichier. */
export function resolveAvatarUrl(avatarUrl: string | null | undefined): string | null {
  if (!avatarUrl) return null
  const [pathPart, query] = avatarUrl.split('?')
  let resolved: string | null = null
  if (pathPart.startsWith('/api/avatars/')) resolved = pathPart
  else if (pathPart.startsWith('/uploads/avatars/')) {
    resolved = `/api/avatars/${path.basename(pathPart)}`
  } else {
    resolved = pathPart
  }
  return query ? `${resolved}?${query}` : resolved
}

export function buildAvatarUrl(filename: string) {
  return `/api/avatars/${filename}`
}
