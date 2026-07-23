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
        sans: ['var(--font-manrope)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-xl': ['64px', { lineHeight: '72px', fontWeight: '800' }],
        'hero-mobile': ['40px', { lineHeight: '46px', fontWeight: '800' }],
        'h1': ['56px', { lineHeight: '64px', fontWeight: '700' }],
        'h2': ['42px', { lineHeight: '50px', fontWeight: '700' }],
        'h3': ['32px', { lineHeight: '40px', fontWeight: '600' }],
        'h4': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'h5': ['20px', { lineHeight: '28px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '30px', fontWeight: '400' }],
        'body': ['16px', { lineHeight: '28px', fontWeight: '400' }],
        'small': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'caption': ['12px', { lineHeight: '18px', fontWeight: '400' }],
      },
      maxWidth: {
        'container': '1280px',
      },
      borderRadius: {
        'card': '20px',
        'input': '16px',
        'btn': '16px',
      },
      spacing: {
        'section': '120px',
        'section-tablet': '80px',
        'section-mobile': '64px',
      },
      height: {
        'input': '56px',
        'btn': '56px',
      },
    },
  },
  plugins: [],
}
export default config
