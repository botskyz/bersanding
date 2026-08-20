interface PersonCardProps {
  name: string
  parents: string
  label: 'Putra' | 'Putri'
  photo: string
  flip?: boolean
}

function PersonCard({ name, parents, label, photo, flip }: PersonCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      {/* Karangan bunga di belakang */}
      <img
        src="/theme-botanical/page-3/wreath.png"
        alt=""
        aria-hidden
        className="pointer-events-none w-full select-none"
      />

      {/* Plakat bergerigi + foto + nama, ditumpuk di tengah karangan */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[19%] pb-[8%]">
        <div className="relative w-full">
          <img
            src="/theme-botanical/page-3/frame.png"
            alt=""
            aria-hidden
            className="pointer-events-none w-full select-none"
          />
          <div className="absolute inset-0 flex flex-col items-center px-[9%] pt-[9%]">
            <div className="aspect-square w-[82%] overflow-hidden rounded-full border border-[#c9c2b4] bg-white/60">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            </div>
            <p className="font-script mt-3 text-2xl leading-none text-[#2E5A41]">{name}</p>
            <p className="mt-2 text-center text-[11px] leading-snug text-[#5c5245]">
              {label} dari
              <br />
              {parents}
            </p>
          </div>
        </div>
      </div>

      {/* Kolibri kecil di sudut */}
      <img
        src="/theme-botanical/page-3/hummingbird-2.png"
        alt=""
        aria-hidden
        className={`pointer-events-none absolute bottom-[6%] w-14 select-none sm:w-16 ${
          flip ? 'left-[2%] -scale-x-100' : 'right-[2%]'
        }`}
      />
    </div>
  )
}

export function BotanicalCouple({
  groomName,
  groomParents,
  groomPhoto,
  brideName,
  brideParents,
  bridePhoto,
}: {
  groomName: string
  groomParents: string
  groomPhoto: string
  brideName: string
  brideParents: string
  bridePhoto: string
}) {
  return (
    <section className="relative -mx-5 overflow-hidden bg-[#ECE1CD] px-6 pb-20 pt-16 text-center">
      <p className="relative mx-auto max-w-xs text-sm leading-relaxed text-[#3A4A34]">
        Kami mengundang Bapak/Ibu/Saudara/i, pada acara resepsi pernikahan anak kami,
      </p>

      <div className="relative mt-10 space-y-14">
        <PersonCard name={groomName} parents={groomParents} label="Putra" photo={groomPhoto} />
        <PersonCard
          name={brideName}
          parents={brideParents}
          label="Putri"
          photo={bridePhoto}
          flip
        />
      </div>
    </section>
  )
}