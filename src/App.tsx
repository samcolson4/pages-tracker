import { useState, useEffect } from 'react'
import { collection, doc, getDoc, setDoc, deleteDoc, onSnapshot, DocumentSnapshot } from 'firebase/firestore'
import { db } from './firebase'
import './App.css'

interface DayData {
  date: Date
  read: boolean
}

function App() {
  const [readDays, setReadDays] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Load from Firestore on mount and listen for changes
  useEffect(() => {
    const readDaysRef = collection(db, 'readDays')
    const docRef = doc(readDaysRef, '2026') // Store all 2026 days in one document

    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        setReadDays(new Set(data.days || []))
      } else {
        setReadDays(new Set())
      }
      setLoading(false)
    }, (error: Error) => {
      console.error('Error loading read days:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const toggleDay = async (dateKey: string) => {
    try {
      const readDaysRef = collection(db, 'readDays')
      const docRef = doc(readDaysRef, '2026')

      // Get current document
      const docSnapshot = await getDoc(docRef)
      const currentDays = docSnapshot.exists()
        ? new Set(docSnapshot.data().days || [])
        : new Set<string>()

      // Toggle the day
      const nextDays = new Set(currentDays)
      if (nextDays.has(dateKey)) {
        nextDays.delete(dateKey)
      } else {
        nextDays.add(dateKey)
      }

      // Save to Firestore or delete if empty
      if (nextDays.size === 0) {
        // Delete the document if no days are selected
        await deleteDoc(docRef)
      } else {
        // Update the document with the new days array
        await setDoc(docRef, {
          days: Array.from(nextDays),
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error toggling day:', error)
    }
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
      <h1>Reading Tracker</h1>
      <h2 className="year-title">2026</h2>
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
