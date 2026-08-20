import { BotanicalCover } from '@/components/themes/botanical/BotanicalCover'
import { BotanicalEvents } from '@/components/themes/botanical/BotanicalEvents'
import { BotanicalCouple } from '@/components/themes/botanical/BotanicalCouple'
import { BotanicalStory } from '@/components/themes/botanical/BotanicalStory'
import { BotanicalQuote } from '@/components/themes/botanical/BotanicalQuote'
import { BotanicalGallery } from '@/components/themes/botanical/BotanicalGallery'
import { BotanicalClosing } from '@/components/themes/botanical/BotanicalClosing'
import { Ornament } from '@/components/Ornament'
import { MusicButton } from '@/components/MusicButton'
import { DEFAULT_STORY } from '@/lib/invitation'

interface InvitationData {
  groomName: string
  brideName: string
  groomParents: string
  brideParents: string
  akadDate: string
  akadTime: string
  akadLocation: string
  akadAddress: string
  resepsiDate: string
  resepsiTime: string
  resepsiLocation: string
  resepsiAddress: string
  story: string
  quote: string
  guestName: string
  theme: string
  colorId: string
  coverPhoto: string
  gallery: string[]
  musicUrl: string
  musicTitle: string
}

/** Tema "Botanical Garden" \u2014 layout ilustrasi 8-halaman khusus, terpisah dari
 * sistem tema CSS-variable generik yang dipakai tema lain (Gardenia, dst). */
export function BotanicalInvitation({ und }: { und: InvitationData }) {
  return (
    <div className="inv-shell min-h-screen theme-botanical" data-variant={und.colorId}>
      <div className="mx-auto max-w-xl px-5 pb-14">
        <BotanicalCover
          groomName={und.groomName}
          brideName={und.brideName}
          guestName={und.guestName}
          onOpen={() => {
            document
              .getElementById('konten-mulai')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
        />

        {/* Pembuka */}
        <section id="konten-mulai" className="relative -mx-5 overflow-hidden bg-[#ECE1CD] px-8 py-20 text-center">
          <div className="pointer-events-none absolute inset-x-0 top-0 -mx-3 h-56 overflow-hidden" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/theme-botanical/page-3/clouds.png"
              alt=""
              className="w-full select-none object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#ECE1CD]" />
          </div>

          <Ornament
            data-depth={0.06}
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 -ml-36 w-72 text-[#2E5A41] opacity-15"
          />
          <Ornament className="mx-auto w-56 text-[#2E5A41] opacity-60" />
          <p className="mt-6 text-xl leading-relaxed text-[#3A4A34]">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[#3A4A34]/80">
            Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan
            putra-putri kami:
          </p>
          <p className="font-script mt-8 text-[1.7rem] leading-snug text-[#2E5A41]">
            {und.groomParents}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#3A4A34]/70">dengan</p>
          <p className="font-script mt-4 text-[1.7rem] leading-snug text-[#2E5A41]">
            {und.brideParents}
          </p>
        </section>

        <BotanicalCouple
          groomName={und.groomName}
          groomParents={und.groomParents}
          groomPhoto={und.coverPhoto}
          brideName={und.brideName}
          brideParents={und.brideParents}
          bridePhoto={und.gallery[0] || und.coverPhoto}
        />

        <BotanicalEvents
          groomName={und.groomName}
          brideName={und.brideName}
          akadDate={und.akadDate}
          akadTime={und.akadTime}
          akadLocation={und.akadLocation}
          akadAddress={und.akadAddress}
          resepsiDate={und.resepsiDate}
          resepsiTime={und.resepsiTime}
          resepsiLocation={und.resepsiLocation}
          resepsiAddress={und.resepsiAddress}
        />

        <BotanicalStory quote={und.quote || DEFAULT_STORY} />

        <BotanicalQuote
          groomName={und.groomName}
          brideName={und.brideName}
          story={und.story || DEFAULT_STORY}
        />

        <BotanicalGallery gallery={und.gallery} groomName={und.groomName} brideName={und.brideName} />

        <BotanicalClosing
          guestName={und.guestName}
          groomName={und.groomName}
          brideName={und.brideName}
        />
      </div>

      {und.musicUrl && <MusicButton url={und.musicUrl} title={und.musicTitle} />}
    </div>
  )
}
