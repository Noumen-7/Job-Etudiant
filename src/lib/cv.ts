import path from 'path'

/** Convertit l'URL stockée en DB vers la route API qui sert le PDF en ligne. */
export function resolveCvUrl(cvUrl: string | null | undefined): string | null {
  if (!cvUrl) return null
  const [pathPart, query] = cvUrl.split('?')
  let resolved: string | null = null
  if (pathPart.startsWith('/api/cv/')) resolved = pathPart
  else if (pathPart.startsWith('/uploads/cv/')) {
    resolved = `/api/cv/${path.basename(pathPart)}`
  } else {
    resolved = pathPart
  }
  return query ? `${resolved}?${query}` : resolved
}
