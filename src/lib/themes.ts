export interface ThemeColors {
  bg: string
  surface: string
  ink: string
  muted: string
  accent: string
  gold: string
  line: string
  glow: string
}

export interface ColorVariant {
  id: string
  name: string
  /** [latar, aksen, emas] — dipakai untuk swatch di UI */
  swatch: [string, string, string]
  colors: ThemeColors
}

export interface ThemeDef {
  id: string
  name: string
  tagline: string
  premium: boolean
  display: 'cormorant' | 'playfair' | 'fraunces' | 'dm-serif'
  variants: ColorVariant[]
}

export const THEMES: ThemeDef[] = [
  {
    id: 'gardenia',
    name: 'Gardenia',
    tagline: 'Taman megah yang tenang',
    premium: false,
    display: 'cormorant',
    variants: [
      {
        id: 'emerald',
        name: 'Emerald Garden',
        swatch: ['#F3F0E4', '#2E5A41', '#AE8A3B'],
        colors: {
          bg: '#F3F0E4',
          surface: '#FCFBF3',
          ink: '#22382C',
          muted: '#68725F',
          accent: '#2E5A41',
          gold: '#AE8A3B',
          line: '#D9DBC1',
          glow: 'rgba(46, 90, 65, 0.1)',
        },
      },
      {
        id: 'rosewood',
        name: 'Rosewood',
        swatch: ['#F7EFE9', '#8A4A3C', '#B98A5E'],
        colors: {
          bg: '#F7EFE9',
          surface: '#FDF9F5',
          ink: '#452925',
          muted: '#7E6A60',
          accent: '#8A4A3C',
          gold: '#B98A5E',
          line: '#E8D5C8',
          glow: 'rgba(138, 74, 60, 0.1)',
        },
      },
      {
        id: 'midnight',
        name: 'Midnight Garden',
        swatch: ['#0E1C15', '#7FA98A', '#C6A55C'],
        colors: {
          bg: '#0E1C15',
          surface: 'rgba(255, 255, 255, 0.045)',
          ink: '#EFE8D6',
          muted: '#96A291',
          accent: '#7FA98A',
          gold: '#C6A55C',
          line: 'rgba(239, 232, 214, 0.2)',
          glow: 'rgba(127, 169, 138, 0.12)',
        },
      },
    ],
  },
  {
    id: 'bouquet',
    name: 'Buket',
    tagline: 'Botanis modern yang lembut',
    premium: true,
    display: 'playfair',
    variants: [
      {
        id: 'blush',
        name: 'Rose Blush',
        swatch: ['#FAF2F0', '#AD6265', '#C2916A'],
        colors: {
          bg: '#FAF2F0',
          surface: '#FEFAF8',
          ink: '#46303A',
          muted: '#836E72',
          accent: '#AD6265',
          gold: '#C2916A',
          line: '#EBDAD7',
          glow: 'rgba(173, 98, 101, 0.09)',
        },
      },
      {
        id: 'lilac',
        name: 'Lilac Mist',
        swatch: ['#F4F1F9', '#8A77AE', '#B79B7A'],
        colors: {
          bg: '#F4F1F9',
          surface: '#FCFBFE',
          ink: '#393050',
          muted: '#7C718E',
          accent: '#8A77AE',
          gold: '#B79B7A',
          line: '#E4DDF0',
          glow: 'rgba(138, 119, 174, 0.1)',
        },
      },
      {
        id: 'terracotta',
        name: 'Terracotta',
        swatch: ['#F8EFE5', '#B4643C', '#C29A55'],
        colors: {
          bg: '#F8EFE5',
          surface: '#FDFAF4',
          ink: '#433024',
          muted: '#8A7664',
          accent: '#B4643C',
          gold: '#C29A55',
          line: '#EBDCC7',
          glow: 'rgba(180, 100, 60, 0.09)',
        },
      },
    ],
  },
  {
    id: 'orchid',
    name: 'Anggrek',
    tagline: 'Keanggunan malam',
    premium: true,
    display: 'fraunces',
    variants: [
      {
        id: 'plum',
        name: 'Orchid Plum',
        swatch: ['#231426', '#C27A9C', '#D9A74F'],
        colors: {
          bg: '#231426',
          surface: 'rgba(255, 255, 255, 0.05)',
          ink: '#F4E9ED',
          muted: '#C3AAB6',
          accent: '#C27A9C',
          gold: '#D9A74F',
          line: 'rgba(244, 233, 237, 0.2)',
          glow: 'rgba(194, 122, 156, 0.14)',
        },
      },
      {
        id: 'champagne',
        name: 'Champagne',
        swatch: ['#F7F1E4', '#97744E', '#C2A15E'],
        colors: {
          bg: '#F7F1E4',
          surface: '#FDFBF4',
          ink: '#3A2E23',
          muted: '#877868',
          accent: '#97744E',
          gold: '#C2A15E',
          line: '#E7DCC4',
          glow: 'rgba(151, 116, 78, 0.1)',
        },
      },
      {
        id: 'forest',
        name: 'Forest Night',
        swatch: ['#131F19', '#6D9B7E', '#C1A45E'],
        colors: {
          bg: '#131F19',
          surface: 'rgba(255, 255, 255, 0.045)',
          ink: '#EBF0E9',
          muted: '#97A498',
          accent: '#6D9B7E',
          gold: '#C1A45E',
          line: 'rgba(235, 240, 233, 0.18)',
          glow: 'rgba(109, 155, 126, 0.12)',
        },
      },
    ],
  },
  {
    id: 'sakura',
    name: 'Sakura',
    tagline: 'Minimalis yang ringan',
    premium: true,
    display: 'cormorant',
    variants: [
      {
        id: 'peach',
        name: 'Sakura Peach',
        swatch: ['#FBF3EE', '#D48677', '#C39A63'],
        colors: {
          bg: '#FBF3EE',
          surface: '#FEFBF7',
          ink: '#463531',
          muted: '#8A746C',
          accent: '#D48677',
          gold: '#C39A63',
          line: '#F0DFD4',
          glow: 'rgba(212, 134, 119, 0.1)',
        },
      },
      {
        id: 'sky',
        name: 'Morning Sky',
        swatch: ['#F0F6F8', '#7DA3B8', '#BC9A5C'],
        colors: {
          bg: '#F0F6F8',
          surface: '#FBFDFD',
          ink: '#2F414B',
          muted: '#73858D',
          accent: '#7DA3B8',
          gold: '#BC9A5C',
          line: '#DBE7EB',
          glow: 'rgba(125, 163, 184, 0.1)',
        },
      },
      {
        id: 'mint',
        name: 'Mint Leaf',
        swatch: ['#EFF5EF', '#7DA98D', '#BC9A5C'],
        colors: {
          bg: '#EFF5EF',
          surface: '#FBFDFA',
          ink: '#314238',
          muted: '#74857A',
          accent: '#7DA98D',
          gold: '#BC9A5C',
          line: '#DCE8DD',
          glow: 'rgba(125, 169, 141, 0.1)',
        },
      },
    ],
  },
  {
    id: 'botanical',
    name: 'Botanical Garden',
    tagline: 'Ilustrasi taman klasik yang mewah',
    premium: false,
    display: 'cormorant',
    variants: [
      {
        id: 'botanical-classic',
        name: 'Botanical Classic',
        swatch: ['#ECE1CD', '#2E5A41', '#AE8A3B'],
        colors: {
          bg: '#ECE1CD',
          surface: '#FBF8F0',
          ink: '#2E5A41',
          muted: '#5C5245',
          accent: '#2E5A41',
          gold: '#AE8A3B',
          line: '#D9DBC1',
          glow: 'rgba(46, 90, 65, 0.1)',
        },
      },
    ],
  },
]

export const FREE_THEME = 'gardenia'
export const PREMIUM_PRICE = 99000

export function themeById(id: string): ThemeDef {
  return THEMES.find((t) => t.id === id) ?? THEMES[0]
}

export function variantById(themeId: string, colorId: string | null | undefined): ColorVariant {
  const t = themeById(themeId)
  return t.variants.find((v) => v.id === colorId) ?? t.variants[0]
}

export function formatIDR(n: number): string {
  return 'Rp ' + n.toLocaleString('id-ID')
}
