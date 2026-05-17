// Storage layout for a logged set:
//   ppl_w{week}_{day}_{exId}_s{set}_{field}
//
// Reads transparently fall back to legacy gym-suffixed keys (__Jetts / __FC)
// so data logged before the gym layer was removed still surfaces in History.

function legacyVariants(base: string): string[] {
  return [base, `${base}__Jetts`, `${base}__FC`]
}

function readFirst(base: string): string {
  for (const k of legacyVariants(base)) {
    const v = localStorage.getItem(k)
    if (v !== null && v !== '') return v
  }
  return ''
}

export function setKey(week: number, day: string, exId: string, set: number, field: string, value: string) {
  localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`, value)
}

export function getKey(week: number, day: string, exId: string, set: number, field: string): string {
  return readFirst(`ppl_w${week}_${day}_${exId}_s${set}_${field}`)
}

export function setDoneKey(week: number, day: string, exId: string, set: number, value: boolean) {
  localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${set}_done`, value ? '1' : '0')
}

export function getDoneKey(week: number, day: string, exId: string, set: number): boolean {
  return readFirst(`ppl_w${week}_${day}_${exId}_s${set}_done`) === '1'
}

export function getNotesKey(week: number, day: string): string {
  return readFirst(`ppl_w${week}_${day}_notes`)
}

export function setNotesKey(week: number, day: string, value: string) {
  localStorage.setItem(`ppl_w${week}_${day}_notes`, value)
}

// Most recent weight you used for this exercise+set position. Walks backward
// up to 8 weeks.
export function getPrevWeight(day: string, exId: string, set: number, currentWeek: number): { week: number; weight: number } | null {
  for (let w = currentWeek - 1; w >= Math.max(1, currentWeek - 8); w--) {
    const val = readFirst(`ppl_w${w}_${day}_${exId}_s${set}_w`)
    if (val) return { week: w, weight: parseFloat(val) }
  }
  return null
}
