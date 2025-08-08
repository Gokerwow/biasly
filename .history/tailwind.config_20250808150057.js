/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {
      colors: {
        'kpop-pink': '#FF2D78',
        'kpop-blue': '#00A2FF',
        'kpop-purple': '#8A2BE2',
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
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(255, 45, 120, 0.5)' },
          '100%': { boxShadow: '0 0 30px rgba(255, 45, 120, 0.8)' },
        }
      }
    }
  },
  plugins: [],
}

