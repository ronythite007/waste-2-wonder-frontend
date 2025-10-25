/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-in-out',
        'bounce-delayed': 'bounceDelayed 1s infinite'
        , 'shimmer': 'shimmer 1.5s linear infinite',
        'bubble-pulse': 'bubblePulse 1.8s ease-in-out infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceDelayed: {
          '0%, 80%, 100%': { transform: 'translateY(0)' },
          '40%': { transform: 'translateY(-6px)' },
        }
        ,
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        bubblePulse: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(0.98)', opacity: '0.9' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
