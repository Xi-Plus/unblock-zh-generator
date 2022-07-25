import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    // minify: false,
    lib: {
      entry: 'src/main.js',
      formats: ['iife'],
      name: 'unblock-zh-generator.js',
      fileName: 'unblock-zh-generator',
    },
  },
})
