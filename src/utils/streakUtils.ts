import { formatDateKey, normalizeDate, getYearStart, getYearEnd } from './dateUtils'
import { YEAR } from '../constants'

/**
 * Calculate current streak: count backwards from today, stop at first unclicked day
 */
export const calculateStreak = (
  readDays: Map<string, string>,
  year: number = YEAR
): number => {
  // Get today's date
  const today = normalizeDate(new Date())
  const startOfYear = getYearStart(year)

  // If today is before the year, no streak
  if (today < startOfYear) return 0

  // Start counting from today (or end of year if today is after)
  const endOfYear = getYearEnd(year)
  const startDate = today > endOfYear ? endOfYear : today
  const checkDate = normalizeDate(new Date(startDate))

  let streak = 0

  // Count backwards from today
  while (checkDate >= startOfYear) {
    const dateKey = formatDateKey(checkDate)

    // If this day is clicked, increment streak and continue
    if (readDays.has(dateKey)) {
      streak++
      // Move to previous day
      checkDate.setDate(checkDate.getDate() - 1)
      checkDate.setHours(0, 0, 0, 0)
    } else {
      // Stop counting when we hit a day that wasn't clicked (sad face)
      break
    }
  }

  return streak
}

/**
 * Check if a day is "missed" (not clicked and in the past)
 */
export const isMissedDay = (
  date: Date,
  readDays: Map<string, string>
): boolean => {
  const dateKey = formatDateKey(date)
  // Only show sad face if this day is not clicked
  if (readDays.has(dateKey)) return false

  // Check if the date is in the past (before today)
  const today = normalizeDate(new Date())
  const checkDate = normalizeDate(new Date(date))

  // Show sad face if date is in the past and not clicked
  return checkDate < today
}
