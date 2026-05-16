import { useEffect, useState } from 'react'
import type { PlanMap } from '../data/plan'
import { generatePlan, type GeneratedPlan, type WorkoutType } from '../lib/planGenerator'
import type { Profile } from './useProfile'

const PLAN_KEY = 'ppl_user_plan_v1'
const PLAN_EVENT = 'ppl-plan-change'

type StoredPlan = {
  plan: PlanMap
  dayTypes: Record<string, WorkoutType>
  trainingDays: string[]
  restDays: string[]
}

function read(): StoredPlan | null {
  const raw = localStorage.getItem(PLAN_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as StoredPlan
  } catch {
    return null
  }
}

function write(p: GeneratedPlan) {
  localStorage.setItem(PLAN_KEY, JSON.stringify(p))
  window.dispatchEvent(new Event(PLAN_EVENT))
}

export function useUserPlan(): {
  userPlan: StoredPlan | null
  regenerate: (profile: Profile) => StoredPlan
  clear: () => void
} {
  const [userPlan, setUserPlan] = useState<StoredPlan | null>(read)

  useEffect(() => {
    const handler = () => setUserPlan(read())
    window.addEventListener(PLAN_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(PLAN_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const regenerate = (profile: Profile) => {
    const generated = generatePlan(profile, profile.selectedDays)
    write(generated)
    setUserPlan(generated)
    return generated
  }

  const clear = () => {
    localStorage.removeItem(PLAN_KEY)
    setUserPlan(null)
    window.dispatchEvent(new Event(PLAN_EVENT))
  }

  return { userPlan, regenerate, clear }
}

// Wipe every workout-set / notes localStorage key so the user starts fresh
// when they re-run the questionnaire.
export function wipeWorkoutData() {
  const keys: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith('ppl_w')) keys.push(k)
  }
  keys.forEach(k => localStorage.removeItem(k))
  localStorage.removeItem('ppl_totalWeeks')
}
