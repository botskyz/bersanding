import { Html, Head, Main, NextScript } from 'next/document'

const isPlayground = process.env.NEXT_PUBLIC_IS_PLAYGROUND === 'true'

// The playground preview is a `next dev` server behind a proxy that cannot carry a
// WebSocket upgrade, so Next's HMR client never connects. Left alone it does not
// just fail quietly: it counts reconnects, and on the 26th it calls
// window.location.reload() (next/dist/client/dev/hot-reloader/pages/websocket.js).
// At 5 tries a second apart then 20 at five seconds, that reloads the preview the
// user is looking at every ~105 seconds, forever — wiping scroll position and form
// state, and refreshing the platform's idle timer so an abandoned tab holds a
// container open. Handing the client an inert socket that never opens means
// onerror/onclose never fire, so the reconnect counter never advances.
// Nothing is lost: Fast Refresh could not work through this proxy anyway, and the
// platform reloads the preview itself once an agent turn finishes.
// Matched on the HMR endpoint so the app's own WebSockets are untouched, and gated
// on the playground flag so it is inert in a deployed build.
const inertHmrSocket = `(function () {
  var Native = window.WebSocket
  if (!Native) return
  function Stub(url, protocols) {
    if (typeof url === 'string' && url.indexOf('/_next/webpack-hmr') !== -1) {
      return {
        readyState: 0,
        close: function () {},
        send: function () {},
        addEventListener: function () {},
        removeEventListener: function () {}
      }
    }
    return new Native(url, protocols)
  }
  Stub.prototype = Native.prototype
  Stub.CONNECTING = 0
  Stub.OPEN = 1
  Stub.CLOSING = 2
  Stub.CLOSED = 3
  window.WebSocket = Stub
})()`

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {isPlayground && <script dangerouslySetInnerHTML={{ __html: inertHmrSocket }} />}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
