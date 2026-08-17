import { useState } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Check, CreditCard, Loader2 } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Nav } from '@/components/SiteChrome'
import { findMine, getToken } from '@/lib/session'
import { PREMIUM_PRICE, formatIDR, themeById } from '@/lib/themes'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getToken(ctx.req)
  const u = token ? await findMine(token) : null
  if (!u) return { redirect: { destination: '/buat', permanent: false } }
  if (u.package === 'premium') return { redirect: { destination: '/kelola', permanent: false } }
  const theme = typeof ctx.query.theme === 'string' ? ctx.query.theme : 'pelaminan'
  return { props: { id: u.id, groom: u.groomName, bride: u.brideName, theme } }
}

const benefits = [
  'Semua 4 tema undangan',
  'Aktif selamanya — tidak kadaluarsa',
  'Ganti tema kapan saja',
  'Dukungan prioritas',
]

export default function Bayar({
  id,
  groom,
  bride,
  theme,
}: {
  id: string
  groom: string
  bride: string
  theme: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const t = themeById(theme)

  const pay = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ undanganId: id, theme }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.invoiceUrl) {
        setError('Pembayaran belum bisa diproses saat ini. Coba lagi beberapa saat ya.')
        return
      }
      window.location.assign(data.invoiceUrl)
    } catch {
      setError('Koneksi bermasalah — periksa internetmu dan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout title="Upgrade Premium — sharehalo">
      <div className="min-h-screen bg-[var(--ivory)]">
        <Nav />
        <main className="mx-auto max-w-2xl px-5 py-12 sm:px-8">
          <p className="eyebrow">Sekali bayar, selamanya</p>
          <h1 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
            Upgrade ke <span className="font-script text-[var(--gold)]">Premium</span>
          </h1>

          {error && (
            <div className="mt-6 rounded-xl border border-[#b3405c] bg-[#fdf0f3] px-4 py-3 text-sm text-[#a63a52]">
              {error}
            </div>
          )}

          <div className="sig-frame mt-8 p-7">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 text-sm">
              <span className="text-[var(--muted)]">Undangan {groom} & {bride}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--line)] py-4 text-sm">
              <span className="text-[var(--muted)]">Tema {t.name}</span>
              <span className="font-semibold">Termasuk setelah bayar</span>
            </div>
            <div className="flex items-center justify-between border-b border-[var(--line)] py-4 text-sm">
              <span className="text-[var(--muted)]">Paket Premium</span>
              <span className="font-semibold">{formatIDR(PREMIUM_PRICE)}</span>
            </div>
            <div className="flex items-center justify-between pt-4">
              <span className="font-display text-lg">Total</span>
              <span className="font-display text-2xl text-[var(--berry)]">{formatIDR(PREMIUM_PRICE)}</span>
            </div>
          </div>

          <ul className="mt-6 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-[var(--muted)]">
                <Check className="mt-0.5 size-4 shrink-0 text-[var(--gold)]" aria-hidden />
                {b}
              </li>
            ))}
          </ul>

          <button onClick={pay} disabled={loading} className="btn btn-gold btn-lg mt-8 w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden /> Menyiapkan pembayaran…
              </>
            ) : (
              <>
                <CreditCard className="size-4" aria-hidden /> Bayar {formatIDR(PREMIUM_PRICE)}
              </>
            )}
          </button>
          <p className="mt-4 text-center text-xs leading-relaxed text-[var(--muted)]">
            Pembayaran diproses aman oleh Xendit — QRIS, e-wallet (GoPay, OVO, DANA, ShopeePay),
            dan transfer virtual bank. Setelah membayar kamu akan kembali ke halaman kelola.
          </p>
          <div className="mt-6 text-center">
            <Link href="/kelola" className="btn btn-ghost btn-sm">
              Bayar nanti — kembali ke kelola
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  )
}
