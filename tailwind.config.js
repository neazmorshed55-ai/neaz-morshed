/** @type {import('tailwindcss').Config} */

/*
 * Site palette — light theme inspired by Flixta's UI/UX designer layout.
 * Change a value here and the whole public site follows (the admin panel
 * keeps its own hard-coded dark styles).
 */
const palette = {
  page: '#F8F9FF',      // page background (very light blue-white)
  surface: '#FFFFFF',   // cards, panels
  surface2: '#F2F4FF',  // tinted sections, icon wells, inputs
  ink: '#05100B',       // headings / strongest text
  inkSoft: '#152A40',   // secondary headings
  body: '#5F6170',      // paragraph text
  muted: '#6E7187',     // captions, meta text
  line: '#E6E9F5',      // borders, dividers
  primary: '#5777FF',   // brand accent (buttons, highlights)
  primaryDark: '#3D5BEF',
  primaryLight: '#8EA2FF',
  primarySoft: '#EEF1FF',
  accent: '#625DF5',    // gradient partner
};

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
    "./index.tsx"
  ],
  theme: {
    extend: {
      colors: {
        page: palette.page,
        surface: { DEFAULT: palette.surface, 2: palette.surface2 },
        ink: { DEFAULT: palette.ink, soft: palette.inkSoft },
        body: palette.body,
        muted: palette.muted,
        line: palette.line,
        primary: {
          DEFAULT: palette.primary,
          dark: palette.primaryDark,
          light: palette.primaryLight,
          soft: palette.primarySoft,
        },
        accent: palette.accent,
        // Legacy keys kept so older class names still resolve to the new palette
        brand: {
          green: palette.primary,
          dark: palette.ink,
        },
      },
      fontFamily: {
        sans: ['var(--font-urbanist)', 'Urbanist', 'system-ui', 'sans-serif'],
        display: ['var(--font-urbanist)', 'Urbanist', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(16, 24, 64, 0.04), 0 8px 24px -12px rgba(16, 24, 64, 0.10)',
        'card-hover': '0 2px 4px rgba(16, 24, 64, 0.04), 0 24px 48px -20px rgba(61, 91, 239, 0.28)',
        glow: '0 18px 40px -14px rgba(87, 119, 255, 0.55)',
      },
    },
  },
  plugins: [],
}
