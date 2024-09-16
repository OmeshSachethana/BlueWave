module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure all files where you use Tailwind classes are included
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          700: '#1D4ED8', // Define your primary color (or use Tailwind's default palette)
          600: '#2563EB',
        },
      },
    },
  },
  plugins: [],
};
