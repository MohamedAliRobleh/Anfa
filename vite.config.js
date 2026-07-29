import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
    clearMocks: true,
    env: {
      VITE_SUPABASE_URL: 'https://test-project.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'test-anon-key',
      VITE_EMAILJS_SERVICE_ID: 'test-service-id',
      VITE_EMAILJS_PUBLIC_KEY: 'test-public-key',
      VITE_EMAILJS_BOOKING_TEMPLATE_ID: 'test-booking-template-id',
      VITE_EMAILJS_CONTACT_TEMPLATE_ID: 'test-contact-template-id',
    },
  },
})
