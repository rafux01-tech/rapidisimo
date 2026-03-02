import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#006847",
          dark: "#004d35",
          light: "#008f5a",
        },
        accent: {
          DEFAULT: "#f7931e",
          dark: "#e07d0a",
          light: "#ffb347",
        },
        safe: "#22c55e",
        trust: "#0ea5e9",
      },
    },
  },
  plugins: [],
};
export default config;
