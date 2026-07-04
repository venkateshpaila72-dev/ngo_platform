/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F766E',
          dark: '#115E59',
          light: '#14B8A6',
        },
        accent: '#D97706',
        success: '#059669',
        warning: '#EA580C',
        critical: '#DC2626',
        background: '#FFFBEB',
        card: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#64748B',
        borderc: '#F2E6E2',
      },
      fontFamily: {
        heading: ['Lexend', 'sans-serif'],
        body: ['"Source Sans 3"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}