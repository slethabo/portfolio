/* Tailwind Play CDN configuration. Loaded right after the CDN script in
   index.html. Kept in its own file so the page can ship a Content Security
   Policy without 'unsafe-inline' for scripts. */
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: "#0B0F19",
        panel: "#12172A",
        panel2: "#171D33",
        line: "#242B45",
        violet: {
          400: "#A855F7",
          500: "#7C3AED",
          700: "#3B2A6B",
          900: "#1E1638",
        },
        neon: {
          pink: "#FF4FD8",
          soft: "#FF9AE8",
          cyan: "#67E8F9",
          lime: "#A3E635",
        },
      },
      fontFamily: {
        arcade: ['"Press Start 2P"', "monospace"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        neon: "0 0 0 1px rgba(255,79,216,.55), 0 0 22px rgba(255,79,216,.35)",
        violet: "0 0 0 1px rgba(124,58,237,.6), 0 0 22px rgba(124,58,237,.35)",
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
};
