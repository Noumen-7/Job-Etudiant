'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useNotifications } from '@/providers/NotificationsProvider'
import { ProfileAvatar } from '@/components/profile/ProfileAvatar'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bell, LogOut, User, Briefcase, Home, FileText, ChevronDown, LayoutDashboard, GraduationCap } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const etudiantNav = [
  { href: '/etudiant/accueil', label: 'Accueil', icon: Home },
  { href: '/etudiant/metier', label: 'Offres', icon: Briefcase },
  { href: '/etudiant/demandes', label: 'Mes demandes', icon: FileText },
  { href: '/etudiant/profil', label: 'Profil', icon: User },
]

const entrepriseNav = [
  { href: '/entreprise/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/entreprise/offres', label: 'Mes offres', icon: Briefcase },
  { href: '/entreprise/reception', label: 'Candidatures', icon: FileText },
]

export function Navbar() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!user) return null

  const routeRole = pathname.startsWith('/entreprise')
    ? 'ENTREPRISE'
    : pathname.startsWith('/etudiant')
      ? 'ETUDIANT'
      : user.role
  const effectiveRole = routeRole === user.role ? user.role : routeRole

  const nav = effectiveRole === 'ETUDIANT' ? etudiantNav : entrepriseNav
  const notifHref = effectiveRole === 'ETUDIANT' ? '/etudiant/notifications' : '/entreprise/notifications'
  const homeHref = effectiveRole === 'ETUDIANT' ? '/etudiant/accueil' : '/entreprise/dashboard'
  const displayName = effectiveRole === user.role
    ? (effectiveRole === 'ETUDIANT'
      ? `${user.etudiant?.prenom || ''} ${user.etudiant?.nom || ''}`.trim()
      : user.entreprise?.nom || '')
    : user.email
  const avatarUrl = effectiveRole === user.role
    ? (effectiveRole === 'ETUDIANT' ? user.etudiant?.avatarUrl : user.entreprise?.avatarUrl)
    : null

  return (
    <nav key={`${user.id}-${effectiveRole}`} className="glass sticky top-0 z-50 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={homeHref} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg text-fg">
              Job<span className="text-emerald-600">Etudiant</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {nav.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn('nav-link', pathname.startsWith(href) && 'nav-link-active')}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href={notifHref} className="relative p-2.5 rounded-xl text-fg-muted hover:bg-nav-hover-bg hover:text-accent-soft-fg transition-all">
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-surface">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen(o => !o)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-fg-secondary hover:bg-nav-hover-bg transition-all"
              >
                <ProfileAvatar src={avatarUrl} name={displayName || '?'} size="sm" />
                <span className="hidden md:block max-w-32 truncate font-semibold text-fg">{displayName}</span>
                <ChevronDown size={14} className={cn('text-fg-muted transition-transform', menuOpen && 'rotate-180')} />
              </button>

              {menuOpen && (
                <div className="dropdown-menu absolute right-0 mt-2 w-56 rounded-2xl py-1.5 z-50">
                  <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                    <ProfileAvatar src={avatarUrl} name={displayName || '?'} size="md" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                        {effectiveRole === 'ETUDIANT' ? 'Étudiant' : 'Entreprise'}
                      </p>
                      <p className="text-sm font-bold text-fg truncate">{displayName}</p>
                    </div>
                  </div>
                  {effectiveRole === 'ETUDIANT' ? (
                    <Link href="/etudiant/profil" onClick={() => setMenuOpen(false)} className="dropdown-item">
                      <User size={14} />
                      Mon profil
                    </Link>
                  ) : (
                    <Link href="/entreprise/profil" onClick={() => setMenuOpen(false)} className="dropdown-item">
                      <User size={14} />
                      Profil entreprise
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="dropdown-item text-red-600 dark:text-red-400 hover:!bg-red-950/30 hover:!text-red-400"
                  >
                    <LogOut size={14} />
                    Se déconnecter
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex md:hidden gap-1.5 pb-2.5 overflow-x-auto">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all',
                pathname.startsWith(href)
                  ? 'bg-nav-active-bg text-nav-active-fg'
                  : 'text-fg-secondary hover:bg-nav-hover-bg'
              )}
            >
              <Icon size={13} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
