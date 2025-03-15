import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import Components from 'unplugin-vue-components/vite';
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers';
import AutoImport from 'unplugin-auto-import/vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    vueDevTools(),
    AutoImport({
      imports:['vue'],
      dts:"src/auto-import.d.ts"   //  会自动生成此文件
    }),
    Components({
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
          resolveIcons: true
        }),
      ],
    }),
  ],
  server: {
    host: 'localhost',
    cors: {
      credentials: true,
      methods: 'PUT,POST,GET,DELETE,OPTIONS',
      origin: '',
    },
    port: 5173,
    proxy: {
      '/githubApi': {
        target: 'https://api.github.com',
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/githubApi/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
