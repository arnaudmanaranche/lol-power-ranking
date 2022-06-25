/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */

module.exports = {
  content: [
    "./src/**/*.tsx",
    "/packages/design-system/src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#03acbf",
        primaryDark: "#027F8D",
        dark: "#0e0e10",
        backgroundColor: "#f7f7f8",
        gTier: "#ff1902",
        sTier: "#f9be22",
        aTier: "#ff9a01",
        bTier: "#619c45",
        cTier: "#2e7fcb",
        dTier: "#8b7fc5",
      },
      fontFamily: {
        title: ["CabinBold"],
        body: ["CabinRegular"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
