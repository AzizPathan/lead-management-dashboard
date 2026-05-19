import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        brand: "#0f766e",
        accent: "#f97316",
        paper: "#f8faf9"
      },
      boxShadow: {
        soft: "0 18px 50px rgba(15, 23, 42, 0.10)",
        panel: "0 12px 34px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
} satisfies Config;
