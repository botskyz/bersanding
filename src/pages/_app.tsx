import type { AppProps } from 'next/app'
import {
  Bricolage_Grotesque,
  Fraunces,
  Great_Vibes,
  Playfair_Display,
  Cormorant_Garamond,
  DM_Serif_Display,
} from 'next/font/google'
import '@/styles/global.css'
import { PlaygroundBridge } from '@/components/PlaygroundBridge'
 
// Self-hosted di build-time oleh next/font. Bricolage Grotesque = identitas sharehalo
// (body + display). Fraunces tetap dimuat karena dipakai tema undangan Orchid.
// Playfair/Cormorant/DM Serif + Great Vibes dipakai per tema undangan.
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage' })
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces' })
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'], variable: '--font-great-vibes' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})
const dmSerif = DM_Serif_Display({ weight: '400', subsets: ['latin'], variable: '--font-dm-serif' })
 
const isPlayground = process.env.NEXT_PUBLIC_IS_PLAYGROUND === 'true'
 
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div
      className={`${bricolage.variable} ${fraunces.variable} ${greatVibes.variable} ${playfair.variable} ${cormorant.variable} ${dmSerif.variable} font-sans antialiased`}
    >
      <Component {...pageProps} />
      {isPlayground && <PlaygroundBridge />}
    </div>
  )
}
