import { useEffect, useState } from 'react'

// Which "plan source" is currently driving the day tabs / DayPanel.
export type ActivePlan =
  | { source: 'questionnaire' }
  | { source: 'custom'; planId: string }
  | null

const KEY = 'ppl_active_plan_v1'
const EVENT = 'ppl-active-plan-change'

function read(): ActivePlan {
  const raw = localStorage.getItem(KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return parsed as ActivePlan
    return null
  } catch {
    return null
  }
}

function write(p: ActivePlan) {
  if (p === null) localStorage.removeItem(KEY)
  else localStorage.setItem(KEY, JSON.stringify(p))
  window.dispatchEvent(new Event(EVENT))
}

export function useActivePlan() {
  const [active, setActiveState] = useState<ActivePlan>(read)

  useEffect(() => {
    const handler = () => setActiveState(read())
    window.addEventListener(EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const setActive = (p: ActivePlan) => {
    write(p)
    setActiveState(p)
  }

  return { active, setActive }
}
