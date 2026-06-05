import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        // Primary — deep forest-teal "Kyul green"
        forest: {
          50: '#f1f6f3',
          100: '#dbe9e1',
          200: '#b9d3c6',
          300: '#8db6a4',
          400: '#5e9079',
          500: '#3f755f',
          600: '#2d5d4b',
          700: '#234a3d',
          800: '#1b3a30',
          900: '#143029',
          950: '#0a201b',
        },
        // Accent — brushed gold
        gold: {
          50: '#faf6ec',
          100: '#f2e8c9',
          200: '#e6d293',
          300: '#d9b962',
          400: '#cda646',
          500: '#bd9038',
          600: '#a2762f',
          700: '#825a29',
          800: '#6c4a27',
          900: '#5c3f24',
        },
        // Warm neutral — sand / paper / ink
        sand: {
          50: '#faf8f3',
          100: '#f4f0e6',
          200: '#eae3d3',
          300: '#dacfb6',
          400: '#c3b291',
          500: '#ab9670',
          600: '#8f7a58',
          700: '#736149',
          800: '#5d503e',
          900: '#4d4335',
        },
        ink: '#12201c',
        paper: '#f8f5ee',
      },
      fontFamily: {
        display: ['Fraunces', 'ui-serif', 'Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
      },
      letterSpacing: {
        tightish: '-0.015em',
        widest2: '0.22em',
      },
      maxWidth: {
        shell: '78rem',
        prose2: '46rem',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(18,32,28,0.04), 0 8px 24px -12px rgba(18,32,28,0.14)',
        card: '0 1px 3px rgba(18,32,28,0.05), 0 16px 40px -24px rgba(18,32,28,0.28)',
        lift: '0 24px 60px -28px rgba(10,32,27,0.45)',
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both',
        'fade-in': 'fade-in 0.8s ease both',
      },
    },
  },
  plugins: [],
}
