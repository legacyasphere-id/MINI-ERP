/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base:    '#111827',
          sidebar: '#0F172A',
          card:    '#1F2937',
          hover:   '#1A202C',
        },
        ink: {
          DEFAULT: '#E5E7EB',
          dim:     '#9CA3AF',
          muted:   '#6B7280',
        },
        stroke: {
          DEFAULT: '#374151',
          focus:   '#4A7FA7',
        },
        accent: {
          blue:  '#4A7FA7',
          'blue-dim': '#3a6f97',
          gold:  '#D6BA73',
        },
        status: {
          ok:      '#10B981',
          warning: '#F59E0B',
          error:   '#EF4444',
          info:    '#3B82F6',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'Consolas', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '16px' }],
        xs:    ['12px', { lineHeight: '16px' }],
        sm:    ['13px', { lineHeight: '20px' }],
        base:  ['14px', { lineHeight: '20px' }],
        md:    ['16px', { lineHeight: '24px' }],
        lg:    ['18px', { lineHeight: '28px' }],
        xl:    ['20px', { lineHeight: '28px' }],
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        md: '6px',
      },
      transitionDuration: {
        fast: '80ms',
      },
      height: {
        'row': '32px',
        'input': '32px',
        'btn': '32px',
        'topbar': '48px',
      },
      width: {
        'sidebar': '240px',
      },
    },
  },
  plugins: [],
};
