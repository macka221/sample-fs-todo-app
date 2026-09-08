import babel from '@rolldown/plugin-babel'
import tailwindcss from '@tailwindcss/vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

function readProxyTarget(value: string | undefined) {
  const target = value?.trim() || 'http://localhost:8000'
  const url = new URL(target)

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new Error('VITE_PROXY_TARGET must use http or https')
  }

  return url.origin
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const proxyTarget = readProxyTarget(env.VITE_PROXY_TARGET)

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] }),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        axios: fileURLToPath(
          new URL('./node_modules/axios/index.js', import.meta.url),
        ),
        'todo-api-client': fileURLToPath(
          new URL('../clients/typescript/index.ts', import.meta.url),
        ),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      fs: {
        allow: [fileURLToPath(new URL('..', import.meta.url))],
      },
      proxy: {
        '/api': {
          changeOrigin: true,
          target: proxyTarget,
        },
        '/health': {
          changeOrigin: true,
          target: proxyTarget,
        },
      },
    },
  }
})
