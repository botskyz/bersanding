import { useEffect, useRef, useState } from 'react'
import { Check, Headphones, Loader2, Music as MusicIcon, Pause, Play, Trash2, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MUSIC_PRESETS } from '@/lib/photos'
import { audioToDataUrl } from '@/lib/upload'

export interface MusicSelection {
  url: string
  title: string
}

export function MusicPicker({
  label,
  value,
  onChange,
}: {
  label: string
  value: MusicSelection | null
  onChange: (v: MusicSelection | null) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [urlInput, setUrlInput] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => () => audioRef.current?.pause(), [])

  const stopPreview = () => {
    audioRef.current?.pause()
    audioRef.current = null
    setPreview(null)
  }

  const togglePreview = (url: string) => {
    if (preview === url) {
      stopPreview()
      return
    }
    stopPreview()
    const a = new Audio(url)
    a.volume = 0.5
    a.onended = () => setPreview(null)
    a.play().catch(() => setError('Musik tidak bisa diputar — periksa tautannya.'))
    audioRef.current = a
    setPreview(url)
  }

  const select = (url: string, title: string) => {
    stopPreview()
    onChange({ url, title })
    setUrlInput('')
  }

  const pick = async (f: File | undefined) => {
    if (!f) return
    setBusy(true)
    setError('')
    try {
      select(await audioToDataUrl(f), f.name.replace(/\.[^.]+$/, ''))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat musik')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="label">{label}</p>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
        {value ? (
          <div className="mb-3 flex items-center gap-3 rounded-xl border border-[var(--gold-soft)] bg-[#faf6ea] px-3.5 py-2.5">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[var(--gold)]/15 text-[var(--gold)]">
              <Headphones className="size-4" aria-hidden />
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">{value.title}</span>
            <button
              type="button"
              onClick={() => togglePreview(value.url)}
              className="btn btn-ghost btn-sm"
              aria-label={preview === value.url ? 'Hentikan pratinjau' : 'Putar pratinjau'}
            >
              {preview === value.url ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
            </button>
            <button
              type="button"
              onClick={() => {
                stopPreview()
                onChange(null)
              }}
              className="btn btn-ghost btn-sm text-[var(--muted)] hover:text-[#a63a52]"
              aria-label="Hapus musik"
            >
              <Trash2 className="size-3.5" aria-hidden />
            </button>
          </div>
        ) : (
          <div className="mb-3 flex items-center gap-2 rounded-xl border border-dashed border-[var(--line)] px-3.5 py-2.5 text-xs text-[var(--muted)]">
            <MusicIcon className="size-4 shrink-0" aria-hidden />
            Belum ada musik — pilih lagu di bawah atau unggah file sendiri.
          </div>
        )}

        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">Pilihan musik</p>
        <div className="space-y-1.5">
          {MUSIC_PRESETS.map((m, i) => {
            const chosen = value?.url === m.url
            return (
              <div
                key={m.url}
                className={cn(
                  'flex items-center gap-3 rounded-xl border px-3 py-2',
                  chosen ? 'border-[var(--gold)] bg-[#faf6ea]' : 'border-[var(--line)]',
                )}
              >
                <span className="font-display w-5 text-center text-sm text-[var(--gold)]">0{i + 1}</span>
                <span className="min-w-0 flex-1 truncate text-sm">{m.title}</span>
                <button
                  type="button"
                  onClick={() => togglePreview(m.url)}
                  className="btn btn-ghost btn-sm"
                  aria-label={preview === m.url ? `Hentikan ${m.title}` : `Dengarkan ${m.title}`}
                >
                  {preview === m.url ? <Pause className="size-3.5" aria-hidden /> : <Play className="size-3.5" aria-hidden />}
                </button>
                <button type="button" onClick={() => select(m.url, m.title)} className="btn btn-outline btn-sm">
                  {chosen ? (
                    <>
                      <Check className="size-3.5" aria-hidden /> Dipakai
                    </>
                  ) : (
                    'Pakai'
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="input flex-1"
            placeholder="atau tempel tautan musik (MP3)…"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="button" onClick={() => urlInput.trim() && select(urlInput.trim(), 'Musik dari tautan')} className="btn btn-ghost btn-md">
            Pakai tautan
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="btn btn-outline btn-sm mt-2 w-full"
        >
          {busy ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <Upload className="size-3.5" aria-hidden />}
          {busy ? 'Memuat…' : 'Unggah file musik (maksimal 6 MB)'}
        </button>
        <input ref={fileRef} type="file" accept="audio/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        {error && <p className="err-msg mt-2">{error}</p>}
      </div>
    </div>
  )
}
