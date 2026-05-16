import type { GymKey } from '../data/plan'

// Storage layout (v2 = gym scoped):
//   ppl_w{week}_{day}_{exId}_s{set}_{field}__{gym}
//
// We still read the un-suffixed legacy keys (v1) as a fallback so historical
// data logged before gym tabs existed continues to show up.

function suffix(gym: GymKey) {
  return `__${gym}`
}

export function setKey(week: number, day: string, exId: string, set: number, field: string, value: string, gym: GymKey) {
  localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}${suffix(gym)}`, value)
}

export function getKey(week: number, day: string, exId: string, set: number, field: string, gym: GymKey): string {
  const scoped = localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}${suffix(gym)}`)
  if (scoped !== null) return scoped
  // legacy fallback for data logged before gym tabs existed
  return localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`) || ''
}

export function setDoneKey(week: number, day: string, exId: string, set: number, value: boolean, gym: GymKey) {
  localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${set}_done${suffix(gym)}`, value ? '1' : '0')
}

export function getDoneKey(week: number, day: string, exId: string, set: number, gym: GymKey): boolean {
  const scoped = localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_done${suffix(gym)}`)
  if (scoped !== null) return scoped === '1'
  return localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_done`) === '1'
}

export function getNotesKey(week: number, day: string, gym: GymKey): string {
  const scoped = localStorage.getItem(`ppl_w${week}_${day}_notes${suffix(gym)}`)
  if (scoped !== null) return scoped
  return localStorage.getItem(`ppl_w${week}_${day}_notes`) || ''
}

export function setNotesKey(week: number, day: string, value: string, gym: GymKey) {
  localStorage.setItem(`ppl_w${week}_${day}_notes${suffix(gym)}`, value)
}

// "Last weight you used for this exact set position" — used for the prev / suggestion column.
export function getPrevWeight(day: string, exId: string, set: number, currentWeek: number, gym: GymKey): { week: number; weight: number } | null {
  for (let w = currentWeek - 1; w >= Math.max(1, currentWeek - 8); w--) {
    // try gym-scoped first
    let val = localStorage.getItem(`ppl_w${w}_${day}_${exId}_s${set}_w${suffix(gym)}`)
    if (!val) val = localStorage.getItem(`ppl_w${w}_${day}_${exId}_s${set}_w`)
    if (val) return { week: w, weight: parseFloat(val) }
  }
  return null
}
