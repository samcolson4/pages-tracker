import { useState, useEffect } from 'react'
import { collection, doc, setDoc, deleteDoc, onSnapshot, DocumentSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { COLLECTION_NAME, YEAR } from '../constants'
import { getRandomColor } from '../utils/colorUtils'

export const useReadDays = () => {
  const [readDays, setReadDays] = useState<Map<string, string>>(new Map())
  const [loading, setLoading] = useState(true)

  // Load from Firestore on mount and listen for changes
  useEffect(() => {
    const readDaysRef = collection(db, COLLECTION_NAME)
    const docRef = doc(readDaysRef, String(YEAR))

    // Set up real-time listener
    const unsubscribe = onSnapshot(docRef, (docSnapshot: DocumentSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data()
        // Convert array of {date, color} objects to Map
        const daysMap = new Map<string, string>()
        if (data.days && Array.isArray(data.days)) {
          data.days.forEach((day: { date: string; color: string }) => {
            daysMap.set(day.date, day.color)
          })
        }
        setReadDays(daysMap)
      } else {
        setReadDays(new Map())
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
      const readDaysRef = collection(db, COLLECTION_NAME)
      const docRef = doc(readDaysRef, String(YEAR))

      // Use current local state instead of reading from Firestore
      // The real-time listener keeps it in sync, so it's more reliable
      const currentDays = new Map(readDays)

      // Toggle the day
      const nextDays = new Map(currentDays)
      if (nextDays.has(dateKey)) {
        // Remove the day
        nextDays.delete(dateKey)
      } else {
        // Add the day with a random color
        nextDays.set(dateKey, getRandomColor())
      }

      // Save to Firestore or delete if empty
      if (nextDays.size === 0) {
        // Delete the document if no days are selected
        await deleteDoc(docRef)
      } else {
        // Convert Map to array of {date, color} objects
        const daysArray = Array.from(nextDays.entries()).map(([date, color]) => ({
          date,
          color
        }))

        // Update the document with the new days array
        await setDoc(docRef, {
          days: daysArray,
          updatedAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error toggling day:', error)
    }
  }

  return { readDays, loading, toggleDay }
}
