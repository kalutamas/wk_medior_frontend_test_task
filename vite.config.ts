import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => {
  const isProd = command === 'build'

  return {
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
    ],
    base: isProd ? '/wk_medior_frontend_test_task/' : '/',
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})