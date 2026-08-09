import { useEffect, useState } from 'react'

function pad(n: number): string {
  return String(Math.max(0, n)).padStart(2, '0')
}

export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])

  const diff = new Date(`${target}T00:00:00`).getTime() - now
  const arrived = diff <= 0
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  if (arrived) {
    return (
      <div className="mt-14 text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-[var(--t-muted)]">Menuju hari bahagia</p>
        <p className="font-script mt-3 text-3xl text-[var(--t-gold)]">Hari bahagia telah tiba</p>
      </div>
    )
  }

  const boxes = [
    [pad(days), 'Hari'],
    [pad(hours), 'Jam'],
    [pad(minutes), 'Menit'],
    [pad(seconds), 'Detik'],
  ]

  return (
    <div className="mt-14">
      <p className="text-center text-[11px] uppercase tracking-[0.3em] text-[var(--t-muted)]">
        Menuju hari bahagia
      </p>
      <div className="mt-4 grid grid-cols-4 gap-2.5 sm:gap-4">
        {boxes.map(([value, label]) => (
          <div key={label} className="inv-cd">
            <div className="text-2xl font-medium tabular-nums sm:text-3xl">{value}</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[var(--t-muted)]">{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
