import { CalendarDays, ChevronDown, Clock3, HeartHandshake } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Countdown } from '@/components/Countdown'
import { MusicButton } from '@/components/MusicButton'
import { Ornament } from '@/components/Ornament'
import { useParallax } from '@/components/Parallax'
import { BotanicalInvitation } from '@/components/BotanicalInvitation'
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
  const overPhoto = !!und.coverPhoto

  // Tema "Botanical Garden" pakai layout ilustrasi khusus, terpisah total
  // dari sistem tema CSS-variable generik di bawah ini.
  if (und.theme === 'botanical') {
    return <BotanicalInvitation und={und} />
  }

  return (
    <div
      className={cn('inv-shell min-h-screen', `theme-${und.theme}`)}
      data-variant={und.colorId}
    >
      <div className="mx-auto max-w-xl px-5 pb-14">
        {/* Sampul foto dengan parallax */}
        <section className="relative flex min-h-[94vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
          {overPhoto ? (
            <>
              <div data-depth={0.16} className="absolute inset-x-0 -top-[14%] h-[128%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={und.coverPhoto}
                  alt={`${und.groomName} & ${und.brideName}`}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-[var(--t-bg)]" />
            </>
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(90%_60%_at_50%_0%,var(--t-glow),transparent_60%)]" />
          )}

          <div className={cn('relative', overPhoto && 'text-white')}>
            <p
              className={cn(
                'text-[11px] uppercase tracking-[0.35em]',
                overPhoto ? 'text-white/85' : 'text-[var(--t-muted)]',
              )}
            >
              Undangan Pernikahan
            </p>
            <h1
              className={cn(
                'font-script mt-7 text-[clamp(2.9rem,12vw,4.4rem)] leading-[1.08]',
                overPhoto ? 'drop-shadow-md' : 'text-[var(--t-ink)]',
              )}
            >
              {und.groomName}
              <br />
              <span className="text-[var(--t-gold)]">&</span>
              <br />
              {und.brideName}
            </h1>
            <Ornament
              className={cn('mx-auto mt-7 w-52', overPhoto ? 'text-white/90' : 'text-[var(--t-gold)]')}
            />
            <p className="mt-6 text-lg">{formatDateID(und.akadDate)}</p>
            <p
              className={cn(
                'mx-auto mt-9 inline-block rounded-full border px-6 py-2.5 text-[10px] uppercase tracking-[0.2em] backdrop-blur-md',
                overPhoto
                  ? 'border-white/70 bg-white/10 text-white'
                  : 'inv-chip',
              )}
            >
              Kepada Yth. {und.guestName}
            </p>
          </div>
          <ChevronDown
            className="absolute bottom-6 size-5 animate-bounce text-[var(--t-gold)]"
            aria-hidden
          />
        </section>

        <Countdown target={und.akadDate} />

        {/* Pembuka */}
        <section className="relative mt-20 text-center">
          <Ornament
            data-depth={0.06}
            aria-hidden
            className="pointer-events-none absolute -top-10 left-1/2 -ml-36 w-72 text-[var(--t-accent)] opacity-15"
          />
          <Divider />
          <p className="mt-6 text-xl leading-relaxed">
            Assalamu&apos;alaikum Warahmatullahi Wabarakatuh
          </p>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-[var(--t-muted)]">
            Dengan memohon rahmat dan ridha Allah SWT, kami bermaksud menyelenggarakan pernikahan
            putra-putri kami:
          </p>
          <p className="font-script mt-8 text-[1.7rem] leading-snug text-[var(--t-accent)]">
            {und.groomParents}
          </p>
          <p className="mt-4 text-[10px] uppercase tracking-[0.3em] text-[var(--t-muted)]">dengan</p>
          <p className="font-script mt-4 text-[1.7rem] leading-snug text-[var(--t-accent)]">
            {und.brideParents}
          </p>
        </section>

        {/* Mempelai */}
        <section className="mt-20">
          <SectionTitle>Kedua Mempelai</SectionTitle>
          <div className="mt-9 grid gap-5 sm:grid-cols-2">
            <CoupleCard name={und.groomName} parents={und.groomParents} />
            <CoupleCard name={und.brideName} parents={und.brideParents} />
          </div>
        </section>

        {/* Rangkaian acara */}
        <section className="mt-20">
          <SectionTitle>Rangkaian Acara</SectionTitle>
          <div className="mt-9 grid gap-5">
            <EventCard
              icon={<HeartHandshake className="size-5" />}
              title="Akad Nikah"
              date={und.akadDate}
              time={und.akadTime}
              location={und.akadLocation}
              address={und.akadAddress}
              calendarHref={calendarLink({
                groom: und.groomName,
                bride: und.brideName,
                date: und.akadDate,
                time: und.akadTime,
                location: und.akadLocation,
                address: und.akadAddress,
              })}
            />
            <EventCard
              icon={<Clock3 className="size-5" />}
              title="Resepsi"
              date={und.resepsiDate}
              time={und.resepsiTime}
              location={und.resepsiLocation}
              address={und.resepsiAddress}
              calendarHref={calendarLink({
                groom: und.groomName,
                bride: und.brideName,
                date: und.resepsiDate,
                time: und.resepsiTime,
                location: und.resepsiLocation,
                address: und.resepsiAddress,
              })}
            />
          </div>
        </section>

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
