import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#0f0f13',
        surface:  '#18181f',
        surface2: '#22222c',
        accent:   '#7c6ef7',
        accent2:  '#56cfb2',
        muted:    '#7a7a8a',
        border:   '#2a2a38',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.2s ease',
      },
    },
  },
  plugins: [],
};

export default config;
