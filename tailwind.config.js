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
                primaryLight: '#EAF0FF',
                background: '#F4F6FB',
                surface: '#FFFFFF',
                textPrimary: '#141B2D',
                textSecondary: '#80746b',
                textBrown: '#a52a2a',
                success: '#1FAE5A',
                warning: '#E0A400',
                danger: '#D9432F',
                border: '#E7EAF3',
                chartTrackLight: '#DCE4FA',
                pageBg: '#F8F9FF',
                sectionBg: '#EEF2FF',
                inputBg: '#DDE3F0',
                sidebarBg: '#FFFFFF',
                activeNavBg: '#EEF2FF',
                accentOrangeBg: '#FFE9DC',
                accentOrange: '#E8590C',
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