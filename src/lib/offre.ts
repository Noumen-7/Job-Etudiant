/** Durée par défaut pour les offres sans dateFin explicite (legacy). */
export const DEFAULT_OFFER_DURATION_DAYS = 90

export interface OffreDates {
  dateFin?: string | Date | null
  createdAt: string | Date
}

export function getEffectiveDateFin(offre: OffreDates): Date {
  if (offre.dateFin) return new Date(offre.dateFin)
  const d = new Date(offre.createdAt)
  d.setDate(d.getDate() + DEFAULT_OFFER_DURATION_DAYS)
  return d
}

export function isOffreExpired(offre: OffreDates, now = new Date()): boolean {
  return getEffectiveDateFin(offre).getTime() < now.getTime()
}

export function isOffreActive(offre: OffreDates & { isActive?: boolean }, now = new Date()): boolean {
  if (offre.isActive === false) return false
  return !isOffreExpired(offre, now)
}

export function formatOffreDateFin(offre: OffreDates): string {
  return getEffectiveDateFin(offre).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function getDefaultDateFinInputValue(daysFromNow = 30): string {
  const d = new Date()
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

export function daysUntilExpiry(offre: OffreDates, now = new Date()): number {
  const diff = getEffectiveDateFin(offre).getTime() - now.getTime()
  return Math.ceil(diff / 86400000)
}
