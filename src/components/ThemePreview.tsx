import { cn } from '@/lib/utils'
import { themeById } from '@/lib/themes'
import { Ornament } from '@/components/Ornament'

export function ThemePreview({
  theme,
  colorId,
  className,
  groom = 'Pria',
  bride = 'Wanita',
}: {
  theme: string
  colorId?: string
  className?: string
  groom?: string
  bride?: string
}) {
  const t = themeById(theme)
  return (
    <div className={cn(`theme-${theme}`, className)} data-variant={colorId}>
      <div className="inv-preview">
        <Ornament className="ip-orn w-14" />
        <span className="ip-names">
          {groom}
          <br />
          {bride}
        </span>
        <span className="ip-rule" />
        <span className="ip-date">The Wedding</span>
      </div>
    </div>
  )
}
