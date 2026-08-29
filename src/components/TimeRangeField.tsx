// Input jam mulai + jam selesai (opsional "sampai acara selesai"), disimpan
// sebagai satu string di kolom yang sudah ada (akadTime/resepsiTime):
//  - "09:00"            -> jam tunggal (kompatibel dengan data lama)
//  - "09:00-11:00"      -> rentang jam
//  - "09:00-selesai"    -> sampai acara selesai

export function TimeRangeField({
  label,
  value,
  onChange,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}) {
  const [start, end] = value.split('-')
  const untilDone = end === 'selesai'
  const hasEnd = !!end && !untilDone

  const build = (s: string, e?: string) => {
    if (!s) return ''
    if (!e) return s
    return `${s}-${e}`
  }

  const setStart = (v: string) => onChange(build(v, end))
  const setEnd = (v: string) => onChange(build(start, v))
  const toggleUntilDone = (checked: boolean) => onChange(build(start, checked ? 'selesai' : ''))

  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="time"
          className={`input ${error ? 'input-error' : ''}`}
          value={start || ''}
          onChange={(ev) => setStart(ev.target.value)}
        />
        {!untilDone && (
          <>
            <span className="shrink-0 text-sm text-[var(--muted)]">–</span>
            <input
              type="time"
              className="input"
              value={hasEnd ? end : ''}
              onChange={(ev) => setEnd(ev.target.value)}
            />
          </>
        )}
      </div>
      <label className="mt-2 flex items-center gap-2 text-xs text-[var(--muted)]">
        <input
          type="checkbox"
          checked={untilDone}
          onChange={(ev) => toggleUntilDone(ev.target.checked)}
        />
        Sampai acara selesai
      </label>
      {error && <p className="err-msg">{error}</p>}
    </div>
  )
}
