export function BotanicalStory({ quote }: { quote: string }) {
  return (
    <section className="botanical-page relative -mx-5 flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#ECE1CD] px-6 pb-4 pt-16 text-center">
      {/* Awan di belakang judul */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -mx-3 h-52 overflow-hidden" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-depth={0.16}
          src="/theme-botanical/page-3/clouds.png"
          alt=""
          className="w-full select-none object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ECE1CD]" />
      </div>

      <p data-depth={0.26} className="font-script relative text-[2.8rem] leading-none text-[#2E5A41]">Kisah Kami</p>

      {/* Kartu putih membulat, berisi ayat — kapsul penuh, tinggi menyesuaikan panjang teks */}
      <div className="relative mx-auto mt-10 max-w-sm rounded-[2.5rem] bg-[#FBF8F0] px-8 pb-14 pt-12 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.1em] text-[#2E5A41]">
          Surat Ar-Rum ayat 21
        </p>
        <p className="mt-5 text-sm leading-relaxed text-[#3A4A34]">{quote}</p>
      </div>

      {/* Air mancur (sudah termasuk karangan bunga di kedua sisi, tidak perlu tambahan) — diberi jarak supaya tidak menindih kartu */}
      <img
        data-depth={0.18}
        src="/theme-botanical/page-5/fountain.png"
        alt=""
        aria-hidden
        className="pointer-events-none relative z-10 mx-auto mt-6 w-64 select-none pb-8 sm:w-72"
      />
    </section>
  )
}
