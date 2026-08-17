import { CalendarDays, ChevronDown, Clock3, HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Countdown } from '@/components/Countdown'
import { MusicButton } from '@/components/MusicButton'
import { Ornament } from '@/components/Ornament'
import { BotanicalCover } from '@/components/BotanicalCover'
import { BotanicalEvents } from '@/components/BotanicalEvents'
import { BotanicalCouple } from '@/components/BotanicalCouple'
import { useParallax } from '@/components/Parallax'
import {
  DEFAULT_STORY,
  calendarLink,
  formatDateID,
  formatTimeID,
  initials,
} from '@/lib/invitation'

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

function Divider({ className }: { className?: string }) {
  return <Ornament className={cn('mx-auto w-56 text-[var(--t-gold)] opacity-75', className)} />
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center">
      <Divider />
      <h2 className="mt-6 text-[clamp(1.5rem,4vw,1.9rem)]">{children}</h2>
    </div>
  )
}

function CoupleCard({ name, parents }: { name: string; parents: string }) {
  return (
    <div className="inv-card rounded-2xl px-6 py-8 text-center">
      <div className="inv-mono mx-auto size-14 text-3xl">{initials(name)}</div>
      <p className="font-script mt-4 text-4xl leading-none">{name}</p>
      <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-[var(--t-muted)]">
        Putra / Putri dari
      </p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--t-muted)]">{parents}</p>
    </div>
  )
}

function EventCard({
  icon,
  title,
  date,
  time,
  location,
  address,
  calendarHref,
}: {
  icon: React.ReactNode
  title: string
  date: string
  time: string
  location: string
  address: string
  calendarHref: string
}) {
  return (
    <div className="inv-card rounded-2xl px-6 py-8 text-center">
      <div className="inv-mono mx-auto size-12">{icon}</div>
      <h3 className="mt-4 text-xs uppercase tracking-[0.3em] text-[var(--t-accent)]">{title}</h3>
      <p className="mt-3 text-xl">{formatDateID(date)}</p>
      <p className="mt-0.5 text-lg text-[var(--t-gold)]">{formatTimeID(time)}</p>
      <Ornament className="mx-auto my-6 w-40 text-[var(--t-gold)] opacity-70" />
      <p className="text-lg">{location}</p>
      <p className="mt-1.5 text-sm leading-relaxed text-[var(--t-muted)]">{address}</p>
      <a href={calendarHref} target="_blank" rel="noreferrer" className="inv-btn mt-6">
        <CalendarDays className="size-4" />
        Simpan tanggal
      </a>
    </div>
  )
}

export function Invitation({ und }: { und: InvitationData }) {
  useParallax()

  return (
    <div
      className={cn('inv-shell min-h-screen', `theme-${und.theme}`)}
      data-variant={und.colorId}
    >
      <div className="mx-auto max-w-xl px-5 pb-14">
        {/* Sampul — Botanical Garden */}
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

        {/* Pembuka — Botanical Garden */}
        <section id="konten-mulai" className="relative -mx-5 overflow-hidden bg-[#ECE1CD] px-8 py-20 text-center">
          {/* Awan di bagian atas, memudar ke krem */}
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

        {/* Mempelai — Botanical Garden */}
        <BotanicalCouple
          groomName={und.groomName}
          groomParents={und.groomParents}
          groomPhoto={und.coverPhoto}
          brideName={und.brideName}
          brideParents={und.brideParents}
          bridePhoto={und.gallery[0] || und.coverPhoto}
        />

        {/* Rangkaian acara — Botanical Garden */}
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

        {/* Kisah */}
        <section className="relative mt-20 text-center">
          <SectionTitle>Kisah Kami</SectionTitle>
          <p className="mx-auto mt-7 max-w-md text-sm leading-relaxed text-[var(--t-muted)]">
            {und.story || DEFAULT_STORY}
          </p>
          {und.quote && (
            <p className="font-script mt-8 text-[1.55rem] leading-snug text-[var(--t-gold)]">
              {und.quote}
            </p>
          )}
        </section>

        {/* Galeri */}
        {und.gallery.length > 0 && (
          <section className="mt-20">
            <SectionTitle>Galeri Momen</SectionTitle>
            <div className="mt-9 grid grid-cols-2 gap-3">
              {und.gallery.map((src, i) => (
                <div
                  key={src + i}
                  className={cn(
                    'overflow-hidden rounded-xl border border-[var(--t-line)]',
                    i === 0 && 'col-span-2',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={`Momen ${und.groomName} & ${und.brideName}`}
                    loading="lazy"
                    className={cn('w-full object-cover', i === 0 ? 'aspect-[16/10]' : 'aspect-[4/5]')}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Penutup */}
        <section className="relative mt-20 text-center">
          <Ornament
            data-depth={0.05}
            aria-hidden
            className="pointer-events-none absolute -top-8 right-0 w-64 rotate-180 text-[var(--t-accent)] opacity-10"
          />
          <Divider />
          <p className="mt-6 text-sm leading-relaxed text-[var(--t-muted)]">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila{' '}
            <span className="font-script text-lg text-[var(--t-ink)]">{und.guestName}</span> berkenan
            hadir untuk memberikan doa restu kepada kedua mempelai.
          </p>
          <p className="font-script mt-8 text-2xl">
            Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="font-script mt-10 text-[2.6rem] leading-tight text-[var(--t-accent)]">
            {und.groomName}
            <br />&<br />
            {und.brideName}
          </p>
        </section>

        <footer className="mt-20 border-t border-[var(--t-line)] pt-6 text-center">
          <p className="text-xs text-[var(--t-muted)]">
            Dibuat dengan ♥ di{' '}
            <Link href="/" className="underline decoration-[var(--t-line)] underline-offset-2">
              sharehalo
            </Link>
          </p>
        </footer>
      </div>

      {und.musicUrl && <MusicButton url={und.musicUrl} title={und.musicTitle} />}
    </div>
  )
}
