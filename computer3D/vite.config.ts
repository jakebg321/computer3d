import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// This explicitly types the configuration
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Expose to all network interfaces
    port: Number(process.env.PORT) || 3000, // Explicitly convert PORT to number
  }
})