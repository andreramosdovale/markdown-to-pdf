import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './privacy.html', './src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    // ── Typography ────────────────────────────────────────────
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['"JetBrains Mono"', '"Fira Code"', '"Cascadia Code"', 'ui-monospace', 'monospace'],
    },
    fontSize: {
      xs:   ['12px', { lineHeight: '1.5' }],
      sm:   ['13px', { lineHeight: '1.5' }],
      base: ['14px', { lineHeight: '1.5' }],
      md:   ['15px', { lineHeight: '1.5' }],
      lg:   ['16px', { lineHeight: '1.5' }],
      xl:   ['18px', { lineHeight: '1.4' }],
      '2xl':['20px', { lineHeight: '1.4' }],
      '3xl':['24px', { lineHeight: '1.3' }],
    },
    // ── Spacing — strict 8pt grid ─────────────────────────────
    // 1 = 4px | 2 = 8px | 3 = 12px | 4 = 16px | 6 = 24px | 8 = 32px | 12 = 48px
    // Tailwind's default scale already matches — extending with named aliases:
    extend: {
      // ── Color system (CSS-variable-driven for theme switching) ─
      colors: {
        bg:      'var(--color-bg)',
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt:     'var(--color-surface-alt)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle:  'var(--color-border-subtle)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover:   'var(--color-accent-hover)',
          soft:    'var(--color-accent-soft)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error:   'var(--color-error)',
      },

      // ── Border radius ──────────────────────────────────────
      borderRadius: {
        sm: '6px',
        md: '8px',
        lg: '10px',
      },

      // ── Shadows ────────────────────────────────────────────
      boxShadow: {
        sm: '0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 12px rgba(0,0,0,0.06)',
        lg: '0 10px 30px rgba(0,0,0,0.08)',
        // Dark mode variants (softer)
        'md-dark': '0 4px 16px rgba(0,0,0,0.2)',
        'lg-dark': '0 10px 40px rgba(0,0,0,0.3)',
      },

      // ── Animation ──────────────────────────────────────────
      transitionDuration: { DEFAULT: '180ms' },
      transitionTimingFunction: { DEFAULT: 'ease' },

      keyframes: {
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to:   { transform: 'translateX(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
      animation: {
        'slide-in':  'slideInRight 200ms ease forwards',
        'fade-in':   'fadeIn 150ms ease forwards',
      },

      // ── Typography plugin config ────────────────────────────
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body':        'var(--color-text-primary)',
            '--tw-prose-headings':    'var(--color-text-primary)',
            '--tw-prose-lead':        'var(--color-text-secondary)',
            '--tw-prose-links':       'var(--color-accent)',
            '--tw-prose-bold':        'var(--color-text-primary)',
            '--tw-prose-counters':    'var(--color-text-secondary)',
            '--tw-prose-bullets':     'var(--color-text-muted)',
            '--tw-prose-hr':          'var(--color-border)',
            '--tw-prose-quotes':      'var(--color-text-primary)',
            '--tw-prose-quote-borders': 'var(--color-border)',
            '--tw-prose-captions':    'var(--color-text-secondary)',
            '--tw-prose-code':        'var(--color-text-primary)',
            '--tw-prose-pre-code':    'var(--color-text-primary)',
            '--tw-prose-pre-bg':      'var(--color-surface-alt)',
            '--tw-prose-th-borders':  'var(--color-border)',
            '--tw-prose-td-borders':  'var(--color-border-subtle)',
            // Invert vars (dark mode)
            '--tw-prose-invert-body':        'var(--color-text-primary)',
            '--tw-prose-invert-headings':    'var(--color-text-primary)',
            '--tw-prose-invert-links':       'var(--color-accent)',
            '--tw-prose-invert-bold':        'var(--color-text-primary)',
            '--tw-prose-invert-counters':    'var(--color-text-secondary)',
            '--tw-prose-invert-bullets':     'var(--color-text-muted)',
            '--tw-prose-invert-hr':          'var(--color-border)',
            '--tw-prose-invert-quotes':      'var(--color-text-primary)',
            '--tw-prose-invert-quote-borders': 'var(--color-border)',
            '--tw-prose-invert-code':        'var(--color-text-primary)',
            '--tw-prose-invert-pre-bg':      'var(--color-surface-alt)',
            '--tw-prose-invert-th-borders':  'var(--color-border)',
            '--tw-prose-invert-td-borders':  'var(--color-border-subtle)',
            maxWidth: '100%',
            lineHeight: '1.7',
          },
        },
      },
    },
  },
  plugins: [typography],
};
