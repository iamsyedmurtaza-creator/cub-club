/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Poppins", "sans-serif"],
      },
      colors: {
        cream: "#FFF7DC",
        butter: "#FFE899",
        honey: "#F5B400",
        ink: "#24201C",
        cocoa: "#4A2D20",
        clay: "#A15D38",
        peach: "#FBE0CC",
        blush: "#FFF1EA",
        mint: "#D9F1DC",
        skybaby: "#DFF2FF",
        paper: "#FFFDF7",
      },
      boxShadow: {
        soft: "0 22px 60px rgba(36, 32, 28, 0.12)",
        card: "0 14px 34px rgba(36, 32, 28, 0.08)",
        store: "0 10px 28px rgba(36, 32, 28, 0.07)",
      },
      backgroundImage: {
        'cub-gradient': 'linear-gradient(135deg, #FFF7DC 0%, #FFF1EA 48%, #DFF2FF 100%)',
        'sunny-gradient': 'linear-gradient(135deg, #F7C442 0%, #FBE0CC 100%)',
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        floaty: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        marquee: "marquee 18s linear infinite",
        floaty: "floaty 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
