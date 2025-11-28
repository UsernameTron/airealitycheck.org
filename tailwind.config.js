/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './components/**/*.html',
    './js/**/*.js',
    './articles/**/*.html',
    './case-studies/**/*.html',
    './portfolio/**/*.html',
    './resources/**/*.html',
    './contact/**/*.html',
    './creative/**/*.html',
    './templates/**/*.html'
  ],
  theme: {
    extend: {
      transitionTimingFunction: {
        elastic: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        premium: 'var(--ease-premium)',
        bounce: 'var(--ease-bounce)'
      },
      backdropBlur: {
        glass: 'var(--glass-blur)',
        'glass-strong': 'var(--glass-blur-strong)'
      },
      colors: {
        glass: {
          bg: 'var(--glass-bg)',
          'bg-subtle': 'var(--glass-bg-subtle)',
          border: 'var(--glass-border)'
        },
        'arc-blue': {
          50: '#e8f2fd',
          100: '#c5e1fb',
          200: '#9fcef8',
          300: '#78bbf5',
          400: '#5aacf3',
          500: '#3d9df1',
          600: '#2d8ce8',
          700: '#1a73e8',
          800: '#1557b0',
          900: '#0f3f7d',
          DEFAULT: '#1a73e8'
        },
        'arc-teal': {
          50: '#e6f3f3',
          100: '#c0e0e0',
          200: '#96cccc',
          300: '#6cb8b8',
          400: '#4da8a8',
          500: '#2d9898',
          600: '#2d8b8b',
          700: '#267878',
          800: '#1f6565',
          900: '#144646',
          DEFAULT: '#2d8b8b'
        },
        'arc-warm': {
          50: '#fef5e7',
          100: '#fde6c3',
          200: '#fcd69b',
          300: '#fbc673',
          400: '#faba55',
          500: '#f9ae37',
          600: '#f59e31',
          700: '#ea8600',
          800: '#c27000',
          900: '#944e00',
          DEFAULT: '#ea8600'
        },
        'arc-dark': '#0a0a17'
      },
      fontFamily: {
        display: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        body: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace']
      },
      boxShadow: {
        glow: '0 0 20px rgba(26, 115, 232, 0.4)',
        'glow-light': '0 0 20px rgba(26, 115, 232, 0.2)',
        'premium-sm': 'var(--shadow-premium-sm)',
        'premium-md': 'var(--shadow-premium-md)',
        'premium-lg': 'var(--shadow-premium-lg)',
        'glow-blue': 'var(--shadow-glow-blue)',
        'glow-multi': 'var(--shadow-glow-multi)'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      }
    }
  },
  plugins: []
};
