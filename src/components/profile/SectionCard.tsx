import { ReactNode, ElementType } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title: string
  icon: ElementType
  children: ReactNode
  className?: string
}

export function SectionCard({ title, icon: Icon, children, className }: SectionCardProps) {
  return (
    <div className={cn('card rounded-2xl p-6', className)}>
      <h2 className="font-bold text-fg mb-5 flex items-center gap-2.5">
        <span className="icon-badge">
          <Icon size={16} />
        </span>
        {title}
      </h2>
      {children}
    </div>
  )
}
