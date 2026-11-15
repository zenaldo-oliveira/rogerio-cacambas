import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv, type Plugin } from 'vite'

/**
 * URL canônica: só entra no HTML quando VITE_SITE_URL (endereço público definitivo,
 * ex.: https://www.rogeriocacambas.com.br) estiver definida no .env ou no deploy.
 * Também torna og:image absoluto, exigência do WhatsApp e do Facebook para a prévia.
 */
function urlCanonica(siteUrl: string | undefined): Plugin {
  return {
    name: 'url-canonica',
    transformIndexHtml(html) {
      if (!siteUrl) return html
      const base = new URL(siteUrl).origin
      return {
        html: html.replace('content="/compartilhamento.jpg"', `content="${base}/compartilhamento.jpg"`),
        tags: [
          { tag: 'link', attrs: { rel: 'canonical', href: `${base}/` }, injectTo: 'head' },
          { tag: 'meta', attrs: { property: 'og:url', content: `${base}/` }, injectTo: 'head' },
        ],
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), urlCanonica(loadEnv(mode, process.cwd(), 'VITE_').VITE_SITE_URL)],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
}))
