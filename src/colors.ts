export const colors = {
  white: '#FAFAFA',      // Bright Snow
  red: '#F93943',        // Strawberry Red
  green: '#1C7C54',      // Turf Green
  brown: '#B2945B',      // Camel
  blue: '#197BBD',       // Bright Teal Blue
} as const

export type ColorName = keyof typeof colors

// Helper function to get a color by name
export const getColor = (name: ColorName): string => colors[name]
