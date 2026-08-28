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
    <section className="botanical-page relative -mx-5 flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#ECE1CD] pb-4 pt-6 text-center">
      {/* Lengkung emas \u2014 cuma dekorasi atas (di-crop), teks di BAWAHNYA sebagai
          elemen flow biasa (bukan absolute di dalam kotak tinggi tetap), supaya
          jarak ke elemen berikutnya selalu konsisten walau teks panjang/pendek. */}
      <div className="relative h-72 w-full overflow-hidden">
        <img
          data-depth={0.16}
          src="/theme-botanical/page-6/arch-gold.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 w-full select-none"
        />
      </div>

      <div data-depth={0.22} className="relative -mt-8 px-14">
        <p className="font-script text-center text-[clamp(1.15rem,5vw,1.7rem)] leading-snug text-[#2E5A41]">
          {story}
        </p>
        <p className="mt-5 text-sm lowercase tracking-[0.15em] text-[#3A4A34]">
          {groomName} &amp; {brideName}
        </p>
      </div>

      {/* Vas bunga kiri-kanan, full-bleed nempel di tepi layar, langsung
          menyusul teks di atas (jarak konsisten via margin-top negatif kecil) */}
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

