import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Cover / sampul bergaya Botanical Garden (mockup 1).
 * Full-bleed: section ini sengaja "keluar" dari padding parent
 * (Invitation.tsx bungkus semua section dengan px-5) supaya arch
 * & vas bunga benar-benar nempel ke tepi layar seperti mockup asli.
 *
 * Aset yang dipakai (taruh di /public/theme-botanical/page-1/):
 *  - arch.png          -> lengkung batu + daun, elemen utama
 *  - floral-left.png   -> vas bunga kiri
 *  - floral-right.png  -> vas bunga kanan
 */
export function BotanicalCover({
  groomName,
  brideName,
  guestName,
  onOpen,
}: {
  groomName: string
  brideName: string
  guestName: string
  onOpen: () => void
}) {
  // Nama mempelai muncul dengan fade + geser dikit saat halaman pertama kali dibuka.
  const [namesVisible, setNamesVisible] = useState(false)
  useEffect(() => {
    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setNamesVisible(true)
      return
    }
    const t = setTimeout(() => setNamesVisible(true), 300)
    return () => clearTimeout(t)
  }, [])

  return (
    <section className="botanical-page relative -mx-5 flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#ECE1CD] py-10 text-center">
      {/* Grup lengkung + teks + vas bunga — satu kesatuan, full-bleed edge-to-edge */}
      <div className="relative w-full">
        <img
          src="/theme-botanical/page-1/arch.png"
          alt=""
          aria-hidden
          className="breathe-slow pointer-events-none w-full origin-center select-none"
        />
        <div className="absolute inset-x-0 top-[24%] flex flex-col items-center px-12">
          <p className="text-[13px] italic font-medium tracking-[0.3em] text-[#3A4A34]">
            The Wedding of
          </p>

          {/* Nama mempelai — animasi masuk (fade + geser naik) */}
          <div
            className={cn(
              'transition-all duration-[900ms] ease-out',
              namesVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            )}
          >
            <p className="font-script mt-3 text-[clamp(2rem,9vw,2.9rem)] leading-[1.05] text-[#2E5A41]">
              {groomName}
            </p>
            <p className="font-script -mt-1 text-[clamp(1.7rem,7vw,2.4rem)] leading-none text-[#2E5A41]">
              &
            </p>
            <p className="font-script -mt-1 text-[clamp(2rem,9vw,2.9rem)] leading-[1.05] text-[#2E5A41]">
              {brideName}
            </p>
          </div>

          <p className="mt-7 text-[13px] font-medium tracking-[0.08em] leading-snug text-[#3A4A34]">
            Teruntuk {guestName}
          </p>
          <button
            onClick={onOpen}
            className={cn(
              'mt-6 rounded-full bg-[#2E5A41] px-9 py-3.5 text-base font-medium tracking-wide text-[#F3F0E4]',
              'shadow-sm transition-transform active:scale-95',
            )}
          >
            Buka Undangan
          </button>
        </div>

        {/* Vas bunga, nempel langsung di bawah lengkung */}
        <div className="relative -mt-20 flex items-end justify-between">
          <div data-depth={0.09} className="w-[34%] max-w-[150px]">
            <img
              src="/theme-botanical/page-1/floral-left.png"
              alt=""
              aria-hidden
              className="sway-a pointer-events-none w-full origin-top select-none"
            />
          </div>
          <div data-depth={0.09} className="w-[34%] max-w-[150px]">
            <img
              src="/theme-botanical/page-1/floral-right.png"
              alt=""
              aria-hidden
              className="sway-b pointer-events-none w-full origin-top select-none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
