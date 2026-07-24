import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0A0D13',
        panel: '#11151F',
        'panel-alt': '#161B27',
        border: 'rgba(231,234,240,0.09)',
        'border-strong': 'rgba(231,234,240,0.16)',
        ink: '#E9ECF2',
        muted: '#8A93A6',
        dim: '#565D6E',
        accent: '#4CD9C0',
        'accent-dim': 'rgba(76,217,192,0.14)',
        amber: '#F2A93B',
        'amber-dim': 'rgba(242,169,59,0.14)',
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
