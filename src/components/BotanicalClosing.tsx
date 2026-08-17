export function BotanicalClosing({
  guestName,
  groomName,
  brideName,
}: {
  guestName: string
  groomName: string
  brideName: string
}) {
  return (
    <section className="relative -mx-5 overflow-hidden bg-[#ECE1CD] pb-4 pt-10 text-center">
      <div className="relative mx-auto aspect-[393/812] w-full">
        <img
          src="/theme-botanical/page-8/arch-glass.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full select-none"
        />
        {/* Teks, ditaruh di area transparan tengah lengkung (aman, piksel 170\u2013720 dari 812) */}
        <div className="absolute inset-x-0 top-[27%] flex flex-col items-center px-16">
          <p className="text-sm leading-relaxed text-[#3A4A34]">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i{' '}
            {guestName} berkenan hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
          <p className="mt-6 text-sm font-semibold leading-relaxed text-[#2E5A41]">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="font-script mt-8 text-[clamp(2rem,10vw,2.8rem)] leading-tight text-[#2E5A41]">
            {groomName}
            <br />&<br />
            {brideName}
          </p>
        </div>
      </div>

      <p className="-mt-4 text-xs tracking-[0.2em] text-[#3A4A34]/60">sharehalo</p>
    </section>
  )
}