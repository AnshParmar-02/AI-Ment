const config = {
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        text: "#000000",
        // etc.
      },
    },
  },
  plugins: ["@tailwindcss/postcss"],
  experimental: {
    disableColorOkLCH: true, // ⛔ disables oklch() colors
  },
};

export default config;

// export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };

