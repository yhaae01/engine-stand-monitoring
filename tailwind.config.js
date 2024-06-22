/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js'
  ],
  theme: {
    extend: {
      backgroundImage:{
        'pattern-accent': "url('src/assets/images/drawer-accent.svg')"
      },
      backgroundPosition: {
        'top-4': 'left top 3.2rem'
      },
      spacing: {
        52: '13rem',
      },
      boxShadow:{
        'right-dark': '2px 0px 16px 0px rgba(0, 0, 0, 0.2)',
        'right-dark-md': '4px 0px 16px 0px rgba(0, 0, 0, 0.2)',
      },
      colors: {
        "dbx-blue": {
          50: "#EDF1F8",
          100: "#D7E1EF",
          200: "#B2C6E1",
          300: "#8AA7D1",
          400: "#658CC3",
          500: "#4470AD",
          600: "#375A8B",
          700: "#284267",
          800: "#1B2D46",
          900: "#0D1521",
        },
        "dbx-neutral": {
          50: "#F7F7F8",
          100: "#EDEDEE",
          200: "#DADBDC",
          300: "#C8C9CB",
          400: "#B8BABC",
          500: "#A5A7AA",
          600: "#84868B",
          700: "#616366",
          800: "#404244",
          900: "#202122",
        },
        "dbx-green": {
          50: "#E3FCEA",
          100: "#C8F9D6",
          200: "#90F3AC",
          300: "#59ED83",
          400: "#26E85D",
          500: "#14BC44",
          600: "#109837",
          700: "#0C6F28",
          800: "#084A1B",
          900: "#04250D",
        },
        "dbx-warning": {
          50: "#FEF5E7",
          100: "#FDECCE",
          200: "#FBD99D",
          300: "#F9C56C",
          400: "#F7B23B",
          500: "#F59E0B",
          600: "#C47F08",
          700: "#935F06",
          800: "#624004",
          900: "#312002"
        },
        "dbx-error": {
          50: "#FBE9EB",
          100: "#F7D4D7",
          200: "#EFA9AF",
          300: "#E87D86",
          400: "#E0525E",
          500: "#D82735",
          600: "#AD1F2B",
          700: "#821720",
          800: "#561016",
          900: "#2B080B"
        }
      },
      fontFamily: {
        jakarta: ["Plus Jakarta Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require('tw-elements/dist/plugin'),
    require("@tailwindcss/forms"), 
    require("@tailwindcss/typography")
  ],
}