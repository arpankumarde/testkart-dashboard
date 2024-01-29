/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        mobile: { raw: "(max-width: 768px)" },
      },
      boxShadow: {
        card: "1px 0 20px #0000000d",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
