import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      screens: {
        mobile: { raw: "(max-width: 768px)" },
      },
      boxShadow: {
        card: "1px 0 20px #0000000d",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
} satisfies Config;
