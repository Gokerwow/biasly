/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
      colors: {
        'kpop-pink': '#EB4899',
        'kpop-blue': '#00A2FF',
        'kpop-purple': '#9900FF',
        'kpop-black': '#181818',
        'kpop-gray': '#F5F5F5'
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
        display: ['"Poppins"', 'sans-serif']
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
  },
  plugins: [],
}

