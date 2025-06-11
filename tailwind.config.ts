import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'mono': ['JetBrains Mono', 'IBM Plex Mono', 'Consolas', 'Monaco', 'monospace'],
        'display': ['Orbitron', 'JetBrains Mono', 'monospace'],
      },
      colors: {
        // NOX Dark Theme
        'nox': {
          'black': '#0a0a0a',
          'dark': '#111111',
          'darker': '#1a1a1a',
          'gray': '#2a2a2a',
          'light-gray': '#3a3a3a',
          'text': '#e0e0e0',
          'text-dim': '#a0a0a0',
        },
        // Neon Colors
        'neon': {
          'cyan': '#00ffff',
          'purple': '#8b5cf6',
          'pink': '#ec4899',
          'green': '#10b981',
          'blue': '#3b82f6',
          'orange': '#f59e0b',
        },
        // Glassmorphism
        'glass': {
          'white': 'rgba(255, 255, 255, 0.1)',
          'dark': 'rgba(0, 0, 0, 0.2)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'neon-glow': 'linear-gradient(45deg, #00ffff, #8b5cf6, #ec4899)',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'neon-pink': '0 0 20px rgba(236, 72, 153, 0.5)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'typewriter': 'typewriter 3s steps(40) 1s 1 normal both',
        'blink': 'blink 1s infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-shift': 'gradientShift 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': {
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
            textShadow: '0 0 20px rgba(0, 255, 255, 0.5)'
          },
          '100%': {
            boxShadow: '0 0 30px rgba(0, 255, 255, 0.8)',
            textShadow: '0 0 30px rgba(0, 255, 255, 0.8)'
          },
        },
        typewriter: {
          '0%': { width: '0' },
          '100%': { width: '100%' },
        },
        blink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}

export default config
