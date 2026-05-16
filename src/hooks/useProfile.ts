import { useEffect, useState } from 'react'
import type { GymKey } from '../data/plan'

export type Goal = 'size' | 'strength' | 'cut' | 'general'
export type Experience = 'beginner' | 'intermediate' | 'advanced'

export type Profile = {
  goal: Goal
  experience: Experience
  daysPerWeek: 3 | 4 | 5 | 6
  selectedDays: string[]   // e.g. ['mon','tue','wed','fri','sat']
  primaryGym: GymKey
  startedAt: string  // ISO date
  completed: boolean
}

const KEY = 'ppl_profile_v1'
const PROFILE_EVENT = 'ppl-profile-change'

function read(): Profile | null {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Profile
    // Migration: older profiles didn't have selectedDays. If it's missing or
    // empty, treat the profile as incomplete so the questionnaire re-opens
    // (with the user's previous answers pre-filled) to capture the new step.
    if (!Array.isArray(parsed.selectedDays) || parsed.selectedDays.length === 0) {
      parsed.selectedDays = []
      parsed.completed = false
    }
    return parsed
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
    window.addEventListener(PROFILE_EVENT, handler)
    return () => {
      window.removeEventListener('storage', handler)
      window.removeEventListener(PROFILE_EVENT, handler)
    }
  }, [])

  const save = (p: Profile) => {
    localStorage.setItem(KEY, JSON.stringify(p))
    setProfile(p)
    window.dispatchEvent(new Event(PROFILE_EVENT))
  }

  const reset = () => {
    localStorage.removeItem(KEY)
    setProfile(null)
    window.dispatchEvent(new Event(PROFILE_EVENT))
  }

  return { profile, save, reset }
}
