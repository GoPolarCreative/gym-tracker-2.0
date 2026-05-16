import { useEffect, useState } from 'react'
import type { GymKey } from '../data/plan'

const GYM_KEY = 'ppl_activeGym'
const GYM_EVENT = 'ppl-gym-change'

function readGym(): GymKey {
  const v = localStorage.getItem(GYM_KEY)
  return v === 'FC' ? 'FC' : 'Jetts'
}

// Tiny pub/sub so every mounted SetRow / panel updates when the user
// toggles gym from the WeekBar.
export function useGym(): [GymKey, (g: GymKey) => void] {
  const [gym, setGymState] = useState<GymKey>(readGym)

  useEffect(() => {
    const handler = () => setGymState(readGym())
    window.addEventListener(GYM_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(GYM_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const setGym = (g: GymKey) => {
    localStorage.setItem(GYM_KEY, g)
    setGymState(g)
    window.dispatchEvent(new Event(GYM_EVENT))
  }

  return [gym, setGym]
}
