/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    colors: {
      primary: "#4f46e5",   // Indigo
      secondary: "#9333ea", // Purple
      accent: "#06b6d4",    // Cyan
    },
  },
},
};
