import type { Config } from 'tailwindcss'

export default <Config>{
  content: ['./components/**/*.{js,vue,ts}', './layouts/**/*.vue', './pages/**/*.vue', './app.vue'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC',
          400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1',
          800: '#075985', 900: '#0C4A6E'
        },
        dark: { bg: '#0F172A', card: '#1E293B', border: '#334155' },
        light: { bg: '#F8FAFC', card: '#FFFFFF', border: '#E2E8F0' },
        pink: { bg: '#1A1625', card: '#2D2640', border: '#4A3F5C' }
      },
      fontFamily: { sans: ['Inter','sans-serif'], display: ['Space Grotesk','sans-serif'] }
    }
  },
  plugins: []
}
