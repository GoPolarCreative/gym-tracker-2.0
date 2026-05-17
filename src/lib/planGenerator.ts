import type { Exercise, PlanMap, DayPlan } from '../data/plan'
import type { Profile, Experience } from '../hooks/useProfile'
import {
  EXERCISE_POOL,
  CORE_FINISHER, CALF_FINISHER,
  type ExerciseCategory, type ExerciseDef,
} from '../data/exercises'

// ----- workout types -----

export type WorkoutType =
  | 'Full Body'
  | 'Upper' | 'Lower'
  | 'Push' | 'Pull' | 'Legs (Quad)' | 'Arms' | 'Legs (Ham)'
  | 'Push A' | 'Pull A' | 'Legs A' | 'Push B' | 'Pull B' | 'Legs B'

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const

// ----- slot definitions (categories + which pool/phase variant) -----

type CompoundSlot = {
  category: ExerciseCategory
  /** Force a specific exercise name (e.g. Pull-Ups not Deadlift). Optional. */
  preferred?: string
}

type AccessorySlot = {
  category: ExerciseCategory
  /** Phase B can use the higher end of the rep range for variety. */
  highRep?: boolean
}

type SessionTemplate = {
  type: WorkoutType
  compounds: CompoundSlot[]
  accessoriesA: AccessorySlot[]
  accessoriesB: AccessorySlot[]
  /** Which finisher (if user enabled it) attaches to this session. */
  finisher?: 'core' | 'calf'
}

// All rules collected at the top so they're easy to find/tune.
const SETS_COMPOUND = 4
const SETS_ACCESSORY = 3
const REPS_COMPOUND = '4–6 reps'
const REPS_ACCESSORY = '10–15 reps'
const REPS_ACCESSORY_HIGH = '12–15 reps'  // Phase B / 6-day B sessions
const MAX_ACCESSORIES = 4

// ----- templates per session type -----

const FULL_BODY: SessionTemplate = {
  type: 'Full Body',
  compounds: [
    { category: 'legs_compound_quad', preferred: 'Barbell Back Squat' },
    { category: 'chest_compound',     preferred: 'Barbell Bench Press' },
  ],
  accessoriesA: [
    { category: 'back_iso' },
    { category: 'shoulder_iso' },
    { category: 'bicep' },
    { category: 'tricep' },
  ],
  accessoriesB: [
    { category: 'back_compound' },
    { category: 'rear_delt' },
    { category: 'hamstring_iso' },
    { category: 'tricep' },
  ],
}

const UPPER_A: SessionTemplate = {
  type: 'Upper',
  compounds: [
    { category: 'chest_compound',    preferred: 'Barbell Bench Press' },
    { category: 'back_compound',     preferred: 'Bent Over Barbell Row' },
  ],
  accessoriesA: [
    { category: 'shoulder_iso' },
    { category: 'chest_iso' },
    { category: 'bicep' },
    { category: 'tricep' },
  ],
  accessoriesB: [
    { category: 'shoulder_compound' },
    { category: 'back_iso' },
    { category: 'bicep' },
    { category: 'tricep' },
  ],
}

const LOWER_A: SessionTemplate = {
  type: 'Lower',
  compounds: [
    { category: 'legs_compound_quad', preferred: 'Barbell Back Squat' },
    { category: 'legs_compound_ham',  preferred: 'Romanian Deadlift' },
  ],
  accessoriesA: [
    { category: 'quad_iso' },
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'calf' },
  ],
  accessoriesB: [
    { category: 'quad_iso' },
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'calf' },
  ],
}

const UPPER_B: SessionTemplate = {
  type: 'Upper',
  compounds: [
    { category: 'shoulder_compound', preferred: 'Overhead Press' },
    { category: 'back_compound',     preferred: 'Pull-Ups' },
  ],
  accessoriesA: [
    { category: 'chest_iso' },
    { category: 'back_iso' },
    { category: 'rear_delt' },
    { category: 'tricep' },
  ],
  accessoriesB: [
    { category: 'chest_compound' },
    { category: 'back_iso' },
    { category: 'rear_delt' },
    { category: 'bicep' },
  ],
}

const LOWER_B: SessionTemplate = {
  type: 'Lower',
  compounds: [
    { category: 'legs_compound_quad', preferred: 'Hack Squat' },
    { category: 'legs_compound_ham',  preferred: 'Bulgarian Split Squat' },
  ],
  accessoriesA: [
    { category: 'quad_iso' },
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'calf' },
  ],
  accessoriesB: [
    { category: 'quad_iso' },
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'calf' },
  ],
}

const PUSH: SessionTemplate = {
  type: 'Push',
  compounds: [
    { category: 'chest_compound',    preferred: 'Barbell Bench Press' },
    { category: 'shoulder_compound', preferred: 'Overhead Press' },
  ],
  accessoriesA: [
    { category: 'chest_iso' },
    { category: 'shoulder_iso' },
    { category: 'tricep' },
    { category: 'tricep' },
  ],
  accessoriesB: [
    { category: 'chest_iso' },
    { category: 'rear_delt' },
    { category: 'tricep' },
    { category: 'tricep' },
  ],
  finisher: 'core',  // 5-day default core target
}

const PULL: SessionTemplate = {
  type: 'Pull',
  compounds: [
    { category: 'back_compound', preferred: 'Deadlift' },
    { category: 'back_compound', preferred: 'Pull-Ups' },
  ],
  accessoriesA: [
    { category: 'back_iso' },
    { category: 'rear_delt' },
    { category: 'bicep' },
    { category: 'bicep' },
  ],
  accessoriesB: [
    { category: 'back_iso' },
    { category: 'rear_delt' },
    { category: 'bicep' },
    { category: 'bicep' },
  ],
}

const LEGS_QUAD: SessionTemplate = {
  type: 'Legs (Quad)',
  compounds: [
    { category: 'legs_compound_quad', preferred: 'Barbell Back Squat' },
    { category: 'legs_compound_quad', preferred: 'Walking Lunges' },
  ],
  accessoriesA: [
    { category: 'quad_iso' },
    { category: 'quad_iso' },
    { category: 'calf' },
    { category: 'calf' },
  ],
  accessoriesB: [
    { category: 'quad_iso' },
    { category: 'glute_iso' },
    { category: 'calf' },
    { category: 'calf' },
  ],
  finisher: 'calf',
}

const ARMS: SessionTemplate = {
  type: 'Arms',
  compounds: [],   // arms day has no compounds per spec
  accessoriesA: [
    { category: 'bicep' },
    { category: 'tricep' },
    { category: 'bicep' },
    { category: 'tricep' },
  ],
  accessoriesB: [
    { category: 'bicep' },
    { category: 'tricep' },
    { category: 'bicep' },
    { category: 'tricep' },
  ],
}

const LEGS_HAM: SessionTemplate = {
  type: 'Legs (Ham)',
  compounds: [
    { category: 'legs_compound_ham', preferred: 'Romanian Deadlift' },
    { category: 'legs_compound_ham', preferred: 'Bulgarian Split Squat' },
  ],
  accessoriesA: [
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'hamstring_iso' },
    { category: 'calf' },
  ],
  accessoriesB: [
    { category: 'hamstring_iso' },
    { category: 'glute_iso' },
    { category: 'hamstring_iso' },
    { category: 'calf' },
  ],
}

// 6-day uses A/B variants for variety.
const PUSH_A: SessionTemplate = { ...PUSH, type: 'Push A' }
const PULL_A: SessionTemplate = { ...PULL, type: 'Pull A' }
const LEGS_A: SessionTemplate = { ...LEGS_QUAD, type: 'Legs A' }
const PUSH_B: SessionTemplate = {
  type: 'Push B',
  compounds: [
    { category: 'chest_compound',    preferred: 'Incline Barbell Bench' },
    { category: 'shoulder_compound', preferred: 'Seated DB Shoulder Press' },
  ],
  accessoriesA: PUSH.accessoriesB.map(s => ({ ...s, highRep: true })),
  accessoriesB: PUSH.accessoriesA.map(s => ({ ...s, highRep: true })),
}
const PULL_B: SessionTemplate = {
  type: 'Pull B',
  compounds: [
    { category: 'back_compound', preferred: 'T-Bar Row' },
    { category: 'back_compound', preferred: 'Pull-Ups' },
  ],
  accessoriesA: PULL.accessoriesB.map(s => ({ ...s, highRep: true })),
  accessoriesB: PULL.accessoriesA.map(s => ({ ...s, highRep: true })),
}
const LEGS_B: SessionTemplate = {
  type: 'Legs B',
  compounds: [
    { category: 'legs_compound_quad', preferred: 'Hack Squat' },
    { category: 'legs_compound_ham',  preferred: 'Romanian Deadlift' },
  ],
  accessoriesA: LEGS_HAM.accessoriesA.map(s => ({ ...s, highRep: true })),
  accessoriesB: LEGS_HAM.accessoriesB.map(s => ({ ...s, highRep: true })),
  finisher: 'calf',
}

// ----- split = ordered list of session templates -----

const SPLITS: Record<3 | 4 | 5 | 6, SessionTemplate[]> = {
  3: [
    { ...FULL_BODY, finisher: 'core' },
    { ...FULL_BODY, finisher: 'calf' },
    FULL_BODY,
  ],
  4: [UPPER_A, { ...LOWER_A, finisher: 'calf' }, { ...UPPER_B, finisher: 'core' }, LOWER_B],
  5: [PUSH, PULL, LEGS_QUAD, { ...ARMS, finisher: 'core' }, LEGS_HAM],
  6: [PUSH_A, PULL_A, LEGS_A, { ...PUSH_B, finisher: 'core' }, PULL_B, LEGS_B],
}

// ----- helpers: experience-aware exercise picking -----

function sortByExperience(pool: ExerciseDef[], experience: Experience): ExerciseDef[] {
  const order = experience === 'beginner' ? ['basic', 'standard']
              : experience === 'advanced' ? ['advanced', 'standard']
              : ['standard', 'basic']
  return [...pool].sort((a, b) => {
    const ai = order.indexOf(a.tier ?? 'standard')
    const bi = order.indexOf(b.tier ?? 'standard')
    const av = ai === -1 ? 99 : ai
    const bv = bi === -1 ? 99 : bi
    return av - bv
  })
}

function findPreferred(pool: ExerciseDef[], name: string): ExerciseDef | null {
  return pool.find(e => e.name === name) ?? null
}

// Order user-selected day keys by weekday (mon, tue, ...).
function orderDays(selected: string[]): string[] {
  return DAY_KEYS.filter(d => selected.includes(d))
}

// ----- build a single session -----

function buildCompounds(slots: CompoundSlot[], experience: Experience, dayKey: string): Exercise[] {
  return slots.map((slot, i) => {
    const pool = EXERCISE_POOL[slot.category]
    const preferred = slot.preferred ? findPreferred(pool, slot.preferred) : null
    const def = preferred ?? sortByExperience(pool, experience)[0]
    return {
      id: `${dayKey}_c${i}_${slot.category}`,
      name: def.name,
      sets: SETS_COMPOUND,
      target: REPS_COMPOUND,
      note: def.note,
      compound: true,
      machineType: def.machineType,
    }
  })
}

function buildAccessoriesForPhase(
  slots: AccessorySlot[],
  experience: Experience,
  dayKey: string,
  phaseTag: 'a' | 'b',
): Exercise[] {
  const trimmed = slots.slice(0, MAX_ACCESSORIES)
  const cursor = new Map<ExerciseCategory, number>()

  return trimmed.map((slot, i) => {
    const sorted = sortByExperience(EXERCISE_POOL[slot.category], experience)
    // Phase B starts at a different offset so the user actually sees variety.
    const baseOffset = phaseTag === 'a' ? 0 : 1
    const idx = (cursor.get(slot.category) ?? baseOffset) % sorted.length
    cursor.set(slot.category, idx + 1)
    const def = sorted[idx]
    return {
      id: `${dayKey}_${phaseTag}${i}_${slot.category}`,
      name: def.name,
      sets: SETS_ACCESSORY,
      target: slot.highRep ? REPS_ACCESSORY_HIGH : REPS_ACCESSORY,
      note: def.note,
      machineType: def.machineType,
    }
  })
}

function buildFinisher(
  kind: 'core' | 'calf' | undefined,
  enabled: { core: boolean; calf: boolean },
  dayKey: string,
): Exercise[] | undefined {
  if (!kind) return undefined
  if (kind === 'core' && !enabled.core) return undefined
  if (kind === 'calf' && !enabled.calf) return undefined

  const defs = kind === 'core' ? CORE_FINISHER : CALF_FINISHER
  return defs.map((f, i) => ({
    id: `${dayKey}_f_${kind}_${i}`,
    name: f.name,
    sets: f.sets,
    target: f.target,
    note: f.note,
    machineType: f.machineType,
    finisher: kind,
  }))
}

// ----- main entrypoint -----

export type GeneratedPlan = {
  plan: PlanMap
  dayTypes: Record<string, WorkoutType>
  trainingDays: string[]
  restDays: string[]
}

export function generatePlan(profile: Profile, selectedDays: string[]): GeneratedPlan {
  const days = orderDays(selectedDays).slice(0, profile.daysPerWeek)
  const split = SPLITS[profile.daysPerWeek]
  const finisherEnabled = { core: profile.coreFinisher, calf: profile.calfFinisher }

  const dayTypes: Record<string, WorkoutType> = {}
  const plan: PlanMap = {}

  days.forEach((dayKey, idx) => {
    const template = split[idx % split.length]
    dayTypes[dayKey] = template.type

    const compounds = buildCompounds(template.compounds, profile.experience, dayKey)
    const accessories = [
      buildAccessoriesForPhase(template.accessoriesA, profile.experience, dayKey, 'a'),
      buildAccessoriesForPhase(template.accessoriesB, profile.experience, dayKey, 'b'),
    ]
    const finisher = buildFinisher(template.finisher, finisherEnabled, dayKey)

    const dayPlan: DayPlan = { compounds, accessories }
    if (finisher) dayPlan.finisher = finisher
    plan[dayKey] = dayPlan
  })

  const restDays = DAY_KEYS.filter(d => !days.includes(d))
  return { plan, dayTypes, trainingDays: days, restDays }
}
