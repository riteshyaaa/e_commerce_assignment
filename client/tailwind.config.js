/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f9f9fb',
          100: '#f2f2f6',
          200: '#e5e5ed',
          300: '#d0d0df',
          400: '#9b9bb5',
          500: '#6c6c8f',
          600: '#4f4f6e',
          700: '#383850',
          800: '#232335',
          900: '#12121d',
          950: '#0a0a10',
        },
        accent: {
          50: '#fbf7f4',
          100: '#f5ebe4',
          200: '#ebd3c3',
          300: '#ddb59a',
          400: '#cb9270',
          500: '#bf764f',
          600: '#b1613f',
          700: '#944d34',
          800: '#773f2e',
          900: '#623528',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'premium': '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 5px 15px -5px rgba(0, 0, 0, 0.03)',
        'card': '0 2px 12px -2px rgba(0, 0, 0, 0.06), 0 1px 4px -1px rgba(0, 0, 0, 0.04)',
        'floating': '0 20px 40px -10px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
