/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#f8fafc', // Light bg
          surface: '#ffffff',
          card: 'rgba(255, 255, 255, 0.8)',
          border: 'rgba(0, 0, 0, 0.05)',
        },
        primary: {
          DEFAULT: '#0ea5e9', // Sky blue/cyan
          light: '#38bdf8',
          dark: '#0284c7',
          50: '#f0f9ff',
        },
        accent: {
          DEFAULT: '#f97316', // Orange
          light: '#fb923c',
          dark: '#ea580c',
        },
        neon: {
          cyan: '#06b6d4',
          pink: '#ec4899',
          green: '#10b981',
          amber: '#f59e0b',
          blue: '#3b82f6',
          orange: '#f97316',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up-delay': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both',
        'slide-up-delay-2': 'slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both',
        'pulse-glow': 'pulseGlow 2.5s ease-in-out infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-delay': 'float 8s ease-in-out 3s infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse': 'spin 12s linear infinite reverse',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'gradient-x': 'gradientX 8s ease infinite',
        'particle-1': 'particle1 15s ease-in-out infinite',
        'particle-2': 'particle2 20s ease-in-out infinite',
        'particle-3': 'particle3 18s ease-in-out infinite',
        'particle-4': 'particle4 22s ease-in-out infinite',
        'particle-5': 'particle5 16s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.3), 0 0 60px rgba(14, 165, 233, 0.1)' },
          '50%': { boxShadow: '0 0 30px rgba(14, 165, 233, 0.5), 0 0 80px rgba(249, 115, 22, 0.2)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(1deg)' },
          '66%': { transform: 'translateY(-8px) rotate(-1deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientX: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        particle1: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
          '25%': { transform: 'translate(100px, -150px) scale(1.2)', opacity: '0.6' },
          '50%': { transform: 'translate(-50px, -300px) scale(0.8)', opacity: '0.3' },
          '75%': { transform: 'translate(80px, -100px) scale(1.1)', opacity: '0.5' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.4' },
        },
        particle2: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0.3' },
          '33%': { transform: 'translate(-120px, -200px) rotate(120deg)', opacity: '0.5' },
          '66%': { transform: 'translate(60px, -100px) rotate(240deg)', opacity: '0.2' },
          '100%': { transform: 'translate(0, 0) rotate(360deg)', opacity: '0.3' },
        },
        particle3: {
          '0%': { transform: 'translate(0, 0) scale(1)', opacity: '0.5' },
          '50%': { transform: 'translate(150px, -250px) scale(1.5)', opacity: '0.2' },
          '100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.5' },
        },
        particle4: {
          '0%': { transform: 'translate(0, 0)', opacity: '0.3' },
          '25%': { transform: 'translate(-80px, -120px)', opacity: '0.6' },
          '50%': { transform: 'translate(40px, -240px)', opacity: '0.2' },
          '75%': { transform: 'translate(-60px, -80px)', opacity: '0.5' },
          '100%': { transform: 'translate(0, 0)', opacity: '0.3' },
        },
        particle5: {
          '0%': { transform: 'translate(0, 0) rotate(0deg) scale(1)', opacity: '0.4' },
          '50%': { transform: 'translate(-100px, -180px) rotate(180deg) scale(1.3)', opacity: '0.6' },
          '100%': { transform: 'translate(0, 0) rotate(360deg) scale(1)', opacity: '0.4' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '25%': { transform: 'rotate(-3deg)' },
          '75%': { transform: 'rotate(3deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-gradient': 'linear-gradient(135deg, #0ea5e9 0%, #f97316 100%)',
      },
    },
  },
  plugins: [],
};
