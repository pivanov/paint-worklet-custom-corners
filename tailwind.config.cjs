module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Adjust this path based on your project structure
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        rotate: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn .5s ease-in-out forwards',
        'rotate': 'rotate 2s linear infinite',
      },
    },
  },
  plugins: [
    ({ addUtilities }) => {
      const newUtilities = {
        '.animation-duration-100': {
          'animation-duration': '150ms',
        },
        '.animation-delay-100': {
          'animation-delay': '150ms',
        },
        '.animation-duration-200': {
          'animation-duration': '200ms',
        },
        '.animation-delay-200': {
          'animation-delay': '200ms',
        },
        '.animation-duration-300': {
          'animation-duration': '300ms',
        },
        '.animation-delay-300': {
          'animation-delay': '300ms',
        },
        '.animation-duration-500': {
          'animation-duration': '500ms',
        },
        '.animation-delay-500': {
          'animation-delay': '500ms',
        },
        '.animation-duration-700': {
          'animation-duration': '700ms',
        },
        '.animation-delay-700': {
          'animation-delay': '700ms',
        },
        '.animation-duration-1000': {
          'animation-duration': '1000ms',
        },
        '.animation-delay-1000': {
          'animation-delay': '1000ms',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};
