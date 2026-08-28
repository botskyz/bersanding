import { useEffect, useRef, useState } from 'react'
import { calendarLink, formatDateID, formatTimeID } from '@/lib/invitation'

interface BotanicalEventsProps {
  groomName: string
  brideName: string
  akadDate: string
  akadTime: string
  akadLocation: string
  akadAddress: string
  resepsiDate: string
  resepsiTime: string
  resepsiLocation: string
  resepsiAddress: string
}

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

/** Kolibri: terbang masuk dari kanan sekali saat pertama terlihat, lalu naik-turun terus. */
function FlyingHummingbird({ className, mirrored }: { className?: string; mirrored?: boolean }) {
  const ref = useRef<HTMLImageElement>(null)
  const [phase, setPhase] = useState<'idle' | 'flying' | 'bobbing'>('idle')

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase('flying')
          observer.disconnect()
        }
      },
      { threshold: 0.4 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={ref}
      src="/theme-botanical/page-2/hummingbird.png"
      alt=""
      aria-hidden
      onAnimationEnd={() => {
        if (phase === 'flying') setPhase('bobbing')
      }}
      className={`pointer-events-none select-none ${mirrored ? '-scale-x-100' : ''} ${
        phase === 'idle' ? 'translate-x-32 opacity-0' : ''
      } ${phase === 'flying' ? 'hb-fly-in' : ''} ${phase === 'bobbing' ? 'hb-bob' : ''} ${
        className ?? ''
      }`}
    />
  )
}

/** Countdown bergaya kotak hijau tua, khusus tampilan Botanical Garden. */
function BotanicalCountdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const boxes =
    now === null
      ? [
          ['--', 'Hari'],
          ['--', 'Jam'],
          ['--', 'Menit'],
          ['--', 'Detik'],
        ]
      : (() => {
          const diff = new Date(`${target}T00:00:00`).getTime() - now
          return [
            [pad(Math.floor(diff / 86400000)), 'Hari'],
            [pad(Math.floor((diff % 86400000) / 3600000)), 'Jam'],
            [pad(Math.floor((diff % 3600000) / 60000)), 'Menit'],
            [pad(Math.floor((diff % 60000) / 1000)), 'Detik'],
          ]
        })()

  return (
    <div className="mt-10 grid grid-cols-4 gap-3">
      {boxes.map(([value, label]) => (
        <div
          key={label}
          className="rounded-xl bg-[#2E5A41] px-2 py-3 text-center text-[#F3F0E4]"
        >
          <div className="text-xl font-medium tabular-nums sm:text-2xl">{value}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-[0.15em] opacity-80">
            {label}
          </div>
        </div>
      ))}
    </div>
  )
}

function EventBlock({
  title,
  date,
  time,
  location,
  address,
}: {
  title: string
  date: string
  time: string
  location: string
  address: string
}) {
  const mapsHref = `https://www.google.com/maps/search/${encodeURIComponent(
    `${location} ${address}`,
  )}`
  return (
    <div className="text-center">
      <p data-depth={0.2} className="font-script text-[2.6rem] leading-tight text-[#2E5A41]">{title}</p>
      <p className="mt-5 text-sm tracking-[0.05em] text-[#3A4A34]">
        {formatDateID(date).toUpperCase()}
      </p>
      <p className="mt-1 text-sm tracking-[0.05em] text-[#3A4A34]">{formatTimeID(time)}</p>
      <p className="mx-auto mt-4 max-w-[220px] text-sm leading-relaxed text-[#3A4A34]">
        {address || location}
      </p>
      <a
        href={mapsHref}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-block rounded-full bg-[#2E5A41] px-6 py-2 text-sm text-[#F3F0E4]"
      >
        Location
      </a>
    </div>
  )
}

export function BotanicalEvents({
  groomName,
  brideName,
  akadDate,
  akadTime,
  akadLocation,
  akadAddress,
  resepsiDate,
  resepsiTime,
  resepsiLocation,
  resepsiAddress,
}: BotanicalEventsProps) {
  return (
    <section className="botanical-page relative -mx-5 flex min-h-[100dvh] flex-col justify-center overflow-hidden bg-[#ECE1CD] px-8 py-20 text-center">
      {/* Kolibri, nempel di sisi kiri, tumpang tindih antar dua acara */}
      <FlyingHummingbird className="absolute left-0 top-[38%] w-20 -mt-11 sm:w-24 sm:-mt-14" />

      <div className="relative mx-auto max-w-sm">
        <EventBlock
          title="Akad Nikah"
          date={akadDate}
          time={akadTime}
          location={akadLocation}
          address={akadAddress}
        />

        <div className="mx-auto my-14 h-px w-24 bg-[#2E5A41]/25" />

        <EventBlock
          title="Resepsi"
          date={resepsiDate}
          time={resepsiTime}
          location={resepsiLocation}
          address={resepsiAddress}
        />

        <BotanicalCountdown target={akadDate} />

        <a
          href={calendarLink({
            groom: groomName,
            bride: brideName,
            date: resepsiDate,
            time: resepsiTime,
            location: resepsiLocation,
            address: resepsiAddress,
          })}
          target="_blank"
          rel="noreferrer"
          className="mt-8 inline-block rounded-full border border-[#2E5A41] px-6 py-2.5 text-sm text-[#2E5A41]"
        >
          Add to calendar
        </a>
      </div>
    </section>
  )
}
