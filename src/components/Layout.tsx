import Head from 'next/head'
import type { ReactNode } from 'react'

interface LayoutProps {
  title?: string
  description?: string
  children: ReactNode
}

export function Layout({
  title = 'Sanding — Undangan Digital Pernikahan',
  description = 'Buat undangan digital pernikahan dalam satu menit: isi data, pilih tema, bagikan link. Gratis untuk mulai.',
  children,
}: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        {description && <meta name="description" content={description} />}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#FAF6ED" />
      </Head>
      {children}
    </>
  )
}
