export interface NotificationItem {
  id: string
  titre: string
  message: string
  isRead: boolean
  createdAt: string
}

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffH = Math.floor(diffMs / 3600000)
  const diffD = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return "À l'instant"
  if (diffMin < 60) return `Il y a ${diffMin} min`
  if (diffH < 24) return `Il y a ${diffH} h`
  if (diffD === 1) return 'Hier'
  if (diffD < 7) return `Il y a ${diffD} j`
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })
}

export function getNotificationGroup(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfYesterday = new Date(startOfToday.getTime() - 86400000)
  const startOfWeek = new Date(startOfToday.getTime() - 6 * 86400000)

  if (date >= startOfToday) return "Aujourd'hui"
  if (date >= startOfYesterday) return 'Hier'
  if (date >= startOfWeek) return 'Cette semaine'
  return 'Plus ancien'
}

export type NotificationKind = 'success' | 'error' | 'info' | 'welcome' | 'offre'

export function getNotificationKind(titre: string): NotificationKind {
  const t = titre.toLowerCase()
  if (t.includes('bon retour') || t.includes('bienvenue')) return 'welcome'
  if (t.includes('nouvelle offre')) return 'offre'
  if (t.includes('accept')) return 'success'
  if (t.includes('refus')) return 'error'
  return 'info'
}

export function getNotificationLink(titre: string, role: 'ETUDIANT' | 'ENTREPRISE'): string | null {
  const t = titre.toLowerCase()
  if (role === 'ENTREPRISE' && t.includes('candidature')) return '/entreprise/reception'
  if (role === 'ETUDIANT' && t.includes('candidature')) return '/etudiant/demandes'
  if (role === 'ETUDIANT' && t.includes('nouvelle offre')) return '/etudiant/metier'
  if (t.includes('bon retour') || t.includes('bienvenue')) {
    return role === 'ETUDIANT' ? '/etudiant/metier' : '/entreprise/dashboard'
  }
  return null
}

export function groupNotifications(notifs: NotificationItem[]): { label: string; items: NotificationItem[] }[] {
  const order = ["Aujourd'hui", 'Hier', 'Cette semaine', 'Plus ancien']
  const map = new Map<string, NotificationItem[]>()

  for (const n of notifs) {
    const label = getNotificationGroup(n.createdAt)
    if (!map.has(label)) map.set(label, [])
    map.get(label)!.push(n)
  }

  return order.filter(l => map.has(l)).map(label => ({ label, items: map.get(label)! }))
}
