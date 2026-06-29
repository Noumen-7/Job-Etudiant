'use client'
import { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { Toast } from '@/components/ui/Toast'
import type { NotificationItem } from '@/lib/notifications'

interface NotificationsContextValue {
  notifications: NotificationItem[]
  unreadCount: number
  loading: boolean
  refetch: () => Promise<void>
  markRead: (id: string) => Promise<void>
  markAllRead: () => Promise<void>
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

const POLL_INTERVAL = 15000

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{ msg: string } | null>(null)
  const knownIdsRef = useRef<Set<string>>(new Set())
  const initializedRef = useRef(false)

  const fetchNotifications = useCallback(async (opts?: { silent?: boolean }) => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      initializedRef.current = false
      knownIdsRef.current = new Set()
      return
    }

    if (!opts?.silent) setLoading(true)
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        const items = data.data as NotificationItem[]
        setNotifications(items)
        setUnreadCount(data.unreadCount ?? items.filter(n => !n.isRead).length)

        if (initializedRef.current) {
          const newUnread = items.filter(n => !n.isRead && !knownIdsRef.current.has(n.id))
          if (newUnread.length > 0) {
            const latest = newUnread[0]
            setToast({ msg: latest.titre })
            setTimeout(() => setToast(null), 4000)
          }
        } else {
          const latestUnread = items.find(n => !n.isRead)
          if (latestUnread) {
            setToast({ msg: latestUnread.titre })
            setTimeout(() => setToast(null), 4000)
          }
        }

        knownIdsRef.current = new Set(items.map(n => n.id))
        initializedRef.current = true
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    initializedRef.current = false
    knownIdsRef.current = new Set()
    fetchNotifications()
  }, [user?.id, fetchNotifications])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => fetchNotifications({ silent: true }), POLL_INTERVAL)

    const onFocus = () => fetchNotifications({ silent: true })
    const onVisibility = () => {
      if (document.visibilityState === 'visible') fetchNotifications({ silent: true })
    }

    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [user, fetchNotifications])

  const markRead = useCallback(async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' })
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }, [])

  const markAllRead = useCallback(async () => {
    await fetch('/api/notifications', { method: 'PUT' })
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refetch: () => fetchNotifications({ silent: true }),
        markRead,
        markAllRead,
      }}
    >
      {children}
      {toast && (
        <Toast
          message={toast.msg}
          type="success"
          onClose={() => setToast(null)}
        />
      )}
    </NotificationsContext.Provider>
  )
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications doit être utilisé dans NotificationsProvider')
  return ctx
}
