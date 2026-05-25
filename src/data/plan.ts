// The hardcoded PPL plan is gone. All plans are generated from the user's
// questionnaire answers (see src/lib/planGenerator.ts).
//
// machineType:
//   'machine'  - selectorized / cable machine. The user's `machineLabel`
//                profile setting decides whether the log unit is 'pin' or 'kg'.
//   undefined  - free weight (barbell / dumbbell / bodyweight). Always kg.

import type { MachineLabel } from '../hooks/useProfile'

export type MachineType = 'machine'

export type Exercise = {
  id: string
  name: string
  sets: number
  target: string
  note?: string
  compound?: boolean
  machineType?: MachineType
  /** True if this is a finisher exercise (core/calf addon, displayed in its own section). */
  finisher?: 'core' | 'calf'
}

export type DayPlan = {
  compounds: Exercise[]
  accessories: Exercise[][]   // [Phase A list, Phase B list]
  finisher?: Exercise[]       // optional finisher (same every phase)
  // If set, the day is a custom user-built plan and the UI renders this single
  // list under one "Exercises" header instead of the compounds/accessories split.
  flat?: Exercise[]
}

export type PlanMap = Record<string, DayPlan>

export const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

// 4-week phases — accessories swap between Pool A and Pool B each phase.
export function getPhase(week: number) {
  return Math.floor((week - 1) / 4)
}

export function getPhaseLabel(week: number) {
  return `Phase ${getPhase(week) + 1}`
}

export function getAccessoryIndex(week: number) {
  return getPhase(week) % 2
}

export function getSections(dayKey: string, week: number, plan: PlanMap | null) {
  if (!plan) return []
  const d = plan[dayKey]
  if (!d) return []

  // Custom user-built plan: just one flat section, no phase rotation.
  if (d.flat) {
    return [{ label: 'Exercises', exercises: d.flat, rotates: false }]
  }

  const accIdx = getAccessoryIndex(week)
  const sections: { label: string; exercises: Exercise[]; rotates: boolean }[] = []
  if (d.compounds.length > 0) {
    sections.push({ label: 'Compounds', exercises: d.compounds, rotates: false })
  }
  const accList = d.accessories[accIdx] ?? []
  if (accList.length > 0) {
    sections.push({
      label: `Accessories · Phase ${getPhase(week) + 1}`,
      exercises: accList,
      rotates: true,
    })
  }
  if (d.finisher && d.finisher.length > 0) {
    const isCore = d.finisher[0].finisher === 'core'
    sections.push({
      label: isCore ? 'Core Finisher (~15 min)' : 'Calf Finisher (~15 min)',
      exercises: d.finisher,
      rotates: false,
    })
  }
  return sections
}

// Parse the top of a rep range from "10–15 reps" / "5 reps" / "45–60 sec" / "12 reps/leg".
export function getTopReps(target: string): number | null {
  const nums = target.match(/\d+/g)
  if (!nums || nums.length === 0) return null
  return Math.max(...nums.slice(0, 2).map(Number))
}

// Step amount for graduating to the next weight when double-progression clears.
// Pin-labelled machines step +1 pin; everything else (free weights AND kg-labelled
// machines) steps +2.5 kg.
export function getIncrement(ex: Exercise, machineLabel: MachineLabel): number {
  if (ex.machineType === 'machine' && machineLabel === 'pin') return 1
  return 2.5
}

// Unit caption for an exercise given the user's machineLabel setting.
export function getUnitLabel(ex: Exercise, machineLabel: MachineLabel): string {
  if (ex.machineType === 'machine' && machineLabel === 'pin') return 'pin'
  return 'kg'
}
