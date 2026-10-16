/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'monospace'],
      },
      colors: {
        bg: {
          DEFAULT: '#F6F3EE',
          subtle: '#EFECE6',
          card: '#FFFFFF',
        },
        ink: {
          DEFAULT: '#141413',
          muted: '#63615B',
          soft: '#918E85',
        },
        line: {
          DEFAULT: '#E5E0D6',
          dark: '#D0C9BC',
        },
        accent: {
          DEFAULT: '#C34A26',
          hover: '#A93A19',
          light: '#F8ECE7',
        },
      },
    },
  },
  plugins: [],
};
