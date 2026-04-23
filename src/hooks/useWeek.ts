import { useState, useEffect } from 'react'

const TOTAL_KEY = 'ppl_totalWeeks'

export function useWeek() {
  const [totalWeeks, setTotalWeeks] = useState(() => {
    return parseInt(localStorage.getItem(TOTAL_KEY) || '1')
  })
  const [currentWeek, setCurrentWeek] = useState(totalWeeks)

  useEffect(() => {
    setCurrentWeek(totalWeeks)
  }, [])

  const goToPrev = () => {
    if (currentWeek > 1) setCurrentWeek(w => w - 1)
  }

  const goToNext = () => {
    if (currentWeek < totalWeeks) setCurrentWeek(w => w + 1)
  }

  const addNewWeek = () => {
    const next = totalWeeks + 1
    setTotalWeeks(next)
    setCurrentWeek(next)
    localStorage.setItem(TOTAL_KEY, String(next))
  }

  return { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek }
}
