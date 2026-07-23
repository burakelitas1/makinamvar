import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#3B5BDB',
          dark:    '#2F4AC7',
          light:   '#4C6EF5',
        },
        'brand-blue': '#3B5BDB',
        'brand-cyan': '#06B6D4',
        surface: '#F8FAFC',
        anthracite: {
          DEFAULT: '#0F172A',
          mid:     '#2C3E50',
          light:   '#475569',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
