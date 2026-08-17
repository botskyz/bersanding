import Link from 'next/link'
import { Brand } from '@/components/Brand'

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--ivory)]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="sharehalo — beranda">
          <Brand />
        </Link>
        <nav className="flex items-center gap-3 sm:gap-5">
          <Link
            href="/u/andi-sari"
            className="hidden text-sm text-[var(--muted)] transition-colors hover:text-[var(--ink)] sm:block"
          >
            Lihat contoh
          </Link>
          <Link href="/buat" className="btn btn-primary btn-sm">
            Buat undangan
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--ivory)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-10 text-center sm:px-8">
        <Brand />
        <p className="max-w-sm text-sm leading-relaxed text-[var(--muted)]">
          Undangan digital untuk calon pengantin — isi data, pilih tema, bagikan link.
        </p>
        <div className="mt-1 flex items-center gap-5 text-sm text-[var(--muted)]">
          <Link href="/buat" className="transition-colors hover:text-[var(--ink)]">
            Buat undangan
          </Link>
          <Link href="/u/andi-sari" className="transition-colors hover:text-[var(--ink)]">
            Contoh undangan
          </Link>
        </div>
        <p className="text-xs text-[var(--muted)]/70">© 2026 sharehalo · Dibuat dengan ♥ di Indonesia</p>
      </div>
    </footer>
  )
}
