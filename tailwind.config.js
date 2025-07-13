module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        background: '#111111',
        foreground: '#ffffff',
        border: '#111',
        ring: '#3b82f6',
      }
    },
  },
  experimental: {
    disableColorOkLCH: true, // ⛔ disables oklch() colors
  },
  plugins: [],
}
