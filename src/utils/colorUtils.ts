import { colors } from '../colors'
import { WHITE_COLOR } from '../constants'

/**
 * Get a random color from the palette (excluding white)
 */
export const getRandomColor = (): string => {
  const colorValues = Object.values(colors).filter(color => color !== WHITE_COLOR)
  const randomIndex = Math.floor(Math.random() * colorValues.length)
  return colorValues[randomIndex]
}
