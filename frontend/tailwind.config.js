/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gheeGold: '#E6B65C',
        oliveGreen: '#5F6B3C',
        warmBrown: '#6B4A1E',
        creamBg: '#FAF7F2',
        creamLight: '#FDF9F3',
      },
      fontFamily: {
        heading: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 30px rgba(0,0,0,0.08)',
      },
      borderRadius: {
        card: '18px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}

