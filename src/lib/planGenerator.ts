import type { Exercise, PlanMap, DayPlan } from '../data/plan'
import type { Profile, Goal, Experience } from '../hooks/useProfile'
import { EXERCISE_POOL, type ExerciseCategory, type ExerciseDef } from '../data/exercises'

export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Arms' | 'Upper' | 'Lower' | 'FullBody'

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = typeof DAY_KEYS[number]

// A "slot" is one exercise pulled from a category, with goal-tuned reps and a
// tier preference for picking the actual movement.
type Slot = {
  category: ExerciseCategory
  isMain: boolean   // main compounds get higher sets / lower reps for strength
}

// Each workout type defines its compound and accessory slot list.
// The same list is used for phase A and phase B — but the generator picks
// different exercises from each pool for the two phases so weeks 1-4 vs
// 5-8 feel different.
const WORKOUT_BLUEPRINTS: Record<WorkoutType, { compounds: Slot[]; accessories: Slot[] }> = {
  Push: {
    compounds: [
      { category: 'chest_compound',   isMain: true },
      { category: 'shoulder_compound', isMain: true },
    ],
    accessories: [
      { category: 'chest_iso',     isMain: false },
      { category: 'shoulder_iso',  isMain: false },
      { category: 'chest_iso',     isMain: false },
      { category: 'tricep',        isMain: false },
      { category: 'tricep',        isMain: false },
    ],
  },
  Pull: {
    compounds: [
      { category: 'back_compound', isMain: true },
      { category: 'back_compound', isMain: true },
    ],
    accessories: [
      { category: 'back_iso',  isMain: false },
      { category: 'back_iso',  isMain: false },
      { category: 'rear_delt', isMain: false },
      { category: 'bicep',     isMain: false },
      { category: 'bicep',     isMain: false },
    ],
  },
  Legs: {
    compounds: [
      { category: 'legs_compound', isMain: true },
      { category: 'legs_compound', isMain: true },
    ],
    accessories: [
      { category: 'quad_iso',      isMain: false },
      { category: 'hamstring_iso', isMain: false },
      { category: 'glute_iso',     isMain: false },
      { category: 'calf',          isMain: false },
    ],
  },
  Arms: {
    compounds: [
      { category: 'bicep',  isMain: true },
      { category: 'tricep', isMain: true },
    ],
    accessories: [
      { category: 'bicep',  isMain: false },
      { category: 'bicep',  isMain: false },
      { category: 'tricep', isMain: false },
      { category: 'tricep', isMain: false },
    ],
  },
  Upper: {
    compounds: [
      { category: 'chest_compound', isMain: true },
      { category: 'back_compound',  isMain: true },
    ],
    accessories: [
      { category: 'shoulder_compound', isMain: false },
      { category: 'chest_iso',         isMain: false },
      { category: 'back_iso',          isMain: false },
      { category: 'bicep',             isMain: false },
      { category: 'tricep',            isMain: false },
    ],
  },
  Lower: {
    compounds: [
      { category: 'legs_compound', isMain: true },
      { category: 'legs_compound', isMain: true },
    ],
    accessories: [
      { category: 'quad_iso',      isMain: false },
      { category: 'hamstring_iso', isMain: false },
      { category: 'glute_iso',     isMain: false },
      { category: 'calf',          isMain: false },
    ],
  },
  FullBody: {
    compounds: [
      { category: 'legs_compound',  isMain: true },
      { category: 'chest_compound', isMain: true },
      { category: 'back_compound',  isMain: true },
    ],
    accessories: [
      { category: 'shoulder_iso', isMain: false },
      { category: 'bicep',        isMain: false },
      { category: 'tricep',       isMain: false },
    ],
  },
}

// Day-count → ordered list of workout types.
const SPLITS: Record<3 | 4 | 5 | 6, WorkoutType[]> = {
  3: ['Push', 'Pull', 'Legs'],
  4: ['Upper', 'Lower', 'Upper', 'Lower'],
  5: ['Push', 'Pull', 'Legs', 'Arms', 'Legs'],
  6: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs'],
}

// ---------- goal / experience tuning ----------

function repsForSlot(slot: Slot, goal: Goal): string {
  if (slot.isMain) {
    switch (goal) {
      case 'strength': return '4–6 reps'
      case 'size':     return '6–8 reps'
      case 'cut':      return '8–10 reps'
      case 'general':  return '5–8 reps'
    }
  }
  switch (goal) {
    case 'strength': return '6–8 reps'
    case 'size':     return '8–12 reps'
    case 'cut':      return '12–15 reps'
    case 'general':  return '10–12 reps'
  }
}

function setsForSlot(slot: Slot, experience: Experience): number {
  if (slot.isMain) {
    return experience === 'beginner' ? 3 : experience === 'advanced' ? 5 : 4
  }
  return experience === 'beginner' ? 2 : experience === 'advanced' ? 4 : 3
}

// How many accessories to actually keep from the blueprint list.
// Beginner: trim down so volume isn't crushing. Advanced: keep them all.
function accessoryCount(experience: Experience, blueprintLen: number): number {
  if (experience === 'beginner') return Math.min(3, blueprintLen)
  if (experience === 'advanced') return blueprintLen
  return Math.min(4, blueprintLen)
}

// Pick movements suited to experience tier with light fallback.
function pickForExperience(pool: ExerciseDef[], experience: Experience): ExerciseDef[] {
  const preferred = experience === 'beginner' ? ['basic', 'standard']
                  : experience === 'advanced' ? ['advanced', 'standard']
                  : ['standard', 'basic']
  const sorted = [...pool].sort((a, b) => {
    const ai = preferred.indexOf(a.tier ?? 'standard')
    const bi = preferred.indexOf(b.tier ?? 'standard')
    const av = ai === -1 ? 99 : ai
    const bv = bi === -1 ? 99 : bi
    return av - bv
  })
  return sorted
}

// Build phase A and phase B accessory lists. Phase B uses the next options
// from the same category pool so the user sees variation every 4 weeks.
function buildAccessories(slots: Slot[], experience: Experience, dayKey: string, goal: Goal): Exercise[][] {
  const keep = accessoryCount(experience, slots.length)
  const trimmed = slots.slice(0, keep)

  // Track category cursors per phase so repeated categories grab different movements.
  const cursors = { A: new Map<ExerciseCategory, number>(), B: new Map<ExerciseCategory, number>() }

  const buildPhase = (phase: 'A' | 'B'): Exercise[] => {
    return trimmed.map((slot, i) => {
      const sorted = pickForExperience(EXERCISE_POOL[slot.category], experience)
      const cursor = cursors[phase]
      const idx = cursor.get(slot.category) ?? (phase === 'A' ? 0 : 1)
      cursor.set(slot.category, idx + 1)
      const def = sorted[idx % sorted.length]
      return {
        id: `${dayKey}_${phase.toLowerCase()}_${slot.category}_${i}`,
        name: def.name,
        sets: setsForSlot(slot, experience),
        target: repsForSlot(slot, goal),
        note: def.note,
        machineType: def.machineType,
      }
    })
  }

  return [buildPhase('A'), buildPhase('B')]
}

function buildCompounds(slots: Slot[], experience: Experience, dayKey: string, goal: Goal): Exercise[] {
  const sortedByCat = new Map<ExerciseCategory, ExerciseDef[]>()
  return slots.map((slot, i) => {
    if (!sortedByCat.has(slot.category)) {
      sortedByCat.set(slot.category, pickForExperience(EXERCISE_POOL[slot.category], experience))
    }
    const pool = sortedByCat.get(slot.category)!
    // If the same category appears twice in compounds (rare), pick consecutive entries
    const sameCategoryCount = slots.slice(0, i).filter(s => s.category === slot.category).length
    const def = pool[sameCategoryCount % pool.length]
    return {
      id: `${dayKey}_c_${slot.category}_${i}`,
      name: def.name,
      sets: setsForSlot(slot, experience),
      target: repsForSlot(slot, goal),
      note: def.note,
      compound: true,
      machineType: def.machineType,
    }
  })
}

// ---------- main generator ----------

export type GeneratedPlan = {
  plan: PlanMap
  dayTypes: Record<string, WorkoutType>      // mon -> 'Push' etc
  trainingDays: string[]                     // ordered subset of DAY_KEYS
  restDays: string[]
}

// Order user-selected day keys by weekday so plan ordering feels natural.
function orderDays(selected: string[]): string[] {
  return DAY_KEYS.filter(d => selected.includes(d))
}

export function generatePlan(profile: Profile, selectedDays: string[]): GeneratedPlan {
  const days = orderDays(selectedDays).slice(0, profile.daysPerWeek)
  const split = SPLITS[profile.daysPerWeek]
  const dayTypes: Record<string, WorkoutType> = {}
  const plan: PlanMap = {}

  days.forEach((dayKey, idx) => {
    const workoutType = split[idx % split.length]
    dayTypes[dayKey] = workoutType
    const blueprint = WORKOUT_BLUEPRINTS[workoutType]

    const compounds = buildCompounds(blueprint.compounds, profile.experience, dayKey, profile.goal)
    const accessories = buildAccessories(blueprint.accessories, profile.experience, dayKey, profile.goal)

    const dayPlan: DayPlan = { compounds, accessories }
    plan[dayKey] = dayPlan
  })

  const restDays = DAY_KEYS.filter(d => !days.includes(d))

  return { plan, dayTypes, trainingDays: days, restDays }
}
