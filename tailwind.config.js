/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',        // Path to your main HTML file
    './src/**/*.{js,ts,jsx,tsx}',  // Path to all your React components and files
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
    },
  },
  plugins: [],
}
