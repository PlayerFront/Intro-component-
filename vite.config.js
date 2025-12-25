import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/Intro-component-/',
    css: {
    devSourcemap: true, 
  }
})
