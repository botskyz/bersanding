// Sulur bunga — signature visual undangan. Diwarnai via currentColor.
// Props tambahan (mis. data-depth untuk parallax) diteruskan ke elemen svg.
export function Ornament({
  className,
  ...rest
}: React.ComponentPropsWithoutRef<'svg'> & { className?: string }) {
  return (
    <svg viewBox="0 0 260 44" fill="none" aria-hidden="true" className={className} {...rest}>
      {/* batang utama */}
      <path d="M10 22h240" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
      {/* sulur ujung */}
      <path d="M10 22c-7-2-13-7-16-13M10 22c-8 1-14 4-18 8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      <path d="M250 22c7-2 13-7 16-13M250 22c8 1 14 4 18 8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
      {/* daun */}
      <path d="M46 22c3-8 12-13 21-12-1 8-9 13-21 12Z" fill="currentColor" opacity="0.8" />
      <path d="M46 22c3 8 12 13 21 12-1-8-9-13-21-12Z" fill="currentColor" opacity="0.8" />
      <path d="M92 22c3-8 12-13 21-12-1 8-9 13-21 12Z" fill="currentColor" opacity="0.8" />
      <path d="M92 22c3 8 12 13 21 12-1-8-9-13-21-12Z" fill="currentColor" opacity="0.8" />
      <path d="M164 22c3-8 12-13 21-12-1 8-9 13-21 12Z" fill="currentColor" opacity="0.8" />
      <path d="M164 22c3 8 12 13 21 12-1-8-9-13-21-12Z" fill="currentColor" opacity="0.8" />
      {/* daun kecil mengapit bunga */}
      <path d="M124 22c2-5 7-8 12-7-1 5-6 8-12 7Z" fill="currentColor" opacity="0.65" />
      <path d="M136 22c-2-5-7-8-12-7 1 5 6 8 12 7Z" fill="currentColor" opacity="0.65" />
      {/* bunga pusat — 5 kelopak */}
      <g stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        <ellipse cx="130" cy="13.5" rx="3.4" ry="6" />
        <ellipse cx="130" cy="13.5" rx="3.4" ry="6" transform="rotate(72 130 22)" />
        <ellipse cx="130" cy="13.5" rx="3.4" ry="6" transform="rotate(144 130 22)" />
        <ellipse cx="130" cy="13.5" rx="3.4" ry="6" transform="rotate(216 130 22)" />
        <ellipse cx="130" cy="13.5" rx="3.4" ry="6" transform="rotate(288 130 22)" />
      </g>
      <circle cx="130" cy="22" r="2" fill="currentColor" />
    </svg>
  )
}
