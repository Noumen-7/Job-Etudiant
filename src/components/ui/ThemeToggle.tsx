'use client'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/providers/ThemeProvider'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className={cn(
        'p-2.5 rounded-xl text-fg-muted hover:bg-nav-hover-bg hover:text-accent-soft-fg transition-all',
        className
      )}
    >
      {mounted && theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
