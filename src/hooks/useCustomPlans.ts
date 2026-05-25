import { useEffect, useState } from 'react'

export type CustomExercise = {
  id: string         // unique within the day
  name: string
  sets: number
  target: string     // e.g. "8-12 reps"
}

export type CustomDay = {
  id: string         // unique within the plan — also used as the storage day key
  name: string
  exercises: CustomExercise[]
}

export type CustomPlan = {
  id: string
  name: string
  days: CustomDay[]
  createdAt: string  // ISO
}

const KEY = 'ppl_custom_plans_v1'
const EVENT = 'ppl-custom-plans-change'

function read(): CustomPlan[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as CustomPlan[]) : []
  } catch {
    return []
  }
}

function write(list: CustomPlan[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function useCustomPlans() {
  const [plans, setPlans] = useState<CustomPlan[]>(read)

  useEffect(() => {
    const handler = () => setPlans(read())
    window.addEventListener(EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const save = (plan: CustomPlan) => {
    const next = read().filter(p => p.id !== plan.id)
    next.push(plan)
    write(next)
  }

  const remove = (id: string) => {
    write(read().filter(p => p.id !== id))
  }

  const getById = (id: string) => read().find(p => p.id === id) ?? null

  return { plans, save, remove, getById }
}

// short non-colliding ids; not a security boundary.
export function newId(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).slice(2, 10)}`
}
