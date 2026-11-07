/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080D18', // background
          900: '#101827', // main surface
          850: '#121B2B',
          800: '#151F30', // card surface
          750: '#1A273D',
          700: '#1E2D44',
          600: '#2A3C5B',
        },
        borderDark: '#1E293B',
        borderMuted: '#243247',
        accent: {
          DEFAULT: '#22D3EE',
          dark: '#0891B2',
          light: '#67E8F9',
          glow: 'rgba(34, 211, 238, 0.15)',
        },
        hit: {
          DEFAULT: '#22C55E',
          muted: '#14532D',
          subtle: 'rgba(34, 197, 94, 0.12)',
        },
        fault: {
          DEFAULT: '#EF4444',
          muted: '#7F1D1D',
          subtle: 'rgba(239, 68, 68, 0.12)',
        },
        warning: {
          DEFAULT: '#F59E0B',
          subtle: 'rgba(245, 158, 11, 0.12)',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-accent': '0 0 20px -5px rgba(34, 211, 238, 0.25)',
        'glow-hit': '0 0 20px -5px rgba(34, 197, 94, 0.25)',
        'glow-fault': '0 0 20px -5px rgba(239, 68, 68, 0.25)',
      }
    },
  },
  plugins: [],
};

