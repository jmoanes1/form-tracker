import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// The Express API runs on port 5000 (see server/server.js).
// 127.0.0.1 is used instead of "localhost" so the proxy never has to guess
// between IPv6 (::1) and IPv4.
const API_TARGET = 'http://127.0.0.1:5000'

// The client always calls `/api/...` on its own origin, so the browser never
// has to reach http://localhost:5000 directly (which is what produced
// "Failed to fetch"). Requests are proxied to the Express server here.
const apiProxy = {
  '/api': {
    target: API_TARGET,
    changeOrigin: true,
    configure(proxy) {
      // A proxy error means the API is not running or not answering.
      // Log a hint instead of leaving the browser with an empty answer.
      proxy.on('error', (error, request, response) => {
        const reason = error.code || error.message
        const hint =
          '[vite] Could not reach the API at ' +
          API_TARGET +
          ' (' +
          reason +
          '). ' +
          'Start the backend in another terminal: cd server && npm run dev. ' +
          'Or start both at once from the project root: npm run dev.'

        console.error('\n' + hint + '\n')

        if (
          response &&
          typeof response.writeHead === 'function' &&
          !response.headersSent
        ) {
          response.writeHead(502, { 'Content-Type': 'application/json' })
          response.end(
            JSON.stringify({
              success: false,
              message:
                'The API server is not reachable (' +
                reason +
                '). Start it with: cd server && npm run dev',
            })
          )
        }
      })
    },
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Listen on both IPv4 and IPv6 so http://localhost:5173 works no matter
    // which address the OS resolves "localhost" to. Without this, Vite only
    // listens on ::1 here and plain 127.0.0.1 requests fail to connect.
    host: true,
    proxy: apiProxy,
  },
  preview: {
    host: true,
    proxy: apiProxy,
  },
})
