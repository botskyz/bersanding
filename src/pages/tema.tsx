import { useState } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import { Check, Lock } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Nav } from '@/components/SiteChrome'
import { ThemePreview } from '@/components/ThemePreview'
import { findMine, getToken } from '@/lib/session'
import { FREE_THEME, PREMIUM_PRICE, THEMES, formatIDR, themeById } from '@/lib/themes'

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const token = getToken(ctx.req)
  const u = token ? await findMine(token) : null
  if (!u) return { redirect: { destination: '/buat', permanent: false } }
  return {
    props: {
      id: u.id,
      groom: u.groomName,
      bride: u.brideName,
      current: u.theme,
      colorId: u.colorId,
      premium: u.package === 'premium',
    },
  }
}

export default function Tema({
  id,
  groom,
  bride,
  current,
  colorId,
  premium,
}: {
  id: string
  groom: string
  bride: string
  current: string
  colorId: string
  premium: boolean
}) {
  const router = useRouter()
  const [selTheme, setSelTheme] = useState(current)
  const [selColor, setSelColor] = useState(colorId)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState('')

  const choose = async (theme: string, color: string) => {
    setError('')
    if (!premium && theme !== FREE_THEME) {
      router.push(`/bayar?id=${id}&theme=${theme}`)
      return
    }
    setBusy(theme)
    try {
      const res = await fetch(`/api/undangan/${id}/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, colorId: color }),
      })
      if (!res.ok) {
        setError('Terjadi kesalahan saat menyimpan tema. Coba lagi.')
        return
      }
      router.push(premium ? '/kelola?theme=1' : '/kelola?created=1')
    } finally {
      setBusy(null)
    }
  }

  const selectTheme = (t: (typeof THEMES)[number]) => {
    if (selTheme === t.id) return
    setSelTheme(t.id)
    setSelColor(t.variants[0].id)
  }

  const selectColor = (t: (typeof THEMES)[number], v: (typeof THEMES)[number]['variants'][number]) => {
    setSelTheme(t.id)
    setSelColor(v.id)
  }

  return (
    <Layout title="Pilih tema — Sanding">
      <div className="min-h-screen bg-[var(--ivory)]">
        <Nav />
        <main className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
          <p className="eyebrow">Langkah 2 dari 2</p>
          <h1 className="font-display mt-3 text-3xl tracking-tight sm:text-4xl">
            Halo, {groom.split(' ')[0]} & {bride.split(' ')[0]}!{' '}
            <span className="font-script text-[var(--gold)]">pilih tema</span>
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
            Setiap tema punya 3 pilihan warna — klik bulatan warna untuk melihat variasinya.
            Tema Gardenia gratis; tema lainnya terbuka setelah upgrade Premium —{' '}
            {formatIDR(PREMIUM_PRICE)} sekali bayar, berlaku selamanya.
          </p>

          {error && (
            <div className="mt-6 rounded-xl border border-[#b3405c] bg-[#fdf0f3] px-4 py-3 text-sm text-[#a63a52]">
              {error}
            </div>
          )}

          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {THEMES.map((t) => {
              const locked = !premium && t.premium
              const selected = selTheme === t.id
              const previewColor = selected ? selColor : t.variants[0].id
              return (
                <div key={t.id} className="group">
                  <button
                    onClick={() => selectTheme(t)}
                    className="block w-full text-left transition-transform duration-200 group-hover:-translate-y-1"
                  >
                    <div className="relative">
                      <ThemePreview
                        theme={t.id}
                        colorId={previewColor}
                        className={`shadow-lg shadow-[var(--ink)]/5 ${selected ? 'ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-[var(--ivory)]' : ''}`}
                      />
                      {locked && (
                        <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-[var(--ink)]/80 text-white backdrop-blur">
                          <Lock className="size-3.5" aria-hidden />
                        </span>
                      )}
                      {selected && (
                        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-[var(--gold)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fffdf7]">
                          <Check className="size-3" aria-hidden /> Aktif
                        </span>
                      )}
                    </div>
                  </button>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-display text-lg">{t.name}</p>
                      <p className="mt-0.5 text-xs text-[var(--muted)]">{t.tagline}</p>
                    </div>
                    <span
                      className={`mt-0.5 shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${
                        t.premium
                          ? 'border-[var(--gold-soft)] text-[var(--gold)]'
                          : 'border-[var(--line)] bg-[var(--paper)] text-[var(--muted)]'
                      }`}
                    >
                      {t.premium ? 'Premium' : 'Gratis'}
                    </span>
                  </div>
                  {/* Pilihan warna */}
                  <div className="mt-2.5 flex items-center gap-2">
                    {t.variants.map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => selectColor(t, v)}
                        title={v.name}
                        aria-label={`${t.name} — warna ${v.name}`}
                        className={`size-5 rounded-full border transition-transform hover:scale-110 ${
                          selected && selColor === v.id
                            ? 'ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-[var(--ivory)]'
                            : ''
                        }`}
                        style={{ background: v.swatch[1], borderColor: v.swatch[2] }}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => choose(t.id, selected ? selColor : t.variants[0].id)}
                    disabled={busy !== null}
                    className="mt-3 text-sm font-semibold text-[var(--berry)] disabled:opacity-60"
                  >
                    {locked
                      ? `Upgrade ${formatIDR(PREMIUM_PRICE)}`
                      : busy === t.id
                        ? 'Menyimpan…'
                        : selected
                          ? 'Pakai tema & warna ini →'
                          : 'Pakai tema ini →'}
                  </button>
                </div>
              )
            })}
          </div>

          <div className="mt-10 flex items-center justify-between border-t border-[var(--line)] pt-6">
            <Link href="/buat" className="btn btn-ghost btn-md">
              ← Ubah data lagi
            </Link>
            <Link href="/kelola" className="btn btn-outline btn-md">
              Nanti saja — ke halaman kelola
            </Link>
          </div>
        </main>
      </div>
    </Layout>
  )
}
