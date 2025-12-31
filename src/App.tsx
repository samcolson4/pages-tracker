import './App.css'
import { useReadDays } from './hooks/useReadDays'
import { generateCalendar } from './utils/calendarUtils'
import { formatDateKey, isDateValid } from './utils/dateUtils'
import { calculateStreak, isMissedDay } from './utils/streakUtils'
import { MONTH_NAMES, YEAR } from './constants'

function App() {
  const { readDays, loading, toggleDay } = useReadDays()
  const months = generateCalendar(YEAR)
  const streak = calculateStreak(readDays, YEAR)

  if (loading) {
    return (
      <div className="app">
        <h1>Reading Tracker</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="app">
      <h1>Reading Tracker 2026</h1>
      <div className="streak-counter">
        <span className="streak-label">Current Streak:</span>
        <span className="streak-number">{streak} {streak === 1 ? 'day' : 'days'}</span>
      </div>
      <div className="calendar-container">
        {months.map((monthDays, monthIndex) => {
          const firstValidDay = monthDays.find(day => isDateValid(day.date))
          if (!firstValidDay) return null

          const monthName = MONTH_NAMES[firstValidDay.date.getMonth()]

          return (
            <div key={monthIndex} className="month">
              <h2 className="month-title">{monthName}</h2>
              <div className="calendar-grid">
                {monthDays.map((day, dayIndex) => {
                  if (!isDateValid(day.date)) {
                    return <div key={dayIndex} className="day-empty"></div>
                  }

                  const dateKey = formatDateKey(day.date)
                  const dayColor = readDays.get(dateKey)
                  const isRead = dayColor !== undefined
                  const missed = isMissedDay(day.date, readDays)

                  return (
                    <div
                      key={dayIndex}
                      className={`day-dot ${isRead ? 'filled' : 'outlined'} ${missed ? 'missed' : ''}`}
                      style={isRead ? {
                        backgroundColor: dayColor,
                        borderColor: dayColor
                      } : undefined}
                      onClick={() => toggleDay(dateKey)}
                      title={day.date.toLocaleDateString()}
                    >
                      {missed && !isRead ? '😢' : ''}
                    </div>
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
