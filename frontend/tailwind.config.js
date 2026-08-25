/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    animation: {
  arScan: "arScan 6s linear infinite",
},

keyframes: {
  arScan: {
    "0%": {
      transform: "translateY(0)",
      opacity: "0",
    },
    "10%": {
      opacity: "1",
    },
    "90%": {
      opacity: "1",
    },
    "100%": {
      transform: "translateY(100vh)",
      opacity: "0",
    },
  },
},
animation: {
  arScan: "arScan 6s linear infinite",
  dashboardEnter: "dashboardEnter 0.8s ease-out",
},

keyframes: {
  arScan: {
    "0%": {
      transform: "translateY(0)",
      opacity: "0",
    },
    "10%": {
      opacity: "1",
    },
    "90%": {
      opacity: "1",
    },
    "100%": {
      transform: "translateY(100vh)",
      opacity: "0",
    },
  },

  dashboardEnter: {
    "0%": {
      opacity: "0",
      transform: "translateY(18px) scale(0.985)",
    },
    "100%": {
      opacity: "1",
      transform: "translateY(0) scale(1)",
    },
  },
},

  },
  plugins: [],
};