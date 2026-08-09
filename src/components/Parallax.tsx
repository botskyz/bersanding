import { useEffect } from 'react'

// Micro-parallax halus: elemen ber-atribut [data-depth] bergeser sedikit berlawanan
// arah scroll (depth positif = lebih lambat). Satu listener + rAF untuk seluruh halaman,
// dan dinonaktifkan saat prefers-reduced-motion.
export function useParallax() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'))
    if (els.length === 0) return
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      for (const el of els) {
        const depth = Number(el.dataset.depth ?? 0)
        if (!depth) continue
        const r = el.getBoundingClientRect()
        const offset = (r.top + r.height / 2 - vh / 2) * -depth
        el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      if (raf) cancelAnimationFrame(raf)
      for (const el of els) el.style.transform = ''
    }
  }, [])
}
