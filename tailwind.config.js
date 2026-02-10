/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#007AFF",
                surface: "#1C1C1E",
                card: "#2C2C2E",
                subtle: "#3A3A3C",
                muted: "#8E8E93",
                accent: "#30D158",
                danger: "#FF3B30",
            },
        },
    },
    plugins: [],
};
