import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'

// ── postMessage protocol (version 2) ────────────────────────────────────────
// All messages: { source: 'gcode-bridge', version: 2, type: string, payload? }
//
// Outbound (app → playground parent):
//   gcode-bridge:ready            { url, title }
//   gcode-bridge:navigated        { url, title }       — on route change
//   gcode-bridge:element_hovered  { selector, tagName, rect }
//   gcode-bridge:element_selected { url, pathname, selector, tagName, id, classes, text, rect, outerHTML, styles, hasElementChildren }
//     styles: computed values for EDITABLE_STYLE_PROPS (camelCase CSS property
//     → string, colors normalized to #rrggbb) — prefills the playground's
//     visual inspector.
//     hasElementChildren: true if the element has child elements (not just
//     text) — the inspector disables text editing in that case, since
//     overwriting textContent would delete the nested markup.
//   gcode-bridge:picker_cancelled {}                   — Escape pressed
//
// Inbound (playground → app):
//   gcode-bridge:picker_enable    {}
//   gcode-bridge:picker_disable   {}
//   gcode-bridge:apply_style      { selector, styles }
//     Live-preview only: sets inline style overrides (camelCase prop → CSS
//     value, or '' to clear) on the element matching `selector`. Never
//     persisted — overwritten by the next Fast Refresh once the agent edits
//     the real source. Also used with the inspector's original snapshot to
//     revert a preview.
//   gcode-bridge:apply_text       { selector, text }
//     Live-preview only, same lifecycle as apply_style: sets `textContent` on
//     the element matching `selector`. Only meaningful for leaf elements
//     (see hasElementChildren above).
// ────────────────────────────────────────────────────────────────────────────

const VERSION = 2

const EDITABLE_STYLE_PROPS = [
  'fontSize', 'fontWeight', 'fontStyle', 'letterSpacing', 'color', 'textAlign',
  'backgroundColor', 'opacity',
  'borderWidth', 'borderStyle', 'borderColor', 'borderRadius', 'boxShadow',
  'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
  'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
  'display', 'position', 'width', 'height', 'gap', 'justifyContent', 'alignItems',
] as const

function post(type: string, payload?: unknown) {
  window.parent.postMessage({ source: 'gcode-bridge', version: VERSION, type, payload }, '*')
}

function rgbToHex(value: string): string {
  const m = value.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/)
  if (!m) return value
  const [r, g, b] = m.slice(1).map(Number)
  return '#' + [r, g, b].map(n => n.toString(16).padStart(2, '0')).join('')
}

const COLOR_PROPS = new Set(['color', 'backgroundColor', 'borderColor'])

function getEditableStyles(el: Element): Record<string, string> {
  const computed = getComputedStyle(el)
  const out: Record<string, string> = {}
  for (const prop of EDITABLE_STYLE_PROPS) {
    const value = computed[prop as keyof CSSStyleDeclaration] as string
    out[prop] = COLOR_PROPS.has(prop) ? rgbToHex(value) : value
  }
  return out
}

function getSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur.tagName !== 'BODY' && cur.tagName !== 'HTML') {
    const tag = cur.tagName.toLowerCase()
    const p: Element | null = cur.parentElement
    if (p) {
      const sib = Array.from(p.children).filter(c => c.tagName === cur!.tagName)
      parts.unshift(sib.length > 1 ? `${tag}:nth-of-type(${sib.indexOf(cur as Element) + 1})` : tag)
    } else {
      parts.unshift(tag)
    }
    cur = p
  }
  return parts.join(' > ')
}

export function PlaygroundBridge() {
  const [pickerActive, setPickerActive] = useState(false)
  const highlightRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Signal ready + listen for inbound commands
  useEffect(() => {
    post('gcode-bridge:ready', { url: window.location.href, title: document.title })

    const onMessage = (e: MessageEvent) => {
      if (e.data?.source !== 'gcode-bridge') return
      if (e.data.type === 'gcode-bridge:picker_enable') setPickerActive(true)
      if (e.data.type === 'gcode-bridge:picker_disable') setPickerActive(false)
      if (e.data.type === 'gcode-bridge:apply_style') {
        const { selector, styles } = e.data.payload ?? {}
        const el = selector ? document.querySelector(selector) : null
        if (el instanceof HTMLElement && styles) {
          const style = el.style as unknown as Record<string, string>
          for (const [prop, value] of Object.entries(styles as Record<string, string>)) {
            style[prop] = value
          }
        }
      }
      if (e.data.type === 'gcode-bridge:apply_text') {
        const { selector, text } = e.data.payload ?? {}
        const el = selector ? document.querySelector(selector) : null
        if (el instanceof HTMLElement && typeof text === 'string') {
          el.textContent = text
        }
      }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Report navigation. Next does client-side route changes (routeChangeComplete)
  // plus browser back/forward (popstate).
  useEffect(() => {
    const onNav = () => post('gcode-bridge:navigated', { url: window.location.href, title: document.title })
    window.addEventListener('popstate', onNav)
    router.events.on('routeChangeComplete', onNav)
    return () => {
      window.removeEventListener('popstate', onNav)
      router.events.off('routeChangeComplete', onNav)
    }
  }, [router])

  // Element picker
  useEffect(() => {
    const highlight = highlightRef.current
    if (!highlight) return

    if (!pickerActive) {
      highlight.style.display = 'none'
      document.body.style.cursor = ''
      return
    }

    document.body.style.cursor = 'crosshair'

    const moveHighlight = (el: Element) => {
      const r = el.getBoundingClientRect()
      Object.assign(highlight.style, {
        display: 'block',
        top: `${r.top}px`,
        left: `${r.left}px`,
        width: `${r.width}px`,
        height: `${r.height}px`,
      })
    }

    const onMouseMove = (e: MouseEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === highlight) return
      moveHighlight(el)
      const r = el.getBoundingClientRect()
      post('gcode-bridge:element_hovered', {
        selector: getSelector(el),
        tagName: el.tagName.toLowerCase(),
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      })
    }

    const onClick = (e: MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el || el === highlight) return
      const r = el.getBoundingClientRect()
      post('gcode-bridge:element_selected', {
        url: window.location.href,
        pathname: window.location.pathname,
        selector: getSelector(el),
        tagName: el.tagName.toLowerCase(),
        id: (el as HTMLElement).id || null,
        classes: Array.from(el.classList),
        text: el.textContent?.trim().slice(0, 2000) ?? null,
        rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        outerHTML: el.outerHTML.slice(0, 2000),
        styles: getEditableStyles(el),
        hasElementChildren: el.children.length > 0,
      })
      setPickerActive(false)
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        post('gcode-bridge:picker_cancelled', {})
        setPickerActive(false)
      }
    }

    document.addEventListener('mousemove', onMouseMove, true)
    document.addEventListener('click', onClick, true)
    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('mousemove', onMouseMove, true)
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.cursor = ''
      highlight.style.display = 'none'
    }
  }, [pickerActive])

  return (
    <div
      ref={highlightRef}
      style={{
        position: 'fixed',
        display: 'none',
        pointerEvents: 'none',
        zIndex: 2147483647,
        outline: '2px solid #58a6ff',
        background: '#58a6ff18',
        boxSizing: 'border-box',
      }}
    />
  )
}
