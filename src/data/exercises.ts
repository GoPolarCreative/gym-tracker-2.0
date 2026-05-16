import type { MachineType } from './plan'

// Categories the generator picks from when filling a workout slot.
export type ExerciseCategory =
  | 'chest_compound' | 'chest_iso'
  | 'back_compound'  | 'back_iso'
  | 'legs_compound'  | 'quad_iso' | 'hamstring_iso' | 'glute_iso' | 'calf'
  | 'shoulder_compound' | 'shoulder_iso' | 'rear_delt'
  | 'bicep' | 'tricep'

export type ExerciseDef = {
  name: string
  compound?: boolean
  machineType?: MachineType
  note?: string
  // Difficulty tier: 'basic' (beginner-friendly machines/dumbbells),
  // 'standard' (most lifters), 'advanced' (longer-tenured lifters).
  tier?: 'basic' | 'standard' | 'advanced'
}

// Each category has multiple options. The generator picks 1-2 for the main
// pool and another 1-2 for the rotating phase B pool so the plan still
// changes every 4 weeks.
export const EXERCISE_POOL: Record<ExerciseCategory, ExerciseDef[]> = {
  chest_compound: [
    { name: 'Barbell Bench Press',  compound: true, tier: 'standard', note: 'Main strength lift. Rest 3 min.' },
    { name: 'Incline Barbell Bench', compound: true, tier: 'standard' },
    { name: 'Dumbbell Bench Press',  compound: true, tier: 'basic' },
    { name: 'Incline DB Press',      compound: true, tier: 'basic' },
    { name: 'Machine Chest Press',   compound: true, machineType: 'pin', tier: 'basic' },
  ],
  chest_iso: [
    { name: 'Cable Fly',           machineType: 'pin', tier: 'standard' },
    { name: 'Pec Deck Machine',    machineType: 'pin', tier: 'basic' },
    { name: 'Incline DB Fly',      tier: 'standard' },
    { name: 'Decline DB Press',    tier: 'standard' },
    { name: 'Dips (Weighted)',     tier: 'advanced' },
  ],
  back_compound: [
    { name: 'Deadlift',                compound: true, tier: 'standard', note: 'Rest 3–4 min.' },
    { name: 'Pull-Ups / Weighted PU',  compound: true, tier: 'standard', note: 'Full ROM, dead hang.' },
    { name: 'Bent Over Barbell Row',   compound: true, tier: 'standard', note: 'Overhand grip, row to waist.' },
    { name: 'Pendlay Row',             compound: true, tier: 'advanced' },
    { name: 'T-Bar Row',               compound: true, tier: 'standard' },
  ],
  back_iso: [
    { name: 'Lat Pulldown',         machineType: 'pin', tier: 'basic' },
    { name: 'Seated Cable Row',     machineType: 'pin', tier: 'basic' },
    { name: 'Close Grip Pulldown',  machineType: 'pin', tier: 'standard' },
    { name: 'Single Arm DB Row',    tier: 'standard' },
    { name: 'Cable Pullover',       machineType: 'pin', tier: 'standard' },
  ],
  legs_compound: [
    { name: 'Barbell Back Squat',     compound: true, tier: 'standard', note: 'Main strength movement. Rest 3 min.' },
    { name: 'Front Squat',            compound: true, tier: 'advanced' },
    { name: 'Hack Squat',             compound: true, machineType: 'pin', tier: 'basic' },
    { name: 'Leg Press',              compound: true, machineType: 'pin', tier: 'basic' },
    { name: 'Romanian Deadlift',      compound: true, tier: 'standard', note: 'Hip hinge, feel the hamstring stretch.' },
    { name: 'Bulgarian Split Squat',  compound: true, tier: 'advanced' },
    { name: 'Walking Lunges (DB)',    compound: true, tier: 'standard', note: 'Control balance, full stride.' },
  ],
  quad_iso: [
    { name: 'Leg Extension',     machineType: 'pin', tier: 'basic' },
    { name: 'Sissy Squat',       tier: 'advanced' },
  ],
  hamstring_iso: [
    { name: 'Leg Curl (Lying)',     machineType: 'pin', tier: 'basic', note: '3 sec eccentric.' },
    { name: 'Seated Leg Curl',      machineType: 'pin', tier: 'basic' },
    { name: 'Nordic Hamstring Curl', tier: 'advanced' },
  ],
  glute_iso: [
    { name: 'Hip Abductor Machine', machineType: 'pin', tier: 'basic' },
    { name: 'Cable Kickback',       machineType: 'pin', tier: 'standard' },
    { name: 'Hip Thrust',           tier: 'standard' },
  ],
  calf: [
    { name: 'Standing Calf Raises',   machineType: 'pin', tier: 'basic' },
    { name: 'Seated Calf Raises',     machineType: 'pin', tier: 'basic' },
  ],
  shoulder_compound: [
    { name: 'Overhead Press',           compound: true, tier: 'standard', note: 'Control the eccentric.' },
    { name: 'Seated DB Shoulder Press', compound: true, tier: 'basic' },
    { name: 'Arnold Press',             compound: true, tier: 'advanced' },
    { name: 'Machine Shoulder Press',   compound: true, machineType: 'pin', tier: 'basic' },
  ],
  shoulder_iso: [
    { name: 'Cable Lateral Raises', machineType: 'pin', tier: 'standard' },
    { name: 'DB Lateral Raises',    tier: 'basic' },
    { name: 'Machine Lateral Raise', machineType: 'pin', tier: 'basic' },
  ],
  rear_delt: [
    { name: 'Face Pulls',          machineType: 'pin', tier: 'basic', note: 'Never skip — shoulder health.' },
    { name: 'Reverse Pec Deck',    machineType: 'pin', tier: 'basic' },
    { name: 'Rear Delt DB Fly',    tier: 'standard' },
  ],
  bicep: [
    { name: 'EZ Bar Curl',          tier: 'standard' },
    { name: 'Hammer Curls',         tier: 'basic' },
    { name: 'Cable Curl',           machineType: 'pin', tier: 'basic' },
    { name: 'Preacher Curl',        tier: 'standard' },
    { name: 'Incline DB Curl',      tier: 'standard' },
    { name: 'Concentration Curl',   tier: 'basic' },
  ],
  tricep: [
    { name: 'Tricep Rope Pushdowns',     machineType: 'pin', tier: 'basic' },
    { name: 'Tricep Pushdowns',          machineType: 'pin', tier: 'basic' },
    { name: 'Overhead DB Extension',     tier: 'basic' },
    { name: 'Skullcrushers',             tier: 'standard' },
    { name: 'Cable Overhead Extension',  machineType: 'pin', tier: 'standard' },
    { name: 'Reverse Grip Pushdown',     machineType: 'pin', tier: 'standard' },
    { name: 'Tricep Dips',               tier: 'standard' },
  ],
}
