/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      screens: {
        'xs-planner': {'min': '0px', 'max': '639px'},

        'sm-planner': {'min': '640px', 'max': '767px'},

        'md-planner': {'min': '768px', 'max': '1023px'},

        'lg-planner': {'min': '1024px', 'max': '1279px'},

        'xl-planner': {'min': '1280px', 'max': '1535px'},

        '2xl-planner': {'min': '1536px', 'max': '1779px'},

        'sm': '640px',

        'md': '768px',

        'lg': '1024px',

        'xl': '1280px',

        '2xl': '1536px'
      },
    },
  },
  plugins: [],
}