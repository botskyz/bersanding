export interface PhotoPreset {
  url: string
  alt: string
}

// Foto Pexels — ukuran disesuaikan per pemakaian (sampul besar, galeri kecil).
const px = (id: number, w = 1000) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`

export const COVER_PRESETS: PhotoPreset[] = [
  { url: px(30039385, 1400), alt: 'Pasangan bahagia di taman' },
  { url: px(5039336, 1400), alt: 'Pelaminan bermekaran' },
  { url: px(17350824, 1400), alt: 'Potret pengantin elegan' },
  { url: px(16625637, 1400), alt: 'Mempelai dengan buket' },
  { url: px(4646001, 1400), alt: 'Dekorasi bunga taman' },
  { url: px(34489061, 1400), alt: 'Berpegangan tangan' },
]

export const GALLERY_PRESETS: PhotoPreset[] = [
  { url: px(36644449, 800), alt: 'Momen di taman' },
  { url: px(13891755, 800), alt: 'Pelaminan tepi laut' },
  { url: px(30159419, 800), alt: 'Buket mawar putih' },
  { url: px(1702371, 800), alt: 'Buket di atas satin' },
  { url: px(36028957, 800), alt: 'Meja bermandikan lilin' },
  { url: px(29040917, 800), alt: 'Hiasan meja resepsi' },
  { url: px(17206082, 800), alt: 'Taman resepsi' },
  { url: px(10970554, 800), alt: 'Rangkaian bunga' },
]

export const MUSIC_PRESETS: { 
  url: string; title: string }[] = [ { url: '/audio/eternal-vow.mp3', title: 'Eternal Vow' }, ]

export const DEFAULT_COVER = COVER_PRESETS[0].url
