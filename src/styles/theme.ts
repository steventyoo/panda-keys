// 🎨 Panda Keys — Kawaii Design System
// Inspired by Japanese kawaii aesthetics: soft, rounded, warm, playful but calm

export const colors = {
  // Core palette
  pink: '#FFB6C1',
  blush: '#FFDDE2',
  lavender: '#CDB4DB',
  cream: '#FFF8E7',
  sky: '#AEE1F9',
  mint: '#B8F2E6',

  // Deep variants
  pinkDeep: '#F48FB1',
  lavenderDeep: '#AB87C4',
  skyDeep: '#81D4FA',
  mintDeep: '#80CBC4',
  peach: '#FFE0B2',
  butter: '#FFF9C4',

  // Text
  textDark: '#5D4037',
  textMedium: '#8D6E63',
  textLight: '#A1887F',
  textAccent: '#9C5FC2',

  // UI
  white: '#FFFFFF',
  cardBg: '#FFFFFFCC',
  overlay: '#FFFFFF99',
  shadow: 'rgba(205, 180, 219, 0.3)',
  shadowDeep: 'rgba(205, 180, 219, 0.5)',
} as const;

export const gradients = {
  // Background
  garden: `linear-gradient(180deg, ${colors.sky}40 0%, ${colors.cream} 35%, ${colors.mint}30 65%, ${colors.mint}60 100%)`,
  // Buttons
  primary: `linear-gradient(135deg, ${colors.lavender}, ${colors.pink})`,
  secondary: `linear-gradient(135deg, ${colors.sky}, ${colors.mint})`,
  warm: `linear-gradient(135deg, ${colors.peach}, ${colors.pink})`,
  // Cards
  card: `linear-gradient(135deg, #FFFFFF, ${colors.cream})`,
  cardHover: `linear-gradient(135deg, ${colors.blush}40, ${colors.lavender}20)`,
} as const;

export const fonts = {
  heading: "'Fredoka', 'Nunito', system-ui, sans-serif",
  body: "'Nunito', system-ui, sans-serif",
  fun: "'Baloo 2', 'Fredoka', system-ui, sans-serif",
} as const;

export const radius = {
  sm: '12px',
  md: '18px',
  lg: '24px',
  xl: '32px',
  full: '9999px',
} as const;

// Common kawaii button style
export const kawaiiButton = (color: string = colors.lavender, bgGradient: string = gradients.primary) => ({
  background: bgGradient,
  color: colors.white,
  border: 'none',
  borderRadius: radius.xl,
  padding: '14px 36px',
  fontSize: '1.1rem',
  fontWeight: 700,
  fontFamily: fonts.heading,
  cursor: 'pointer',
  boxShadow: `0 4px 16px ${color}40`,
  letterSpacing: '0.5px',
}) as const;

// Common kawaii card style
export const kawaiiCard = (borderColor: string = colors.lavender) => ({
  background: colors.cardBg,
  borderRadius: radius.lg,
  border: `2.5px solid ${borderColor}40`,
  boxShadow: `0 4px 20px ${colors.shadow}`,
  backdropFilter: 'blur(8px)',
}) as const;
