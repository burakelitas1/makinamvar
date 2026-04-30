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
        navy: {
          600: '#1e3a5f',
          700: '#172d4a',
          800: '#112238',
          900: '#0d1b2a',
          950: '#080f18',
        },
        anthracite: {
          DEFAULT: '#2C3E50',
          light:   '#3D5166',
          dark:    '#1a252f',
        },
        emerald: {
          DEFAULT: '#27AE60',
          light:   '#2ECC71',
          dark:    '#1E8449',
        },
        industrial: {
          DEFAULT: '#E67E22',
          light:   '#F39C12',
          dark:    '#D35400',
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
