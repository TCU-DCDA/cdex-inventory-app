/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tcu': {
          50: '#f4f3ff',
          100: '#ebe9fe',
          200: '#d9d6fe',
          300: '#beb7fd',
          400: '#9d8dfb',
          500: '#7c5ef8',
          600: '#6d3ef0',
          700: '#5d2cdc',
          800: '#4c23b7',
          900: '#402095',
          950: '#261268',
          'primary': '#4d1979', // TCU Official Purple
          'secondary': '#663399',
          'accent': '#8b5cf6',
        }
      },
    },
  },
  plugins: [],
}
