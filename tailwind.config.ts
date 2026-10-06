import type { Config } from 'tailwindcss';

const colors = {
  page: '#e9edf3',
  surface: '#ffffff',
  'surface-hover': '#f1f4f8',
  'conversation-start': '#f7f9fc',
  'conversation-end': '#edf1f6',
  border: '#e6eaf0',
  foreground: '#172234',
  heading: '#28364a',
  'heading-secondary': '#334157',
  muted: '#6b788b',
  label: '#6f7d91',
  placeholder: '#778499',
  subtle: '#7f8ba0',
  icon: '#617087',
  primary: '#2878dc',
  'primary-hover': '#196bcf',
  'on-primary': '#ffffff',
  accent: '#4b76ac',
  'accent-surface': '#eaf3ff',
  illustration: '#7aaeea',
  'illustration-surface': '#edf6ff',
  success: '#43bd83',
  error: '#b42318',
  'message-incoming': '#ffffff',
  'message-outgoing': '#dcecff',
  shadow: '#25354c',
};

export default {
  theme: {
    extend: {
      colors,
      boxShadow: {
        app: `0 12px 60px color-mix(in srgb, ${colors.shadow} 12%, transparent)`,
        primary: `0 5px 12px color-mix(in srgb, ${colors.primary} 20%, transparent)`,
      },
      backgroundImage: {
        conversation: `radial-gradient(circle at 50% 35%, ${colors.surface} 0, ${colors['conversation-start']} 45%, ${colors['conversation-end']} 100%)`,
      },
    },
  },
} satisfies Config;
