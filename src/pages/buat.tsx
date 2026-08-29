import { useState } from 'react'
import { useRouter } from 'next/router'
import { Camera, Feather, Heart, Mail, PartyPopper } from 'lucide-react'
import { Layout } from '@/components/Layout'
import { Nav } from '@/components/SiteChrome'
import { GalleryPicker } from '@/components/GalleryPicker'
import { MusicPicker } from '@/components/MusicPicker'
import { PhotoPicker } from '@/components/PhotoPicker'
import { TimeRangeField } from '@/components/TimeRangeField'
import { COVER_PRESETS, GALLERY_PRESETS } from '@/lib/photos'
import { mediaSchema, undanganSchema } from '@/lib/validation'

const STEPS = [
  { title: 'Pasangan', icon: Heart },
  { title: 'Acara', icon: PartyPopper },
  { title: 'Kisah', icon: Feather },
  { title: 'Tamu', icon: Mail },
  { title: 'Foto & Musik', icon: Camera },
]

const stepSchemas = [
  undanganSchema.pick({
    groomName: true,
    brideName: true,
    groomParents: true,
    brideParents: true,
  }),
  undanganSchema.pick({
    akadDate: true,
    akadTime: true,
    akadLocation: true,
    akadAddress: true,
    resepsiDate: true,
    resepsiTime: true,
    resepsiLocation: true,
    resepsiAddress: true,
  }),
  undanganSchema.pick({ story: true, quote: true }),
  undanganSchema.pick({ guestName: true, email: true }),
  mediaSchema,
]

interface FormState {
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
  coverPhoto: string
  gallery: string[]
  musicUrl: string
  musicTitle: string
}

const initialForm: FormState = {
  groomName: '',
  brideName: '',
  groomParents: '',
  brideParents: '',
  akadDate: '',
  akadTime: '',
  akadLocation: '',
  akadAddress: '',
  resepsiDate: '',
  resepsiTime: '',
  resepsiLocation: '',
  resepsiAddress: '',
  story: '',
  quote: '',
  guestName: 'Bapak/Ibu/Saudara/i',
  email: '',
  coverPhoto: '',
  gallery: [],
  musicUrl: '',
  musicTitle: '',
}

type Errors = Partial<Record<keyof FormState, string[]>>

function Field({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  textarea = false,
}: {
  label: string
  name: keyof FormState
  value: string
  onChange: (name: keyof FormState, value: string) => void
  error?: string
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
    className: `${textarea ? 'textarea' : 'input'} ${error ? 'input-error' : ''}`,
  }
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      {textarea ? <textarea {...common} /> : <input {...common} type={type} />}
      {error && <p className="err-msg">{error}</p>}
    </div>
  )
}

export default function Buat() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [sameAsAkad, setSameAsAkad] = useState(false)

  const setField = (name: keyof FormState, value: string) => {
    setForm((f) => ({ ...f, [name]: value }))
    setErrors((e) => {
      if (!e[name]) return e
      const next = { ...e }
      delete next[name]
      return next
    })
  }

  const copyFromAkad = (checked: boolean) => {
    setSameAsAkad(checked)
    if (checked) {
      setForm((f) => ({
        ...f,
        resepsiDate: f.akadDate,
        resepsiTime: f.akadTime,
        resepsiLocation: f.akadLocation,
        resepsiAddress: f.akadAddress,
      }))
      setErrors((e) => {
        const next = { ...e }
        delete next.resepsiDate
        delete next.resepsiTime
        delete next.resepsiLocation
        delete next.resepsiAddress
        return next
      })
    }
  }

  const validateStep = (s: number): boolean => {
    const result = stepSchemas[s].safeParse(form)
    if (result.success) {
      setErrors({})
      return true
    }
    setErrors((result.error.flatten().fieldErrors ?? {}) as Errors)
    return false
  }

  const next = () => {
    setApiError('')
    if (!validateStep(step)) return
    if (step < STEPS.length - 1) {
      setStep(step + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const back = () => {
    setApiError('')
    if (step > 0) setStep(step - 1)
  }

  const submit = async () => {
    setApiError('')
    if (!validateStep(step)) return
    const full = undanganSchema.safeParse(form)
    if (!full.success) {
      setErrors((full.error.flatten().fieldErrors ?? {}) as Errors)
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch('/api/undangan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setApiError('Terjadi kesalahan saat menyimpan. Coba lagi sebentar ya.')
        return
      }
      router.push(`/tema?id=${data.id}`)
    } catch {
      setApiError('Koneksi bermasalah — periksa internetmu dan coba lagi.')
    } finally {
      setSubmitting(false)
    }
  }

  const e = (name: keyof FormState) => errors[name]?.[0]

  return (
    <Layout title="Buat undangan — sharehalo">
      <div className="min-h-screen bg-[var(--ivory)]">
        <Nav />

        <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
          {/* Progres */}
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.title} className="flex flex-1 items-center gap-2 last:flex-none">
                <div className="flex items-center gap-2">
                  <span
                    className={`grid size-8 place-items-center rounded-full border text-xs font-semibold ${
                      i < step
                        ? 'border-[var(--berry)] bg-[var(--berry)] text-[#fdf6ee]'
                        : i === step
                          ? 'border-[var(--berry)] text-[var(--berry)]'
                          : 'border-[var(--line)] text-[var(--muted)]'
                    }`}
                  >
                    {i < step ? '✓' : i + 1}
                  </span>
                  <span
                    className={`hidden text-sm sm:block ${i === step ? 'font-semibold text-[var(--ink)]' : 'text-[var(--muted)]'}`}
                  >
                    {s.title}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`mx-2 h-px flex-1 ${i < step ? 'bg-[var(--berry)]' : 'bg-[var(--line)]'}`} />
                )}
              </div>
            ))}
          </div>

          <p className="mt-10 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--gold)]">
            Langkah {step + 1} dari {STEPS.length} — {STEPS[step].title}
          </p>
          <h1 className="font-display mt-3 text-3xl tracking-tight">
            {step === 0 && 'Siapa pasangan bahagia ini?'}
            {step === 1 && 'Kapan dan di mana acaranya?'}
            {step === 2 && 'Cerita kalian berdua'}
            {step === 3 && 'Terakhir — sapaan & email'}
            {step === 4 && 'Foto & musik untuk undangan'}
          </h1>

          {apiError && (
            <div className="mt-6 rounded-xl border border-[#b3405c] bg-[#fdf0f3] px-4 py-3 text-sm text-[#a63a52]">
              {apiError}
            </div>
          )}

          {/* Langkah 1 — Pasangan */}
          {step === 0 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="sig-frame p-7">
                <p className="font-display text-lg">Mempelai Pria</p>
                <div className="mt-5 space-y-4">
                  <Field
                    label="Nama lengkap"
                    name="groomName"
                    value={form.groomName}
                    onChange={setField}
                    error={e('groomName')}
                    placeholder="contoh: Andi Pratama"
                  />
                  <Field
                    label="Nama orang tua"
                    name="groomParents"
                    value={form.groomParents}
                    onChange={setField}
                    error={e('groomParents')}
                    placeholder="contoh: Bapak Hendra & Ibu Ratna"
                  />
                </div>
              </div>
              <div className="sig-frame p-7">
                <p className="font-display text-lg">Mempelai Wanita</p>
                <div className="mt-5 space-y-4">
                  <Field
                    label="Nama lengkap"
                    name="brideName"
                    value={form.brideName}
                    onChange={setField}
                    error={e('brideName')}
                    placeholder="contoh: Sari Dewi"
                  />
                  <Field
                    label="Nama orang tua"
                    name="brideParents"
                    value={form.brideParents}
                    onChange={setField}
                    error={e('brideParents')}
                    placeholder="contoh: Bapak Budi & Ibu Maya"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Langkah 2 — Acara */}
          {step === 1 && (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div className="sig-frame p-7">
                <p className="font-display text-lg">Akad Nikah</p>
                <div className="mt-5 space-y-4">
                  <Field label="Tanggal" name="akadDate" type="date" value={form.akadDate} onChange={setField} error={e('akadDate')} />
                  <TimeRangeField
                    label="Jam"
                    value={form.akadTime}
                    onChange={(v) => setField('akadTime', v)}
                    error={e('akadTime')}
                  />
                  <Field label="Tempat" name="akadLocation" value={form.akadLocation} onChange={setField} error={e('akadLocation')} placeholder="contoh: Masjid Agung Al-Falah" />
                  <Field label="Alamat lengkap" name="akadAddress" value={form.akadAddress} onChange={setField} error={e('akadAddress')} placeholder="contoh: Jl. Diponegoro No. 12, Bandung" />
                </div>
              </div>
              <div className="sig-frame p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display text-lg">Resepsi</p>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--muted)]">
                    <input
                      type="checkbox"
                      checked={sameAsAkad}
                      onChange={(ev) => copyFromAkad(ev.target.checked)}
                    />
                    Sama dengan Akad
                  </label>
                </div>
                <div className="mt-5 space-y-4">
                  <Field label="Tanggal" name="resepsiDate" type="date" value={form.resepsiDate} onChange={setField} error={e('resepsiDate')} />
                  <TimeRangeField
                    label="Jam"
                    value={form.resepsiTime}
                    onChange={(v) => setField('resepsiTime', v)}
                    error={e('resepsiTime')}
                  />
                  <Field label="Tempat" name="resepsiLocation" value={form.resepsiLocation} onChange={setField} error={e('resepsiLocation')} placeholder="contoh: Gedung Sangkuriang" />
                  <Field label="Alamat lengkap" name="resepsiAddress" value={form.resepsiAddress} onChange={setField} error={e('resepsiAddress')} placeholder="contoh: Jl. Asia Afrika No. 55, Bandung" />
                </div>
              </div>
            </div>
          )}

          {/* Langkah 3 — Kisah */}
          {step === 2 && (
            <div className="mt-8">
              <div className="sig-frame p-7">
                <p className="text-sm leading-relaxed text-[var(--muted)]">
                  Kedua kolom ini opsional — kalau dikosongkan, kami siapkan teks bawaan yang
                  tetap indah.
                </p>
                <div className="mt-5 space-y-5">
                  <Field
                    label="Cerita singkat kalian"
                    name="story"
                    value={form.story}
                    onChange={setField}
                    error={e('story')}
                    placeholder="contoh: Kami bertemu di sebuah acara relawan pada 2019…"
                    textarea
                  />
                  <Field
                    label="Kutipan atau doa"
                    name="quote"
                    value={form.quote}
                    onChange={setField}
                    error={e('quote')}
                    placeholder="contoh: QS. Ar-Rum ayat 21…"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Langkah 4 — Tamu */}
          {step === 3 && (
            <div className="mt-8">
              <div className="sig-frame p-7">
                <div className="space-y-5">
                  <Field
                    label="Sapaan untuk tamu"
                    name="guestName"
                    value={form.guestName}
                    onChange={setField}
                    error={e('guestName')}
                    placeholder="Bapak/Ibu/Saudara/i"
                  />
                  <Field
                    label="Email kamu"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={setField}
                    error={e('email')}
                    placeholder="nama@contoh.com"
                  />
                </div>
                <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">
                  Link kelola undangan akan tersimpan di browser ini. Simpan baik-baik — dari
                  sana kamu bisa mengubah data, foto, dan melihat status pembayaran.
                </p>
              </div>
            </div>
          )}

          {/* Langkah 5 — Foto & Musik */}
          {step === 4 && (
            <div className="mt-8 space-y-6">
              <PhotoPicker
                label="Foto sampul"
                hint="Tampil di halaman pertama undangan. Bisa dikosongkan — nanti diganti dari halaman kelola."
                value={form.coverPhoto}
                onChange={(v) => setField('coverPhoto', v)}
                presets={COVER_PRESETS}
              />
              <GalleryPicker
                label="Galeri momen"
                values={form.gallery}
                onChange={(v) => setForm((f) => ({ ...f, gallery: v }))}
                presets={GALLERY_PRESETS}
              />
              <MusicPicker
                label="Musik latar"
                value={form.musicUrl ? { url: form.musicUrl, title: form.musicTitle } : null}
                onChange={(v) => setForm((f) => ({ ...f, musicUrl: v?.url ?? '', musicTitle: v?.title ?? '' }))}
              />
              <p className="text-xs leading-relaxed text-[var(--muted)]">
                Musik akan diputar otomatis saat tamu membuka undangan (tombol musik tetap tersedia
                untuk memutar/menghentikan).
              </p>
            </div>
          )}

          {/* Navigasi */}
          <div className="mt-10 flex items-center justify-between">
            <button onClick={back} disabled={step === 0} className="btn btn-ghost btn-md">
              ← Kembali
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={next} className="btn btn-primary btn-md">
                Lanjut
                <span className="sr-only">ke langkah berikutnya</span>
              </button>
            ) : (
              <button onClick={submit} disabled={submitting} className="btn btn-primary btn-md">
                {submitting ? 'Membuat undangan…' : 'Buat undangan gratis'}
              </button>
            )}
          </div>
        </main>
      </div>
    </Layout>
  )
}
