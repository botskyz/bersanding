import { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import type { GetServerSideProps } from 'next'
import Link from 'next/link'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Loader2,
  Lock,
} from 'lucide-react'
import { desc, eq } from 'drizzle-orm'
import { Layout } from '@/components/Layout'
import { Nav } from '@/components/SiteChrome'
import { ThemePreview } from '@/components/ThemePreview'
import { GalleryPicker } from '@/components/GalleryPicker'
import { MusicPicker, type MusicSelection } from '@/components/MusicPicker'
import { PhotoPicker } from '@/components/PhotoPicker'
import { GALLERY_PRESETS, COVER_PRESETS } from '@/lib/photos'
import { db } from '@/lib/db'
import { pembayaran, undangan } from '@/lib/db/schema'
import { adminCookie, findMine, getToken } from '@/lib/session'
import { PREMIUM_PRICE, THEMES, formatIDR } from '@/lib/themes'
import { coreSchema } from '@/lib/validation'
import { Invoice } from '@/lib/xendit'

interface UndProps {
  id: string
  slug: string
  email: string
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
  package: string
  coverPhoto: string
  gallery: string[]
  musicUrl: string
  musicTitle: string
  expiresAt: string | null
}

type PayProps = Record<string, string | number | null>

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  let token = getToken(ctx.req)
  let u = token ? await findMine(token) : null
  const queryToken = typeof ctx.query.token === 'string' ? ctx.query.token : null
  if (!u && queryToken) {
    const found = await findMine(queryToken)
    if (found) {
      u = found
      ctx.res.setHeader('Set-Cookie', adminCookie(queryToken))
    }
  }
  if (!u) return { props: { authed: false } }

  let payment =
    (
      await db
        .select()
        .from(pembayaran)
        .where(eq(pembayaran.undanganId, u.id))
        .orderBy(desc(pembayaran.createdAt))
        .limit(1)
    )[0] ?? null

  // Sinkronkan status invoice yang masih menunggu (cadangan bila webhook terlambat).
  if (payment && payment.status === 'PENDING' && payment.externalId) {
    try {
      const inv = await Invoice.getInvoiceById({ invoiceId: payment.externalId })
      const st = inv.status
      if (st === 'PAID' || st === 'SETTLED') {
        await db
          .update(pembayaran)
          .set({ status: 'PAID', paidAt: new Date() })
          .where(eq(pembayaran.id, payment.id))
        const patch: { package: string; expiresAt: null; theme?: string } = {
          package: 'premium',
          expiresAt: null,
        }
        if (payment.requestedTheme) patch.theme = payment.requestedTheme
        await db.update(undangan).set(patch).where(eq(undangan.id, u.id))
        payment = { ...payment, status: 'PAID' }
      } else if (st === 'EXPIRED') {
        await db.update(pembayaran).set({ status: 'EXPIRED' }).where(eq(pembayaran.id, payment.id))
        payment = { ...payment, status: 'EXPIRED' }
      }
    } catch {
      // Invoice lookup bisa gagal saat kunci Xendit belum terisi — biarkan pending.
    }
  }

  const serial = (v: unknown) => JSON.parse(JSON.stringify(v))
  const banner = ctx.query.paid
    ? 'paid'
    : ctx.query.created
      ? 'created'
      : ctx.query.payment
        ? 'failed'
        : ctx.query.theme
          ? 'theme'
          : null

  return {
    props: {
      authed: true,
      und: serial(u) as UndProps,
      payment: payment ? (serial(payment) as PayProps) : null,
      banner,
    },
  }
}

interface EditForm {
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
  email: string
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string
  name: keyof EditForm
  value: string
  onChange: (name: keyof EditForm, value: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
}) {
  const common = {
    id: name,
    name,
    value,
    placeholder,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, e.target.value),
    className: textarea ? 'textarea' : 'input',
  }
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {textarea ? <textarea {...common} /> : <input {...common} type={type} />}
    </div>
  )
}

export default function Kelola({
  authed,
  und,
  payment,
  banner,
}: {
  authed: boolean
  und: UndProps | null
  payment: PayProps | null
  banner: string | null
}) {
  const router = useRouter()
  const [form, setForm] = useState<EditForm>(() => ({
    groomName: und?.groomName ?? '',
    brideName: und?.brideName ?? '',
    groomParents: und?.groomParents ?? '',
    brideParents: und?.brideParents ?? '',
    akadDate: und?.akadDate ?? '',
    akadTime: und?.akadTime ?? '',
    akadLocation: und?.akadLocation ?? '',
    akadAddress: und?.akadAddress ?? '',
    resepsiDate: und?.resepsiDate ?? '',
    resepsiTime: und?.resepsiTime ?? '',
    resepsiLocation: und?.resepsiLocation ?? '',
    resepsiAddress: und?.resepsiAddress ?? '',
    story: und?.story ?? '',
    quote: und?.quote ?? '',
    guestName: und?.guestName ?? '',
    email: und?.email ?? '',
  }))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [formError, setFormError] = useState('')
  const [copied, setCopied] = useState(false)
  const [theme, setTheme] = useState<string>(und?.theme ?? 'gardenia')
  const [colorId, setColorId] = useState<string>(und?.colorId ?? 'emerald')
  const [themeBusy, setThemeBusy] = useState(false)
  const [cover, setCover] = useState(und?.coverPhoto ?? '')
  const [gallery, setGallery] = useState<string[]>(und?.gallery ?? [])
  const [music, setMusic] = useState<MusicSelection | null>(
    und?.musicUrl ? { url: und.musicUrl, title: und.musicTitle } : null,
  )
  const [mediaStatus, setMediaStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [tokenInput, setTokenInput] = useState('')
  const [tokenError, setTokenError] = useState('')
  const urlRef = useRef<HTMLInputElement>(null)

  if (!authed || !und) {
    const submitToken = async () => {
      setTokenError('')
      const raw = tokenInput.trim()
      const token = raw.includes('token=') ? (raw.match(/token=([a-f0-9-]+)/i)?.[1] ?? raw) : raw
      if (token.length < 8) {
        setTokenError('Link atau token yang dimasukkan tidak lengkap.')
        return
      }
      const res = await fetch('/api/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) {
        setTokenError('Token tidak ditemukan. Periksa kembali link kelolamu.')
        return
      }
      router.reload()
    }

    return (
      <Layout title="Halaman kelola — Sanding">
        <div className="min-h-screen bg-[var(--ivory)]">
          <Nav />
          <main className="mx-auto max-w-md px-5 py-16 sm:px-8">
            <div className="sig-frame p-8">
              <p className="eyebrow">Halaman kelola</p>
              <h1 className="font-display mt-3 text-2xl tracking-tight">
                Masukkan link kelola
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
                Tempel link kelola yang kamu terima saat membuat undangan.
              </p>
              <div className="mt-5 space-y-4">
                <input
                  className={`input ${tokenError ? 'input-error' : ''}`}
                  value={tokenInput}
                  onChange={(e) => setTokenInput(e.target.value)}
                  placeholder="tempel link atau token di sini"
                />
                {tokenError && <p className="err-msg">{tokenError}</p>}
                <button onClick={submitToken} className="btn btn-primary btn-md w-full">
                  Buka halaman kelola
                </button>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    )
  }

  const isPremium = und.package === 'premium'
  const pending = payment && payment.status === 'PENDING'
  const inviteUrl =
    typeof window !== 'undefined' ? window.location.origin + '/u/' + und.slug : `/u/${und.slug}`
  const expiry = und.expiresAt ? new Date(und.expiresAt as string) : null

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl)
    } catch {
      urlRef.current?.select()
      document.execCommand('copy')
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const setField = (name: keyof EditForm, value: string) =>
    setForm((f) => ({ ...f, [name]: value }))

  const save = async () => {
    setFormError('')
    setSaved(false)
    const parsed = coreSchema.safeParse(form)
    if (!parsed.success) {
      setFormError('Ada kolom yang belum lengkap atau tidak valid. Periksa kembali ya.')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(`/api/undangan/${und.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        setFormError('Gagal menyimpan — coba lagi sebentar.')
        return
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const saveMedia = async (patch: Record<string, unknown>) => {
    setMediaStatus('saving')
    try {
      const res = await fetch(`/api/undangan/${und.id}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch),
      })
      setMediaStatus(res.ok ? 'saved' : 'error')
    } catch {
      setMediaStatus('error')
    }
    setTimeout(() => {
      setMediaStatus((s) => (s === 'saved' || s === 'error' ? 'idle' : s))
    }, 2400)
  }

  const onCover = (v: string) => {
    setCover(v)
    saveMedia({ coverPhoto: v })
  }
  const onGallery = (v: string[]) => {
    setGallery(v)
    saveMedia({ gallery: v })
  }
  const onMusic = (v: MusicSelection | null) => {
    setMusic(v)
    saveMedia({ musicUrl: v?.url ?? '', musicTitle: v?.title ?? '' })
  }

  const pickTheme = async (t: string, color?: string) => {
    const themeDef = THEMES.find((x) => x.id === t)!
    if (!isPremium && t !== 'gardenia') {
      router.push(`/bayar?id=${und.id}&theme=${t}`)
      return
    }
    setThemeBusy(true)
    try {
      const res = await fetch(`/api/undangan/${und.id}/theme`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: t, colorId: color }),
      })
      if (res.ok) {
        setTheme(t)
        setColorId(color ?? themeDef.variants[0].id)
      }
    } finally {
      setThemeBusy(false)
    }
  }

  const dateID = (iso: string) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <Layout title={`Kelola undangan — ${und.groomName} & ${und.brideName}`}>
      <div className="min-h-screen bg-[var(--ivory)]">
        <Nav />
        <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Halaman kelola</p>
              <h1 className="font-display mt-2 text-3xl tracking-tight">
                {und.groomName} & {und.brideName}
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {isPremium ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#fffdf7]">
                  <CheckCircle2 className="size-3.5" aria-hidden /> Premium
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--paper)] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Gratis
                </span>
              )}
              {pending && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--gold-soft)] bg-[#faf3e3] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                  <AlertCircle className="size-3.5" aria-hidden /> Menunggu pembayaran
                </span>
              )}
            </div>
          </div>

          {banner === 'created' && (
            <div className="mt-6 rounded-xl border border-[var(--gold-soft)] bg-[#faf3e3] px-5 py-4 text-sm">
              <p className="font-semibold text-[var(--ink)]">Undanganmu sudah jadi! 🎉</p>
              <p className="mt-1 text-[var(--muted)]">Salin link di bawah dan bagikan ke tamu.</p>
            </div>
          )}
          {banner === 'paid' && (
            <div className="mt-6 rounded-xl border border-[var(--gold-soft)] bg-[#faf3e3] px-5 py-4 text-sm">
              <p className="font-semibold text-[var(--ink)]">Pembayaran berhasil — Premium aktif!</p>
              <p className="mt-1 text-[var(--muted)]">
                Semua tema & warna terbuka dan undanganmu tidak akan kadaluarsa.
              </p>
            </div>
          )}
          {banner === 'failed' && (
            <div className="mt-6 rounded-xl border border-[#b3405c] bg-[#fdf0f3] px-5 py-4 text-sm">
              <p className="font-semibold text-[#a63a52]">Pembayaran belum selesai</p>
              <p className="mt-1 text-[var(--muted)]">Tenang, kamu bisa mencoba lagi kapan saja.</p>
            </div>
          )}
          {banner === 'theme' && (
            <div className="mt-6 rounded-xl border border-[var(--gold-soft)] bg-[#faf3e3] px-5 py-4 text-sm">
              Tema berhasil diganti — buka undanganmu untuk melihat hasilnya.
            </div>
          )}

          {/* Bagikan */}
          <section className="mt-10">
            <h2 className="font-display text-xl">Bagikan undangan</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Link ini bisa dikirim ke tamu lewat WhatsApp, Instagram, atau media apa pun.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                ref={urlRef}
                readOnly
                value={inviteUrl}
                className="input flex-1"
                onFocus={(e) => e.target.select()}
              />
              <div className="flex gap-3">
                <button onClick={copy} className="btn btn-primary btn-md flex-1 sm:flex-none">
                  {copied ? (
                    <>
                      <Check className="size-4" aria-hidden /> Tersalin
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" aria-hidden /> Salin link
                    </>
                  )}
                </button>
                <Link
                  href={`/u/${und.slug}`}
                  target="_blank"
                  className="btn btn-outline btn-md flex-1 sm:flex-none"
                >
                  <ExternalLink className="size-4" aria-hidden />
                  <span className="sm:hidden">Buka</span>
                  <span className="hidden sm:inline">Buka undangan</span>
                </Link>
              </div>
            </div>
            <p className="mt-3 text-xs text-[var(--muted)]">
              {isPremium
                ? 'Premium aktif selamanya — link tidak akan kadaluarsa.'
                : expiry
                  ? `Undangan gratis aktif sampai ${dateID(expiry.toISOString())}. Upgrade agar tidak kadaluarsa.`
                  : ''}
            </p>
          </section>

          {/* Keanggotaan */}
          <section className="mt-12">
            <h2 className="font-display text-xl">Keanggotaan</h2>
            <div className="sig-frame mt-4 p-6">
              {isPremium ? (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Premium aktif</p>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      Terima kasih sudah mendukung! Undanganmu berlaku selamanya.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--gold)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-[#fffdf7]">
                    <CheckCircle2 className="size-3.5" aria-hidden /> Aktif
                  </span>
                </div>
              ) : pending ? (
                <div>
                  <p className="font-semibold">Menunggu pembayaran</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Invoice Premium {formatIDR(Number(payment?.amount ?? PREMIUM_PRICE))} sedang
                    menunggu pembayaran. Setelah lunas, Premium aktif otomatis.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link href={`/bayar?id=${und.id}`} className="btn btn-gold btn-sm">
                      Buka halaman pembayaran
                    </Link>
                    {typeof payment?.invoiceUrl === 'string' && (
                      <a
                        href={payment.invoiceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-outline btn-sm"
                      >
                        Buka invoice Xendit
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">Upgrade ke Premium</p>
                    <p className="mt-1 max-w-md text-sm text-[var(--muted)]">
                      Semua tema & warna, aktif selamanya, ganti tema kapan saja —{' '}
                      {formatIDR(PREMIUM_PRICE)} sekali bayar.
                    </p>
                  </div>
                  <Link href={`/bayar?id=${und.id}`} className="btn btn-gold btn-sm">
                    Upgrade sekarang
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Tema */}
          <section className="mt-12">
            <h2 className="font-display text-xl">Tema</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {isPremium
                ? 'Semua tema & warna terbuka — klik untuk mengganti, hasilnya langsung tampil.'
                : 'Tema Gardenia gratis. Tema lain terbuka setelah upgrade Premium.'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {THEMES.map((t) => {
                const locked = !isPremium && t.premium
                const active = theme === t.id
                return (
                  <div key={t.id} className="group text-left">
                    <button
                      onClick={() => pickTheme(t.id)}
                      disabled={themeBusy}
                      className="w-full disabled:opacity-60"
                    >
                      <ThemePreview
                        theme={t.id}
                        colorId={active ? colorId : t.variants[0].id}
                        className={`${active ? 'ring-2 ring-[var(--gold)] ring-offset-2 ring-offset-[var(--ivory)]' : 'opacity-90 group-hover:opacity-100'}`}
                      />
                    </button>
                    <div className="mt-2.5 flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{t.name}</p>
                      {locked && (
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[var(--ink)]/80 text-white">
                          <Lock className="size-3" aria-hidden />
                        </span>
                      )}
                    </div>
                    {/* Pilihan warna tema ini */}
                    <div className="mt-2 flex gap-1.5">
                      {t.variants.map((v) => {
                        const colorActive = active && colorId === v.id
                        return (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => pickTheme(t.id, v.id)}
                            disabled={themeBusy}
                            title={v.name}
                            aria-label={`${t.name} — warna ${v.name}`}
                            className={`size-4 rounded-full border transition-transform hover:scale-110 disabled:opacity-60 ${colorActive ? 'ring-2 ring-[var(--gold)] ring-offset-1 ring-offset-[var(--ivory)]' : ''}`}
                            style={{ background: v.swatch[1], borderColor: v.swatch[2] }}
                          />
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Foto & Musik */}
          <section className="mt-12">
            <h2 className="font-display text-xl">Foto & Musik</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Perubahan tersimpan otomatis dan langsung tampil di undangan.
            </p>
            <div className="sig-frame mt-4 space-y-6 p-7">
              <PhotoPicker
                label="Foto sampul"
                hint="Tampil di halaman pertama undangan dengan efek parallax halus."
                value={cover}
                onChange={onCover}
                presets={COVER_PRESETS}
              />
              <GalleryPicker
                label="Galeri momen"
                values={gallery}
                onChange={onGallery}
                presets={GALLERY_PRESETS}
              />
              <MusicPicker label="Musik latar" value={music} onChange={onMusic} />
              <p className="flex items-center gap-2 text-xs text-[var(--muted)]">
                {mediaStatus === 'saving' && (
                  <>
                    <Loader2 className="size-3.5 animate-spin" aria-hidden /> Menyimpan…
                  </>
                )}
                {mediaStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="size-3.5 text-[var(--gold)]" aria-hidden /> Tersimpan
                  </>
                )}
                {mediaStatus === 'error' && 'Gagal menyimpan — coba lagi.'}
                {mediaStatus === 'idle' && 'Semua perubahan tersimpan otomatis.'}
              </p>
            </div>
          </section>

          {/* Data */}
          <section className="mt-12">
            <h2 className="font-display text-xl">Data undangan</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Perubahan langsung tampil di undangan — link tidak berubah.
            </p>
            <div className="sig-frame mt-4 p-7">
              {formError && (
                <div className="mb-5 rounded-xl border border-[#b3405c] bg-[#fdf0f3] px-4 py-3 text-sm text-[#a63a52]">
                  {formError}
                </div>
              )}
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Nama mempelai pria" name="groomName" value={form.groomName} onChange={setField} />
                <Field label="Nama mempelai wanita" name="brideName" value={form.brideName} onChange={setField} />
                <Field label="Orang tua pria" name="groomParents" value={form.groomParents} onChange={setField} />
                <Field label="Orang tua wanita" name="brideParents" value={form.brideParents} onChange={setField} />
                <Field label="Tanggal akad" name="akadDate" type="date" value={form.akadDate} onChange={setField} />
                <Field label="Jam akad" name="akadTime" type="time" value={form.akadTime} onChange={setField} />
                <Field label="Tempat akad" name="akadLocation" value={form.akadLocation} onChange={setField} />
                <Field label="Alamat akad" name="akadAddress" value={form.akadAddress} onChange={setField} />
                <Field label="Tanggal resepsi" name="resepsiDate" type="date" value={form.resepsiDate} onChange={setField} />
                <Field label="Jam resepsi" name="resepsiTime" type="time" value={form.resepsiTime} onChange={setField} />
                <Field label="Tempat resepsi" name="resepsiLocation" value={form.resepsiLocation} onChange={setField} />
                <Field label="Alamat resepsi" name="resepsiAddress" value={form.resepsiAddress} onChange={setField} />
                <div className="sm:col-span-2">
                  <Field label="Cerita singkat" name="story" value={form.story} onChange={setField} textarea />
                </div>
                <div className="sm:col-span-2">
                  <Field label="Kutipan atau doa" name="quote" value={form.quote} onChange={setField} />
                </div>
                <Field label="Sapaan tamu" name="guestName" value={form.guestName} onChange={setField} />
                <Field label="Email" name="email" type="email" value={form.email} onChange={setField} />
              </div>
              <div className="mt-6 flex items-center gap-4">
                <button onClick={save} disabled={saving} className="btn btn-primary btn-md">
                  {saving ? 'Menyimpan…' : 'Simpan perubahan'}
                </button>
                {saved && (
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--gold)]">
                    <CheckCircle2 className="size-4" aria-hidden /> Tersimpan
                  </span>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </Layout>
  )
}
