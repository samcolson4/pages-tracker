import type { DayData } from '../types'
import { YEAR } from '../constants'

/**
 * Generate calendar data for a year
 */
export const generateCalendar = (year: number = YEAR): DayData[][] => {
  const months: DayData[][] = []
  const startDate = new Date(year, 0, 1) // January 1st
  const endDate = new Date(year, 11, 31) // December 31st

  let currentDate = new Date(startDate)

  while (currentDate <= endDate) {
    const monthDays: DayData[] = []
    const month = currentDate.getMonth()

    // Get first day of month
    const firstDay = new Date(currentDate.getFullYear(), month, 1)
    const lastDay = new Date(currentDate.getFullYear(), month + 1, 0)

    // Add empty cells for days before the first day of the month
    const firstDayOfWeek = firstDay.getDay()
    for (let i = 0; i < firstDayOfWeek; i++) {
      monthDays.push({ date: new Date(0), read: false })
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), month, day)
      monthDays.push({ date, read: false })
    }

    months.push(monthDays)

    // Move to next month
    currentDate = new Date(currentDate.getFullYear(), month + 1, 1)
  }

  return months
}
