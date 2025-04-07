import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['https://85f0-2406-7400-ff03-6ed1-88c6-35d4-b5ba-d3a0.ngrok-free.app'],
  }
})
