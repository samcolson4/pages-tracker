export const colors = {
  white: '#FAFAFA',      // Bright Snow
  red: '#F93943',        // Strawberry Red
  green: '#1C7C54',      // Turf Green
  brown: '#B2945B',      // Camel
  blue: '#197BBD',       // Bright Teal Blue
  mutedTeal: '#4A9D8F',  // Muted Teal
  dustyCoral: '#E76F73', // Dusty Coral
  slateBlue: '#5C7FA3', // Slate Blue
  charcoal: '#2E2E2E',  // Charcoal
  mustardGold: '#D4A72C', // Mustard Gold
  terracotta: '#C05A3D', // Terracotta
  sand: '#D8C8A3',      // Sand
} as const

export type ColorName = keyof typeof colors

// Helper function to get a color by name
export const getColor = (name: ColorName): string => colors[name]
