export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#050505', accent: '#FF4528', char: '#111214' },
    fontFamily: { display: ['"Barlow Condensed"', 'Impact', 'sans-serif'], sans: ['Inter', 'system-ui', 'sans-serif'] },
    keyframes: { float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } } },
    animation: { float: 'float 6s ease-in-out infinite' },
  } },
}
