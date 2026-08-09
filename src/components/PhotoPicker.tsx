import { useRef, useState } from 'react'
import { ImagePlus, Loader2, RefreshCw, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { fileToImageDataUrl } from '@/lib/upload'

export function PhotoPicker({
  label,
  hint,
  value,
  onChange,
  presets,
}: {
  label: string
  hint?: string
  value: string
  onChange: (v: string) => void
  presets: { url: string; alt: string }[]
}) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const pick = async (f: File | undefined) => {
    if (!f) return
    setBusy(true)
    setError('')
    try {
      onChange(await fileToImageDataUrl(f))
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
        {value ? (
          <div className="relative overflow-hidden rounded-xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Foto terpilih" className="aspect-[16/9] w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-end gap-2 bg-gradient-to-t from-black/60 to-transparent p-2.5">
              <button type="button" onClick={() => fileRef.current?.click()} disabled={busy} className="btn-inline">
                {busy ? <Loader2 className="size-3.5 animate-spin" aria-hidden /> : <RefreshCw className="size-3.5" aria-hidden />}
                Ganti foto
              </button>
              <button
                type="button"
                onClick={() => onChange('')}
                className="btn-inline btn-inline-danger"
                aria-label="Hapus foto"
              >
                <Trash2 className="size-3.5" aria-hidden />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--line)] text-[var(--muted)] transition-colors hover:border-[var(--gold)] hover:text-[var(--gold)]"
          >
            <ImagePlus className="size-5" aria-hidden />
            <span className="text-xs font-semibold">{busy ? 'Memuat…' : 'Pilih foto'}</span>
          </button>
        )}
        {error && <p className="err-msg mt-2">{error}</p>}
        <div className="mt-3">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--muted)]">
            Pilih dari galeri preset
          </p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {presets.map((p) => (
              <button
                key={p.url}
                type="button"
                onClick={() => onChange(p.url)}
                aria-label={p.alt}
                className={cn(
                  'relative shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                  value === p.url ? 'border-[var(--gold)]' : 'border-transparent opacity-80 hover:opacity-100',
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.alt} loading="lazy" className="h-14 w-20 object-cover" />
              </button>
            ))}
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} />
        {hint && <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">{hint}</p>}
      </div>
    </div>
  )
}
