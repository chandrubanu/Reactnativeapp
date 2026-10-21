/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./App.tsx", "./components/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#1449C7",        // matches theme.ts colors.primary
                primaryDark: "#0E3494",    // matches theme.ts colors.primaryDark
                primaryDisabled: "#A9B6D6",
                accent: "#F59E0B",
                card: "#1A1A2E",
            },
            fontFamily: {
                sans: ["Rubik_400Regular"],
                medium: ["Rubik_500Medium"],
                bold: ["Rubik_700Bold"],
            },
        },
    },
    plugins: [],
}