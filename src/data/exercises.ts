// Single source of truth for every exercise the generator can pick from,
// plus swap alternatives for compounds and the optional finishers.
//
// machineType: 'machine' means it's a selectorized / cable machine. The
// per-user `machineLabel` setting in the profile decides whether the input
// is captioned 'pin' or 'kg'. Free weights have no machineType and always
// log in kg.

import type { MachineType } from './plan'

export type { MachineType }

export type ExerciseDef = {
  name: string
  compound?: boolean
  machineType?: MachineType
  note?: string
  tier?: 'basic' | 'standard' | 'advanced'
}

export type ExerciseCategory =
  | 'chest_compound' | 'chest_iso'
  | 'back_compound'  | 'back_iso'
  | 'legs_compound_quad' | 'legs_compound_ham'
  | 'quad_iso' | 'hamstring_iso' | 'glute_iso' | 'calf'
  | 'shoulder_compound' | 'shoulder_iso' | 'rear_delt'
  | 'bicep' | 'tricep'

// ---------- main exercise pool (categorised) ----------

export const EXERCISE_POOL: Record<ExerciseCategory, ExerciseDef[]> = {
  chest_compound: [
    { name: 'Barbell Bench Press',  compound: true, tier: 'standard', note: 'Rest 3 min between sets.' },
    { name: 'Incline Barbell Bench', compound: true, tier: 'standard' },
    { name: 'Dumbbell Bench Press',  compound: true, tier: 'basic' },
    { name: 'Incline DB Press',      compound: true, tier: 'basic' },
    { name: 'Machine Chest Press',   compound: true, machineType: 'machine', tier: 'basic' },
  ],
  chest_iso: [
    { name: 'Cable Fly',         machineType: 'machine', tier: 'standard' },
    { name: 'Pec Deck Machine',  machineType: 'machine', tier: 'basic' },
    { name: 'Incline DB Fly',    tier: 'standard' },
    { name: 'Decline DB Press',  tier: 'standard' },
  ],
  back_compound: [
    { name: 'Deadlift',                compound: true, tier: 'standard', note: 'Rest 3–4 min.' },
    { name: 'Pull-Ups',                compound: true, tier: 'standard', note: 'Full ROM, dead hang.' },
    { name: 'Bent Over Barbell Row',   compound: true, tier: 'standard', note: 'Overhand grip, row to waist.' },
    { name: 'T-Bar Row',               compound: true, tier: 'standard' },
  ],
  back_iso: [
    { name: 'Lat Pulldown',         machineType: 'machine', tier: 'basic' },
    { name: 'Seated Cable Row',     machineType: 'machine', tier: 'basic' },
    { name: 'Close Grip Pulldown',  machineType: 'machine', tier: 'standard' },
    { name: 'Single Arm DB Row',    tier: 'standard' },
    { name: 'Cable Pullover',       machineType: 'machine', tier: 'standard' },
  ],
  legs_compound_quad: [
    { name: 'Barbell Back Squat',  compound: true, tier: 'standard', note: 'Rest 3 min between sets.' },
    { name: 'Hack Squat',          compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Leg Press',           compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Walking Lunges',      compound: true, tier: 'standard', note: 'DB in each hand, full stride.' },
  ],
  legs_compound_ham: [
    { name: 'Romanian Deadlift',     compound: true, tier: 'standard', note: 'Hip hinge, feel the stretch.' },
    { name: 'Bulgarian Split Squat', compound: true, tier: 'advanced' },
    { name: 'Stiff Leg Deadlift',    compound: true, tier: 'standard' },
  ],
  quad_iso: [
    { name: 'Leg Extension',     machineType: 'machine', tier: 'basic' },
    { name: 'Sissy Squat',       tier: 'advanced' },
  ],
  hamstring_iso: [
    { name: 'Lying Leg Curl',        machineType: 'machine', tier: 'basic', note: '3 sec eccentric.' },
    { name: 'Seated Leg Curl',       machineType: 'machine', tier: 'basic' },
    { name: 'Nordic Hamstring Curl', tier: 'advanced' },
  ],
  glute_iso: [
    { name: 'Hip Abductor Machine', machineType: 'machine', tier: 'basic' },
    { name: 'Cable Kickback',       machineType: 'machine', tier: 'standard' },
    { name: 'Hip Thrust',           tier: 'standard' },
  ],
  calf: [
    { name: 'Standing Calf Raise', machineType: 'machine', tier: 'basic' },
    { name: 'Seated Calf Raise',   machineType: 'machine', tier: 'basic' },
  ],
  shoulder_compound: [
    { name: 'Overhead Press',           compound: true, tier: 'standard', note: 'Control the eccentric.' },
    { name: 'Seated DB Shoulder Press', compound: true, tier: 'basic' },
    { name: 'Arnold Press',             compound: true, tier: 'advanced' },
    { name: 'Machine Shoulder Press',   compound: true, machineType: 'machine', tier: 'basic' },
  ],
  shoulder_iso: [
    { name: 'Cable Lateral Raises',  machineType: 'machine', tier: 'standard' },
    { name: 'DB Lateral Raises',     tier: 'basic' },
    { name: 'Machine Lateral Raise', machineType: 'machine', tier: 'basic' },
  ],
  rear_delt: [
    { name: 'Face Pulls',        machineType: 'machine', tier: 'basic', note: 'Never skip — shoulder health.' },
    { name: 'Reverse Pec Deck',  machineType: 'machine', tier: 'basic' },
    { name: 'Rear Delt DB Fly',  tier: 'standard' },
  ],
  bicep: [
    { name: 'EZ Bar Curl',         tier: 'standard' },
    { name: 'Hammer Curls',        tier: 'basic' },
    { name: 'Cable Curl',          machineType: 'machine', tier: 'basic' },
    { name: 'Preacher Curl',       tier: 'standard' },
    { name: 'Incline DB Curl',     tier: 'standard' },
    { name: 'Concentration Curl',  tier: 'basic' },
  ],
  tricep: [
    { name: 'Tricep Rope Pushdowns',    machineType: 'machine', tier: 'basic' },
    { name: 'Tricep Pushdowns',         machineType: 'machine', tier: 'basic' },
    { name: 'Overhead DB Extension',    tier: 'basic' },
    { name: 'Skullcrushers',            tier: 'standard' },
    { name: 'Cable Overhead Extension', machineType: 'machine', tier: 'standard' },
    { name: 'Reverse Grip Pushdown',    machineType: 'machine', tier: 'standard' },
    { name: 'Tricep Dips',              tier: 'standard' },
  ],
}

// ---------- swap alternatives keyed by compound name ----------

export const SWAP_OPTIONS: Record<string, ExerciseDef[]> = {
  // PUSH
  'Barbell Bench Press': [
    { name: 'Dumbbell Bench Press', compound: true, tier: 'basic' },
    { name: 'Machine Chest Press',  compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Incline DB Press',     compound: true, tier: 'basic' },
  ],
  'Overhead Press': [
    { name: 'Seated DB Shoulder Press', compound: true, tier: 'basic' },
    { name: 'Machine Shoulder Press',   compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Arnold Press',             compound: true, tier: 'advanced' },
  ],

  // PULL
  'Deadlift': [
    { name: 'Romanian Deadlift',  compound: true, tier: 'standard' },
    { name: 'Trap Bar Deadlift',  compound: true, tier: 'standard' },
    { name: 'Cable Pull Through', compound: true, machineType: 'machine', tier: 'basic' },
  ],
  'Pull-Ups': [
    { name: 'Lat Pulldown',         compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Assisted Pull Up',     compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Close Grip Pulldown',  compound: true, machineType: 'machine', tier: 'standard' },
  ],
  'Bent Over Barbell Row': [
    { name: 'T-Bar Row',          compound: true, tier: 'standard' },
    { name: 'Seated Cable Row',   compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Single Arm DB Row',  compound: true, tier: 'standard' },
  ],

  // LEGS (Quad focus)
  'Barbell Back Squat': [
    { name: 'Hack Squat',     compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Leg Press',      compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Goblet Squat',   compound: true, tier: 'basic' },
  ],
  'Walking Lunges': [
    { name: 'Bulgarian Split Squat', compound: true, tier: 'advanced' },
    { name: 'Step Ups',              compound: true, tier: 'basic' },
    { name: 'Leg Press',             compound: true, machineType: 'machine', tier: 'basic' },
  ],

  // LEGS (Hamstring focus)
  'Romanian Deadlift': [
    { name: 'Lying Leg Curl',        compound: true, machineType: 'machine', tier: 'basic' },
    { name: 'Nordic Hamstring Curl', compound: true, tier: 'advanced' },
    { name: 'Stiff Leg Deadlift',    compound: true, tier: 'standard' },
  ],
  'Bulgarian Split Squat': [
    { name: 'Walking Lunges', compound: true, tier: 'standard' },
    { name: 'Step Ups',       compound: true, tier: 'basic' },
    { name: 'Hack Squat',     compound: true, machineType: 'machine', tier: 'basic' },
  ],
}

// ---------- finishers ----------

export type FinisherExercise = {
  name: string
  sets: number
  target: string
  machineType?: MachineType
  note?: string
}

export const CORE_FINISHER: FinisherExercise[] = [
  { name: 'Plank',              sets: 3, target: '45–60 sec' },
  { name: 'Cable Crunch',       sets: 3, target: '12–15 reps', machineType: 'machine', note: 'Or sub Decline Sit Up.' },
  { name: 'Hanging Leg Raise',  sets: 3, target: '10–15 reps', note: 'Or sub Ab Wheel rollouts.' },
]

export const CALF_FINISHER: FinisherExercise[] = [
  { name: 'Standing Calf Raise',    sets: 3, target: '15–20 reps',     machineType: 'machine' },
  { name: 'Seated Calf Raise',      sets: 3, target: '15–20 reps',     machineType: 'machine' },
  { name: 'Single Leg Calf Raise',  sets: 3, target: '12–15 reps/leg' },
]
