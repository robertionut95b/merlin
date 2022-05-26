module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      transitionProperty: {
        width: "width",
      },
    },
    fontFamily: {
      inter: ["Borlow", "sans-serif"],
    },
  },
  plugins: [],
};
