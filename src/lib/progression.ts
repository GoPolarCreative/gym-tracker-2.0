import type { Exercise } from '../data/plan'
import type { MachineLabel } from '../hooks/useProfile'
import { getTopReps, getIncrement } from '../data/plan'

// Helper: read every set for an exercise on a given week. Returns null if
// any set is unlogged, since incomplete sessions shouldn't drive progression.
function readSession(week: number, day: string, ex: Exercise) {
  const sets: { weight: number; reps: number }[] = []
  for (let s = 1; s <= ex.sets; s++) {
    const wRaw =
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_w`) ||
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_w__Jetts`) ||
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_w__FC`)
    const rRaw =
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_r`) ||
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_r__Jetts`) ||
      localStorage.getItem(`ppl_w${week}_${day}_${ex.id}_s${s}_r__FC`)
    const weight = wRaw ? parseFloat(wRaw) : NaN
    const reps = rRaw ? parseInt(rRaw, 10) : NaN
    if (!Number.isFinite(weight) || !Number.isFinite(reps)) return null
    sets.push({ weight, reps })
  }
  return sets
}

function lastNSessions(currentWeek: number, day: string, ex: Exercise, n: number) {
  const out: { week: number; sets: { weight: number; reps: number }[] }[] = []
  for (let w = currentWeek - 1; w >= 1 && out.length < n; w--) {
    const sets = readSession(w, day, ex)
    if (sets) out.push({ week: w, sets })
  }
  return out
}

export type ProgressionAdvice =
  | { kind: 'first-session' }
  | { kind: 'one-more'; lastWeight: number; topReps: number }
  | { kind: 'hold'; lastWeight: number; topReps: number }
  | { kind: 'graduate'; nextWeight: number; lastWeight: number; topReps: number }

// Double-progression: must hit top of rep range on EVERY set in TWO consecutive
// sessions at the SAME working weight to graduate to the next weight.
export function getProgression(currentWeek: number, day: string, ex: Exercise, machineLabel: MachineLabel): ProgressionAdvice {
  const topReps = getTopReps(ex.target)
  const recent = lastNSessions(currentWeek, day, ex, 2)

  if (recent.length === 0) return { kind: 'first-session' }
  if (topReps === null) {
    const last = recent[0].sets[0]?.weight ?? 0
    return { kind: 'hold', lastWeight: last, topReps: 0 }
  }

  const workingWeight = (sets: { weight: number; reps: number }[]) =>
    sets.reduce((m, s) => Math.max(m, s.weight), 0)

  const allSetsHitTop = (sets: { weight: number; reps: number }[]) =>
    sets.length > 0 && sets.every(s => s.reps >= topReps)

  const newest = recent[0]
  const newestWW = workingWeight(newest.sets)
  const newestCleared = allSetsHitTop(newest.sets)

  if (recent.length === 1) {
    if (newestCleared) return { kind: 'one-more', lastWeight: newestWW, topReps }
    return { kind: 'hold', lastWeight: newestWW, topReps }
  }

  const prev = recent[1]
  const prevWW = workingWeight(prev.sets)
  const prevCleared = allSetsHitTop(prev.sets)

  if (newestCleared && prevCleared && Math.abs(newestWW - prevWW) < 0.01) {
    return {
      kind: 'graduate',
      nextWeight: +(newestWW + getIncrement(ex, machineLabel)).toFixed(2),
      lastWeight: newestWW,
      topReps,
    }
  }

  if (newestCleared) return { kind: 'one-more', lastWeight: newestWW, topReps }
  return { kind: 'hold', lastWeight: newestWW, topReps }
}
