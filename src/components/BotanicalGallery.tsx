export function BotanicalGallery({
  gallery,
  groomName,
  brideName,
}: {
  gallery: string[]
  groomName: string
  brideName: string
}) {
  if (gallery.length === 0) return null

  return (
    <section className="relative -mx-5 overflow-hidden bg-[#ECE1CD] px-6 pb-16 pt-10">
      {/* Gazebo, samar di belakang judul */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -mx-3 h-48 overflow-hidden opacity-30" aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/theme-botanical/page-7/gazebo.png"
          alt=""
          className="w-full select-none object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ECE1CD]" />
      </div>

      <p className="font-script relative text-center text-[2.6rem] leading-none text-[#2E5A41]">
        Gallery
      </p>

      <div className="relative mx-auto mt-8 grid max-w-md grid-cols-2 gap-3">
        {gallery.map((src, i) => (
          <div
            key={src + i}
            className={`overflow-hidden rounded-2xl border border-[#2E5A41]/15 ${
              i === 0 ? 'col-span-2' : ''
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Momen ${groomName} & ${brideName}`}
              loading="lazy"
              className={`w-full object-cover ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]'}`}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
