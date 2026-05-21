import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#050706',
          surface: '#0a0d0b',
          'surface-2': '#101613',
          'surface-3': '#171e1a',
        },
        border: {
          DEFAULT: '#1c2822',
          light: '#283830',
        },
        accent: {
          DEFAULT: '#34d399',
          bright: '#6ee7b7',
          dim: 'rgba(52,211,153,0.08)',
          mid: 'rgba(52,211,153,0.15)',
          glow: 'rgba(52,211,153,0.04)',
        },
        text: {
          DEFAULT: '#e6ede9',
          mid: '#9aaba0',
          dim: '#5e7168',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans: ['Satoshi', 'system-ui', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'fade-up': 'fadeUp 0.8s ease forwards',
        'slide-in-left': 'slideInLeft 0.8s ease forwards',
        'pulse-slow': 'pulse 3s ease infinite',
        'float': 'float 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
