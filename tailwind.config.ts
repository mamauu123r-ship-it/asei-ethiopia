import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0F2A24", deep: "#0B1F1B" },
        leaf: "#146B4E",
        sun: { DEFAULT: "#F5B301", pale: "#FBEBC0", dark: "#6B4B00" },
        mist: "#F1F5F2",
        line: "#E3E9E6",
        body: "#2F3E3A",
        muted: "#4A5A55",
        haze: "#D6E2DE",
        sky: { pale: "#D9E6F2", dark: "#1E3A5F" },
        iris: { pale: "#E6E1F0", dark: "#4B3A73" },
        sage: "#DCE8E1",
      },
      fontFamily: {
        display: ["Sora", "Segoe UI", "Arial", "sans-serif"],
        sans: ['"Source Sans 3"', "Segoe UI", "Arial", "sans-serif"],
      },
      maxWidth: { site: "1240px" },
    },
  },
  plugins: [],
};

export default config;
