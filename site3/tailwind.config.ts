import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      keyframes: {
        'spin-orbit': {
          '0%': { transform: 'rotate(0deg) translate(159px) rotate(0deg)' },
          '50%': { transform: 'rotate(720deg) translate(159px) rotate(-720deg)' },
          '100%': { transform: 'rotate(360deg) translate(159px) rotate(-360deg)' },
        }
      },
      animation: {
        'spin-orbit': 'spin-orbit 1.5s ease-out forwards',
      },
    },
  },
  plugins: [],
} satisfies Config;
