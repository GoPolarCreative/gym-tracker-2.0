export function setKey(week: number, day: string, exId: string, set: number, field: string, value: string) {
  localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`, value)
}

export function getKey(week: number, day: string, exId: string, set: number, field: string): string {
  return localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`) || ''
}

export function getNotesKey(week: number, day: string): string {
  return localStorage.getItem(`ppl_w${week}_${day}_notes`) || ''
}

export function setNotesKey(week: number, day: string, value: string) {
  localStorage.setItem(`ppl_w${week}_${day}_notes`, value)
}

export function getPrevWeight(day: string, exId: string, set: number, currentWeek: number): { week: number; weight: number } | null {
  for (let w = currentWeek - 1; w >= Math.max(1, currentWeek - 8); w--) {
    const val = localStorage.getItem(`ppl_w${w}_${day}_${exId}_s${set}_w`)
    if (val && val !== '') return { week: w, weight: parseFloat(val) }
  }
  return null
}
