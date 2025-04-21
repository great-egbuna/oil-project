import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      backdropBlur: {
        sm: "4px",
      },
      borderWidth: {
        3: "3px",
      },
      dropShadow: {
        "cyber-cyan": "0 0 8px rgba(0, 255, 255, 0.8)",
        "cyber-pink": "0 0 8px rgba(255, 0, 255, 0.8)",
      },
    },
  },
  plugins: [],
};

export default config;
