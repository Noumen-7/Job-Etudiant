'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  BellRing,
  CheckCheck,
  CheckCircle2,
  XCircle,
  Info,
  Sparkles,
  ArrowRight,
  Inbox,
  Briefcase,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useNotifications } from '@/providers/NotificationsProvider'
import {
  formatRelativeTime,
  getNotificationKind,
  getNotificationLink,
  groupNotifications,
  type NotificationKind,
} from '@/lib/notifications'
import { cn } from '@/lib/utils'

const kindStyles: Record<NotificationKind, { icon: LucideIcon; bg: string; ring: string; iconColor: string }> = {
  success: { icon: CheckCircle2, bg: 'bg-emerald-50', ring: 'ring-emerald-200/80', iconColor: 'text-emerald-600' },
  error: { icon: XCircle, bg: 'bg-red-50', ring: 'ring-red-200/80', iconColor: 'text-red-500' },
  welcome: { icon: Sparkles, bg: 'bg-teal-50', ring: 'ring-teal-200/80', iconColor: 'text-teal-600' },
  offre: { icon: Briefcase, bg: 'bg-violet-50', ring: 'ring-violet-200/80', iconColor: 'text-violet-600' },
  info: { icon: Info, bg: 'bg-sky-50', ring: 'ring-sky-200/80', iconColor: 'text-sky-600' },
}

interface NotificationsContentProps {
  role: 'ETUDIANT' | 'ENTREPRISE'
}

export function NotificationsContent({ role }: NotificationsContentProps) {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications()
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = filter === 'unread'
    ? notifications.filter(n => !n.isRead)
    : notifications

  const groups = groupNotifications(filtered)

  const emptyMessage = role === 'ETUDIANT'
    ? 'Vous serez notifié des réponses à vos candidatures et des nouvelles opportunités.'
    : 'Vous serez notifié des nouvelles candidatures reçues sur vos offres.'

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
              <BellRing size={24} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-fg tracking-tight">Notifications</h1>
              <p className="text-fg-secondary mt-1 text-sm">
                {unreadCount > 0
                  ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''} · mise à jour automatique`
                  : 'Tout est à jour · mise à jour automatique'}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={markAllRead} className="shrink-0">
              <CheckCheck size={14} className="mr-1.5" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mt-6">
          {(['all', 'unread'] as const).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                filter === f
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-surface text-fg-secondary border border-border hover:border-emerald-200 hover:text-emerald-700'
              )}
            >
              {f === 'all' ? 'Toutes' : `Non lues${unreadCount > 0 ? ` (${unreadCount})` : ''}`}
            </button>
          ))}
        </div>
      </div>

      {loading && notifications.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 skeleton rounded-2xl border border-border-subtle" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state shadow-sm">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-50 flex items-center justify-center">
            <Inbox size={28} className="text-emerald-400" />
          </div>
          <p className="font-semibold text-fg">
            {filter === 'unread' ? 'Aucune notification non lue' : 'Aucune notification'}
          </p>
          <p className="text-sm text-fg-muted mt-2 max-w-xs mx-auto">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groups.map(({ label, items }) => (
            <section key={label}>
              <h2 className="text-xs font-bold text-fg-muted uppercase tracking-wider mb-3 px-1">
                {label}
              </h2>
              <div className="space-y-2">
                {items.map(n => (
                  <NotificationCard
                    key={n.id}
                    notification={n}
                    role={role}
                    onMarkRead={() => markRead(n.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

function NotificationCard({
  notification: n,
  role,
  onMarkRead,
}: {
  notification: { id: string; titre: string; message: string; isRead: boolean; createdAt: string }
  role: 'ETUDIANT' | 'ENTREPRISE'
  onMarkRead: () => void
}) {
  const kind = getNotificationKind(n.titre)
  const style = kindStyles[kind]
  const Icon = style.icon
  const link = getNotificationLink(n.titre, role)

  const handleClick = () => {
    if (!n.isRead) onMarkRead()
  }

  const content = (
    <div
      className={cn(
        'relative p-4 sm:p-5 rounded-2xl border transition-all',
        n.isRead
          ? 'bg-surface border-border-subtle hover:border-border'
          : 'bg-surface border-emerald-200 shadow-sm shadow-emerald-900/5 hover:shadow-md hover:border-emerald-300'
      )}
    >
      {!n.isRead && (
        <span className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
      )}
      <div className="flex items-start gap-4 pr-6">
        <div className={cn('p-2.5 rounded-xl ring-1 shrink-0', style.bg, style.ring)}>
          <Icon size={18} className={style.iconColor} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn('font-semibold text-sm', n.isRead ? 'text-fg-secondary' : 'text-fg')}>
            {n.titre}
          </p>
          <p className="text-sm text-fg-secondary mt-1 leading-relaxed">{n.message}</p>
          <div className="flex items-center gap-3 mt-2.5">
            <span className="text-xs text-fg-muted">{formatRelativeTime(n.createdAt)}</span>
            {link && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                Voir <ArrowRight size={12} />
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (link) {
    return (
      <Link href={link} onClick={handleClick} className="block">
        {content}
      </Link>
    )
  }

  return (
    <button type="button" onClick={handleClick} className="block w-full text-left">
      {content}
    </button>
  )
}
