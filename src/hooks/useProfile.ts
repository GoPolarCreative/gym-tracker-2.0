import { useEffect, useState } from 'react'
import type { GymKey } from '../data/plan'

export type Goal = 'size' | 'strength' | 'cut' | 'general'
export type Experience = 'beginner' | 'intermediate' | 'advanced'

export type Profile = {
  goal: Goal
  experience: Experience
  daysPerWeek: 3 | 4 | 5 | 6
  primaryGym: GymKey
  startedAt: string  // ISO date
  completed: boolean
}

const KEY = 'ppl_profile_v1'

function read(): Profile | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Profile
  } catch {
    return null
  }
}

export function useProfile(): {
  profile: Profile | null
  save: (p: Profile) => void
  reset: () => void
} {
  const [profile, setProfile] = useState<Profile | null>(read)

  useEffect(() => {
    const handler = () => setProfile(read())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const save = (p: Profile) => {
    localStorage.setItem(KEY, JSON.stringify(p))
    setProfile(p)
  }

  const reset = () => {
    localStorage.removeItem(KEY)
    setProfile(null)
  }

  return { profile, save, reset }
}
