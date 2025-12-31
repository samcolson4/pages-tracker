import { useState, useEffect } from 'react'
import './App.css'

interface DayData {
  date: Date
  read: boolean
}

function App() {
  const [readDays, setReadDays] = useState<Set<string>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('readDays')
    if (saved) {
      setReadDays(new Set(JSON.parse(saved)))
    }
  }, [])

  // Save to localStorage whenever readDays changes
  useEffect(() => {
    localStorage.setItem('readDays', JSON.stringify(Array.from(readDays)))
  }, [readDays])

  const toggleDay = (dateKey: string) => {
    setReadDays(prev => {
      const next = new Set(prev)
      if (next.has(dateKey)) {
        next.delete(dateKey)
      } else {
        next.add(dateKey)
      }
      return next
    })
  }

  const generateCalendar = () => {
    const months: DayData[][] = []
    const startDate = new Date(2026, 0, 1) // January 1st, 2026
    const endDate = new Date(2026, 11, 31) // December 31st, 2026

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

  const formatDateKey = (date: Date): string => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const isDateValid = (date: Date): boolean => {
    return date.getTime() > 0
  }

  const months = generateCalendar()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December']

  return (
    <div className="app">
      <h1>Reading Tracker 2026</h1>
      <div className="calendar-container">
        {months.map((monthDays, monthIndex) => {
          const firstValidDay = monthDays.find(day => isDateValid(day.date))
          if (!firstValidDay) return null

          const monthName = monthNames[firstValidDay.date.getMonth()]

          return (
            <div key={monthIndex} className="month">
              <h2 className="month-title">{monthName}</h2>
              <div className="calendar-grid">
                {monthDays.map((day, dayIndex) => {
                  if (!isDateValid(day.date)) {
                    return <div key={dayIndex} className="day-empty"></div>
                  }

                  const dateKey = formatDateKey(day.date)
                  const isRead = readDays.has(dateKey)

                  return (
                    <div
                      key={dayIndex}
                      className={`day-dot ${isRead ? 'filled' : 'outlined'}`}
                      onClick={() => toggleDay(dateKey)}
                      title={day.date.toLocaleDateString()}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
