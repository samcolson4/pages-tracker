/**
 * Format a date as YYYY-MM-DD string
 */
export const formatDateKey = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

/**
 * Check if a date is valid (not the epoch date placeholder)
 */
export const isDateValid = (date: Date): boolean => {
  return date.getTime() > 0
}

/**
 * Get a normalized date (time set to 00:00:00)
 */
export const normalizeDate = (date: Date): Date => {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

/**
 * Get the start of a year
 */
export const getYearStart = (year: number): Date => {
  return normalizeDate(new Date(year, 0, 1))
}

/**
 * Get the end of a year
 */
export const getYearEnd = (year: number): Date => {
  return normalizeDate(new Date(year, 11, 31))
}
