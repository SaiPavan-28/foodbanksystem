/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom non-blue, non-violet color palette
        donor: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          900: '#064E3B',
          accent: '#D97706', // Amber gold
          light: '#FAF8F5'  // Ivory warm sand
        },
        volunteer: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          900: '#134E4A',
          highlight: '#84CC16', // Electric Lime
          alert: '#F97316'     // Sunburst Orange
        },
        admin: {
          bg: '#0F172A',      // Obsidian slate dark mode
          card: '#1E293B',    // Card background
          border: '#334155',  // Border divider
          alert: '#E11D48',   // Vivid Crimson for Golden Hour SLA warning
          warning: '#EAB308', // Ochre Amber
          success: '#10B981', // Mint Green
          text: '#F8FAFC'     // Crisp white text
        },
        landing: {
          sage: '#2F855A',
          copper: '#EA580C',
          sand: '#FAF9F5',
          charcoal: '#1A202C'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
