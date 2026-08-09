import { useRef, useState } from 'react'
import { Check, ImagePlus, Loader2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fileToImageDataUrl } from '@/lib/upload'

export function GalleryPicker({
  label,
  values,
  onChange,
  presets,
  max = 6,
}: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  presets: { url: string; alt: string }[]
  max?: number
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const add = (url: string) => {
    if (values.length >= max || values.includes(url)) return
    onChange([...values, url])
  }
  const remove = (url: string) => onChange(values.filter((v) => v !== url))

  const pick = async (f: File | undefined) => {
    if (!f) return
    setBusy(true)
    setError('')
    try {
      add(await fileToImageDataUrl(f))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat foto')
    } finally {
      setBusy(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div>
      <p className="label">{label}</p>
      <div className="rounded-2xl border border-[var(--line)] bg-[var(--paper)] p-4">
        <div className="grid grid-cols-3 gap-2.5">
          {values.map((v) => (
            <div key={v} className="group relative overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v} alt="Foto galeri" className="aspect-[4/5] w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(v)}
                aria-label="Hapus foto"
                className="absolute right-1.5 top-1.5 grid size-6 place-items-center rounded-full bg-black/55 text-white transition-opacity group-hover:opacity-100 max-sm:opacity-100"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          ))}
          {values.length < max && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex aspect-[4/5] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
            >
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <ImagePlus className="size-4" aria-hidden />}
              <span className="text-[10px] font-semibold">Tambah</span>
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Pilih dari galeri preset
          </p>
          <span className="text-[11px] tabular-nums text-[var(--muted)]">
            {values.length}/{max}
          </span>
        </div>
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {presets.map((p) => {
            const chosen = values.includes(p.url)
            return (
              <button
                key={p.url}
                type="button"
                onClick={() => (chosen ? remove(p.url) : add(p.url))}
                disabled={!chosen && values.length >= max}
                aria-label={chosen ? `Hapus ${p.alt} dari galeri` : `Tambah ${p.alt} ke galeri`}
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-lg border-2 transition-all disabled:opacity-40',
                  chosen ? 'border-[var(--gold)]' : 'border-transparent opacity-80 hover:opacity-100',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt} loading="lazy" className="h-14 w-20 object-cover" />
                {chosen && (
                  <span className="absolute inset-0 grid place-items-center bg-black/35">
                    <Check className="size-4 text-white" aria-hidden />
                  </span>
                )}
              </button>
            )
          })}
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        {error && <p className="err-msg mt-2">{error}</p>}
      </div>
    </div>
  )
}
