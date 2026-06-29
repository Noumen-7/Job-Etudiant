import { ThemeToggle } from '@/components/ui/ThemeToggle'

export function AuthThemeToggle() {
  return (
    <div className="fixed top-4 right-4 z-50">
      <ThemeToggle className="glass border border-emerald-100/80 dark:border-stone-700" />
    </div>
  )
}
