/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
      ],
  theme: {
    minWidth: {
        '50vw': '50vw',
        '200': '200px',
      },
    extend: {},
  },
  plugins: [],
}

