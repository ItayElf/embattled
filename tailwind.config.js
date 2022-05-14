module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      fontFamily: {
        ptsans: ["ptsans"],
        ptserif: ["ptserif"],
      },
      colors: {
        primary: {
          50: "#FFEBEF",
          100: "#FFCDD3",
          200: "#F59A9B",
          300: "#EE7274",
          400: "#F94F50",
          500: "#FE3B34",
          600: "#F03134",
          700: "#DE252E",
          800: "#D11C27",
          900: "#C20619",
        },
        secondary: {
          dark: "#FBEBD8",
          DEFAULT: "#FFFAEF",
          light: "#FFFFFF",
        },
        gray: "#9E9992",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
