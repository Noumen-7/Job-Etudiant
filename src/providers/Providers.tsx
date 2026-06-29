import { AuthProvider } from '@/providers/AuthProvider'
import { NotificationsProvider } from '@/providers/NotificationsProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationsProvider>{children}</NotificationsProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
