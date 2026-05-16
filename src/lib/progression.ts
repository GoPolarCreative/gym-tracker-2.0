import type { Exercise, GymKey } from '../data/plan'
import { getTopReps, getIncrement } from '../data/plan'

// Read raw set log for an exercise on a given week, gym-scoped (with legacy fallback).
function readSession(week: number, day: string, ex: Exercise, gym: GymKey) {
  const sets: { weight: number; reps: number }[] = []
  for (let s = 1; s <= ex.sets; s++) {
    const wScoped = localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_w__${gym}`)
    const rScoped = localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_r__${gym}`)
    const wLegacy = localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_w`)
    const rLegacy = localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_r`)
    const wRaw = wScoped !== null && wScoped !== '' ? wScoped : wLegacy
    const rRaw = rScoped !== null && rScoped !== '' ? rScoped : rLegacy
    const weight = wRaw ? parseFloat(wRaw) : NaN
    const reps = rRaw ? parseInt(rRaw, 10) : NaN
    if (!Number.isFinite(weight) || !Number.isFinite(reps)) return null
    sets.push({ weight, reps })
  }
  // All sets must be logged for a session to count toward progression.
  return sets
}

// Walk backward from currentWeek-1 and return up to N completed sessions.
function lastNSessions(currentWeek: number, day: string, ex: Exercise, gym: GymKey, n: number) {
  const out: { week: number; sets: { weight: number; reps: number }[] }[] = []
  for (let w = currentWeek - 1; w >= 1 && out.length < n; w--) {
    const sets = readSession(w, day, ex, gym)
    if (sets) out.push({ week: w, sets })
  }
  return out
}

export type ProgressionAdvice =
  | { kind: 'first-session' }
  | { kind: 'one-more'; lastWeight: number; topReps: number }
  | { kind: 'hold'; lastWeight: number; topReps: number }
  | { kind: 'graduate'; nextWeight: number; lastWeight: number; topReps: number }

// Double-progression: must hit (or beat) top of rep range on EVERY set,
// in the TWO most recent sessions, at the same working weight, to graduate.
export function getProgression(currentWeek: number, day: string, ex: Exercise, gym: GymKey): ProgressionAdvice {
  const topReps = getTopReps(ex.target)
  const recent = lastNSessions(currentWeek, day, ex, gym, 2)

  if (recent.length === 0) return { kind: 'first-session' }
  if (topReps === null) {
    // Can't parse target — just show last weight, no smart suggestion.
    const last = recent[0].sets[0]?.weight ?? 0
    return { kind: 'hold', lastWeight: last, topReps: 0 }
  }

  // The "working weight" for a session = the most common weight across its sets
  // (ignoring drop sets or warm-ups). We approximate by taking the max set weight,
  // which matches how lifters think about "what weight did I use".
  const workingWeight = (sets: { weight: number; reps: number }[]) =>
    sets.reduce((m, s) => Math.max(m, s.weight), 0)

  const allSetsHitTop = (sets: { weight: number; reps: number }[]) =>
    sets.length > 0 && sets.every(s => s.reps >= topReps)

  const newest = recent[0]
  const newestWW = workingWeight(newest.sets)
  const newestCleared = allSetsHitTop(newest.sets)

  // Only one session of data
  if (recent.length === 1) {
    if (newestCleared) {
      return { kind: 'one-more', lastWeight: newestWW, topReps }
    }
    return { kind: 'hold', lastWeight: newestWW, topReps }
  }

  // Two sessions of data
  const prev = recent[1]
  const prevWW = workingWeight(prev.sets)
  const prevCleared = allSetsHitTop(prev.sets)

  // Both sessions cleared top of rep range AND used the same working weight → graduate
  if (newestCleared && prevCleared && Math.abs(newestWW - prevWW) < 0.01) {
    return {
      kind: 'graduate',
      nextWeight: +(newestWW + getIncrement(ex, gym)).toFixed(2),
      lastWeight: newestWW,
      topReps,
    }
  }

  // Most recent session cleared but the one before didn't → one more clean session needed
  if (newestCleared) {
    return { kind: 'one-more', lastWeight: newestWW, topReps }
  }

  return { kind: 'hold', lastWeight: newestWW, topReps }
}
