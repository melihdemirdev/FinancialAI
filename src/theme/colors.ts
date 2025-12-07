export const colors = {
  // Main background colors
  background: '#000000',
  cardBackground: '#0a0a0a',

  // Purple gradient colors
  purple: {
    primary: '#9333EA',    // Purple-600
    secondary: '#A855F7',  // Purple-500
    light: '#C084FC',      // Purple-400
    dark: '#7E22CE',       // Purple-700
    darker: '#6B21A8',     // Purple-800
  },

  // Accent colors
  accent: {
    cyan: '#06B6D4',
    pink: '#EC4899',
    green: '#10B981',
    red: '#EF4444',
  },

  // Status colors
  success: '#00ff9d',
  error: '#ff4757',
  warning: '#FCD34D',

  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',  // Gray-400
    tertiary: '#71717A',   // Gray-500
  },

  // Border colors
  border: {
    primary: 'rgba(147, 51, 234, 0.3)',
    secondary: 'rgba(255, 255, 255, 0.1)',
  },
};

export const gradients = {
  purple: ['#9333EA', '#EC4899', '#06B6D4'] as const,  // Purple, pink, cyan gradient
  purplePink: ['#9333EA', '#EC4899'] as const,
  purpleCyan: ['#9333EA', '#06B6D4'] as const,
  dark: ['#000000', '#0a0a0a', '#1a1a1a'] as const,
};
