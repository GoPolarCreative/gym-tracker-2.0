import type { PlanMap, Exercise } from '../data/plan'
import type { CustomPlan } from '../hooks/useCustomPlans'

// Convert a user-built CustomPlan into the same PlanMap shape the rest of the
// app already uses, so DayPanel / progression / history all "just work".
export function customPlanToPlanMap(plan: CustomPlan): {
  plan: PlanMap
  dayKeys: string[]
  dayNames: Record<string, string>
} {
  const planMap: PlanMap = {}
  const dayNames: Record<string, string> = {}
  const dayKeys: string[] = []

  plan.days.forEach(day => {
    dayKeys.push(day.id)
    dayNames[day.id] = day.name
    const flat: Exercise[] = day.exercises.map(ex => ({
      id: ex.id,
      name: ex.name,
      sets: ex.sets,
      target: ex.target,
    }))
    planMap[day.id] = {
      compounds: [],
      accessories: [[], []],
      flat,
    }
  })

  return { plan: planMap, dayKeys, dayNames }
}
