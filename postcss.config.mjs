const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',       // for App Router
    './pages/**/*.{js,ts,jsx,tsx}',     // for Page Router
    './components/**/*.{js,ts,jsx,tsx}',// for shared components
  ],
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

