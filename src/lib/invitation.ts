export function formatDateID(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(y, m - 1, d))
}

export function formatTimeID(t: string): string {
  return t ? t.replace(':', '.') + ' WIB' : ''
}

export function initials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export function calendarLink(opts: {
  groom: string
  bride: string
  date: string
  time: string
  location: string
  address: string
}): string {
  const s = new Date(`${opts.date}T${opts.time || '09:00'}:00`)
  const e = new Date(s.getTime() + 2 * 60 * 60 * 1000)
  const fmt = (d: Date) => {
    const p = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`
  }
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${opts.groom} & ${opts.bride}`,
    dates: `${fmt(s)}/${fmt(e)}`,
    details: `Akad nikah ${opts.groom} & ${opts.bride}`,
    location: `${opts.location}, ${opts.address}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export function isExpired(und: {
  package: string
  expiresAt: string | Date | null
}): boolean {
  if (und.package === 'premium') return false
  if (!und.expiresAt) return false
  return new Date(und.expiresAt).getTime() < Date.now()
}

export function slugFromNames(groom: string, bride: string, rand: string): string {
  const part = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .split(/\s+/)[0]
      .replace(/[^a-z0-9]/g, '')
  return `${part(groom) || 'undangan'}-${part(bride) || 'undangan'}-${rand}`
}

export const DEFAULT_STORY =
  'Dua hati yang dipertemukan oleh waktu, dipersatukan oleh doa. Setiap pertemuan adalah takdir, dan hari ini kami memulai babak baru bersama.'
