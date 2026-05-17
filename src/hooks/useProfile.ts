import { useEffect, useState } from 'react'

export type Goal = 'build_muscle' | 'build_strength' | 'general'
export type Experience = 'beginner' | 'intermediate' | 'advanced'
export type MachineLabel = 'pin' | 'kg'

export type Profile = {
  daysPerWeek: 3 | 4 | 5 | 6
  goal: Goal
  experience: Experience
  machineLabel: MachineLabel
  coreFinisher: boolean
  calfFinisher: boolean
  selectedDays: string[]   // weekday keys: 'mon','tue',...,'sun'
  startedAt: string        // ISO date
  completed: boolean
}

const KEY = 'ppl_profile_v2'
const LEGACY_KEY = 'ppl_profile_v1'
const PROFILE_EVENT = 'ppl-profile-change'

function read(): Profile | null {
  // Try v2 first
  const raw = localStorage.getItem(KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Profile
      if (!Array.isArray(parsed.selectedDays)) parsed.selectedDays = []
      return parsed
    } catch {
      // fall through to legacy
    }
  }

  // Migrate from legacy v1 (had goal: 'size'|'strength'|'cut'|'general' and primaryGym).
  const legacy = localStorage.getItem(LEGACY_KEY)
  if (legacy) {
    try {
      const old = JSON.parse(legacy) as Record<string, unknown>
      const goalMap: Record<string, Goal> = {
        size: 'build_muscle',
        strength: 'build_strength',
        cut: 'build_muscle',
        general: 'general',
      }
      const profile: Profile = {
        daysPerWeek: (old.daysPerWeek as 3 | 4 | 5 | 6) ?? 5,
        goal: goalMap[(old.goal as string) ?? 'general'] ?? 'general',
        experience: (old.experience as Experience) ?? 'intermediate',
        machineLabel: (old.primaryGym === 'Jetts' ? 'pin' : 'kg'),
        coreFinisher: false,
        calfFinisher: false,
        selectedDays: Array.isArray(old.selectedDays) ? (old.selectedDays as string[]) : [],
        startedAt: (old.startedAt as string) ?? new Date().toISOString(),
        // Force re-onboarding so user fills in the new questions
        completed: false,
      }
      return profile
    } catch {
      return null
    }
  }

  return null
}

export function useProfile() {
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
    localStorage.removeItem(LEGACY_KEY)
    setProfile(null)
    window.dispatchEvent(new Event(PROFILE_EVENT))
  }

  return { profile, save, reset }
}

// Convenience: machineLabel with fallback.
export function getMachineLabel(profile: Profile | null): MachineLabel {
  return profile?.machineLabel ?? 'kg'
}
