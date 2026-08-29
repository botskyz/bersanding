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
  // Botanical Garden punya ilustrasi lengkung sendiri — ambil langsung dari
  // aset cover aslinya (bukan gambar statis) supaya preview-nya sesuai
  // dengan tampilan undangan yang sebenarnya.
  if (theme === 'botanical') {
    return (
      <div className={cn('relative overflow-hidden rounded-sm bg-[#ECE1CD]', className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/theme-botanical/page-1/arch.png"
          alt=""
          aria-hidden
          className="pointer-events-none w-full select-none"
        />
        <div className="absolute inset-x-0 top-[20%] flex flex-col items-center px-6 text-center">
          <p className="font-script text-[1.35rem] leading-tight text-[#2E5A41]">{groom}</p>
          <p className="font-script -my-0.5 text-sm text-[#AE8A3B]">&</p>
          <p className="font-script text-[1.35rem] leading-tight text-[#2E5A41]">{bride}</p>
        </div>
      </div>
    )
  }

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
