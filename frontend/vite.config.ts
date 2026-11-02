import { fileURLToPath } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'

const ENV_DIR = fileURLToPath(new URL('..', import.meta.url))

function assertPagesApiBaseUrl(mode: string) {
  if (process.env.CF_PAGES !== '1') return
  const value = (loadEnv(mode, ENV_DIR, 'VITE_').VITE_API_BASE_URL ?? '').trim()
  if (!/^https:\/\/[^/\s]+/.test(value)) {
    throw new Error(
      `VITE_API_BASE_URL must be the https:// URL of the backend API on Cloudflare Pages, got "${value}"`,
    )
  }
}

export default defineConfig(({ command, mode }) => {
  if (command === 'build') assertPagesApiBaseUrl(mode)
  return {
    plugins: [react(), tailwindcss()],
    envDir: '..',
    server: {
      port: 5173,
      strictPort: true,
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      restoreMocks: true,
    },
  }
})
