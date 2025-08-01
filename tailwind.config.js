/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Define custom fonts here
        pacifico: ["Pacifico", "cursive"],
      },
    },
  },
  plugins: [],
};
