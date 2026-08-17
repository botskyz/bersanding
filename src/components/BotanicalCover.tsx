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
  return (
    <section className="relative -mx-5 flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#ECE1CD] py-10 text-center">
      {/* Grup lengkung + teks + vas bunga — satu kesatuan, full-bleed edge-to-edge */}
      <div className="relative w-full">
        <img
          src="/theme-botanical/page-1/arch.png"
          alt=""
          aria-hidden
          className="pointer-events-none w-full select-none"
        />
        <div className="absolute inset-x-0 top-[24%] flex flex-col items-center px-12">
          <p className="text-[13px] italic font-medium tracking-[0.3em] text-[#3A4A34]">
            The Wedding of
          </p>
          <p className="font-script mt-3 text-[clamp(2rem,9vw,2.9rem)] leading-[1.05] text-[#2E5A41]">
            {groomName}
          </p>
          <p className="font-script -mt-1 text-[clamp(1.7rem,7vw,2.4rem)] leading-none text-[#2E5A41]">&</p>
          <p className="font-script -mt-1 text-[clamp(2rem,9vw,2.9rem)] leading-[1.05] text-[#2E5A41]">
            {brideName}
          </p>
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
          <img
            src="/theme-botanical/page-1/floral-left.png"
            alt=""
            aria-hidden
            className="pointer-events-none w-[34%] max-w-[150px] select-none"
          />
          <img
            src="/theme-botanical/page-1/floral-right.png"
            alt=""
            aria-hidden
            className="pointer-events-none w-[34%] max-w-[150px] select-none"
          />
        </div>
      </div>
    </section>
  )
}