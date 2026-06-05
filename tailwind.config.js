/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        surface: {
          bg:      '#09090b',   // True near-black
          raised:  '#111113',   // Card surfaces — richer
          overlay: '#18181b',   // Input / elevated
          border:  '#27272a',   // Subtle hairline
          muted:   '#3f3f46',   // Dividers, hover
        },
        text: {
          primary:   '#fafafa',  // Crisp white
          secondary: '#a1a1aa',  // Muted prose
          tertiary:  '#52525b',  // Placeholder, disabled
        },
        accent: {
          DEFAULT: '#818cf8',    // Soft indigo — calmer than pure blue
          dim:     '#818cf811',  // Tinted bg
          hover:   '#a5b4fc',    // Lighter on hover
          ring:    'rgba(129,140,248,0.25)',
          foreground: 'var(--accent-foreground)',
        },
        state: {
          danger:  '#f87171',
          success: '#4ade80',
          warning: '#fbbf24',
        },
      },
      backgroundImage: {
        'gradient-subtle': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(129,140,248,0.06) 0%, transparent 60%)',
        'gradient-chat':   'linear-gradient(135deg, #111113 0%, #0d0d0f 100%)',
        'user-bubble':     'linear-gradient(135deg, #1e1e2e 0%, #1a1a2e 100%)',
      },
      boxShadow: {
        card:    '0 1px 4px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)',
        float:   '0 16px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
        accent:  '0 0 0 2px rgba(129,140,248,0.25)',
        glow:    '0 0 24px rgba(129,140,248,0.15)',
        inset:   'inset 0 1px 0 rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
      },
      animation: {
        'fade-in':    'fadeIn 0.2s ease-out forwards',
        'slide-up':   'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in':   'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer':    'shimmer 1.6s infinite linear',
        'blink':      'blink 1.2s step-end infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'bounce-dot': 'bounceDot 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        bounceDot: {
          '0%, 80%, 100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '40%':           { transform: 'translateY(-5px)', opacity: '1'   },
        },
      },
    },
  },
  plugins: [],
}
