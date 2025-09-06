/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Piggy Boss Brand Colors
        primary: {
          50: '#f6f8f7',
          100: '#e1e8e3',
          200: '#c3d1c7',
          300: '#9bb1a1',
          400: '#708e78',
          500: '#5f6361',
          600: '#4a524e',
          700: '#3d423f',
          800: '#333735',
          900: '#0a120e',
          DEFAULT: '#0a120e',
        },
        secondary: {
          50: '#f8f8f8',
          100: '#efefef',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#5f6361',
          600: '#4c4f4d',
          700: '#404340',
          800: '#363836',
          900: '#2f2f2f',
          DEFAULT: '#5f6361',
        },
        accent: {
          50: '#f7f9f7',
          100: '#eff2ee',
          200: '#dde4db',
          300: '#c1cfbd',
          400: '#9ba896',
          500: '#7d8a79',
          600: '#636f60',
          700: '#51594f',
          800: '#424842',
          900: '#373c37',
          DEFAULT: '#9ba896',
        },
        surface: {
          50: '#fbfbf9',
          100: '#f0f0ea',
          200: '#e1e1d5',
          300: '#cccfcd',
          400: '#b3b6b3',
          500: '#989b98',
          600: '#7d807d',
          700: '#646764',
          800: '#4f524f',
          900: '#3d403d',
          DEFAULT: '#f0f0ea',
        },
        // Functional colors
        success: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        warning: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        error: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        info: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: [
          '"Inter Variable"',
          '"Inter"',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          '"Noto Sans"',
          'sans-serif',
          '"Apple Color Emoji"',
          '"Segoe UI Emoji"',
          '"Segoe UI Symbol"',
          '"Noto Color Emoji"',
        ],
        mono: [
          '"JetBrains Mono Variable"',
          '"JetBrains Mono"',
          '"Fira Code"',
          '"Consolas"',
          '"Monaco"',
          '"Courier New"',
          'monospace',
        ],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      animation: {
        // Custom animations for Piggy Boss
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(159, 168, 150, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(159, 168, 150, 0.8)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'soft': '0 2px 15px 0 rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 8px 30px 0 rgba(0, 0, 0, 0.12)',
        'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px rgba(159, 168, 150, 0.4)',
        'glow-lg': '0 0 30px rgba(159, 168, 150, 0.6)',
      },
      gradientColorStops: {
        'primary-gradient': {
          'from': '#0a120e',
          'to': '#5f6361',
        },
        'accent-gradient': {
          'from': '#9ba896',
          'to': '#5f6361',
        },
        'surface-gradient': {
          'from': '#fbfbf9',
          'to': '#f0f0ea',
        },
      },
      screens: {
        'xs': '475px',
        '3xl': '1680px',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [
    // Custom plugin for Piggy Boss utilities
    function({ addUtilities, theme }) {
      const newUtilities = {
        '.text-balance': {
          'text-wrap': 'balance',
        },
        '.glass': {
          'backdrop-filter': 'blur(12px)',
          'background-color': 'rgba(255, 255, 255, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          'backdrop-filter': 'blur(12px)',
          'background-color': 'rgba(0, 0, 0, 0.1)',
          'border': '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.gradient-text': {
          'background': 'linear-gradient(135deg, #0a120e 0%, #9ba896 100%)',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.skeleton': {
          'background': 'linear-gradient(90deg, #f0f0ea 25%, #e5e5df 50%, #f0f0ea 75%)',
          'background-size': '200% 100%',
          'animation': 'shimmer 2s infinite',
        },
      }
      addUtilities(newUtilities)
    }
  ],
}
