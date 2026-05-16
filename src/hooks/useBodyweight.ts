import { useEffect, useState } from 'react'

export type BodyEntry = {
  date: string   // YYYY-MM-DD
  weight: number // kg
  note?: string
}

const KEY = 'ppl_bodyweight_v1'

function read(): BodyEntry[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as BodyEntry[]
  } catch {
    return []
  }
}

function write(entries: BodyEntry[]) {
  // Always keep sorted ascending by date for charting.
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
  localStorage.setItem(KEY, JSON.stringify(sorted))
}

export function useBodyweight() {
  const [entries, setEntries] = useState<BodyEntry[]>(read)

  useEffect(() => {
    const handler = () => setEntries(read())
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const upsert = (entry: BodyEntry) => {
    const next = read().filter(e => e.date !== entry.date)
    next.push(entry)
    write(next)
    setEntries(read())
  }

  const remove = (date: string) => {
    const next = read().filter(e => e.date !== date)
    write(next)
    setEntries(read())
  }

  return { entries, upsert, remove }
}
