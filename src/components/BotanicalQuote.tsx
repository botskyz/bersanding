export function BotanicalQuote({
  groomName,
  brideName,
  story,
}: {
  groomName: string
  brideName: string
  story: string
}) {
  return (
    <section className="relative -mx-5 overflow-hidden bg-[#ECE1CD] pb-4 pt-6 text-center">
      {/* Lengkung emas, full width, hanya bagian atas aset yang ditampilkan (cropped) */}
      <div className="relative h-[34rem] w-full overflow-hidden">
        <img
          src="/theme-botanical/page-6/arch-gold.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 w-full select-none"
        />
        {/* Teks dimulai tepat di bawah titik terlebar lengkung (aman, tidak nabrak) */}
        <div className="absolute inset-x-0 top-[260px] flex flex-col items-center px-12">
          <p className="font-script text-center text-[clamp(1.3rem,6vw,2rem)] leading-snug text-[#2E5A41]">
            {story}
          </p>
        </div>
      </div>

      <p className="-mt-2 text-sm lowercase tracking-[0.15em] text-[#3A4A34]">
        {groomName} &amp; {brideName}
      </p>

      {/* Vas bunga kiri-kanan, full-bleed nempel di tepi layar */}
      <div className="relative -mt-6 flex items-end justify-between">
        <img
          src="/theme-botanical/page-6/floral-left.png"
          alt=""
          aria-hidden
          className="pointer-events-none w-[34%] max-w-[150px] select-none"
        />
        <img
          src="/theme-botanical/page-6/floral-right.png"
          alt=""
          aria-hidden
          className="pointer-events-none w-[34%] max-w-[150px] select-none"
        />
      </div>
    </section>
  )
}