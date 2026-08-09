import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Brand({ className, light }: { className?: string; light?: boolean }) {
  return (
    <span
      className={cn(
        'font-display text-[1.35rem] font-medium tracking-tight',
        light ? 'text-[var(--t-ink)]' : 'text-[var(--ink)]',
        className,
      )}
    >
      Sanding{' '}
      <span className={cn('text-[0.7em] align-super', light ? 'text-[var(--t-gold)]' : 'text-[var(--gold)]')}>
        ◆
      </span>
    </span>
  )
}
