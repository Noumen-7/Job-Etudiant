import { AuthProvider } from '@/providers/AuthProvider'
import { NotificationsProvider } from '@/providers/NotificationsProvider'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { LanguageProvider } from '@/providers/LanguageProvider'


export function Providers({
  children
}: {
  children: React.ReactNode
}) {

  return (

    <LanguageProvider>

      <ThemeProvider>

        <AuthProvider>

          <NotificationsProvider>

            {children}

          </NotificationsProvider>

        </AuthProvider>

      </ThemeProvider>

    </LanguageProvider>

  )

}