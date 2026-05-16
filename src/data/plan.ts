// Exercise model
// machineType:
//   'pin'  - selectorized machine. At Jetts shows pin numbers (integer), at FC shows kg.
//   'kg'   - kg-rated machine (modern selectorized). Always kg, but gym still scopes the log.
//   undefined - free weight (barbell, dumbbell, bodyweight). Always kg.
export type MachineType = 'pin' | 'kg'

export type Exercise = {
  id: string
  name: string
  sets: number
  target: string
  note?: string
  compound?: boolean
  machineType?: MachineType
}

export type Section = {
  label: string
  exercises: Exercise[]
  rotates?: boolean
}

export type DayPlan = {
  compounds: Exercise[]
  accessories: Exercise[][]
}

export type PlanMap = Record<string, DayPlan>

export const PLAN: PlanMap = {
  mon: {
    compounds: [
      { id: 'mon_bp',  name: 'Barbell Bench Press',    sets: 4, target: '4–6 reps',  note: 'Main strength lift. Rest 3 min.', compound: true },
      { id: 'mon_ohp', name: 'Overhead Press',          sets: 4, target: '6–8 reps',  note: 'Control the eccentric.', compound: true },
    ],
    accessories: [
      [
        { id: 'mon_inc',  name: 'Incline DB Press',      sets: 3, target: '10–12 reps' },
        { id: 'mon_cfly', name: 'Cable Fly',              sets: 3, target: '12–15 reps', machineType: 'pin' },
        { id: 'mon_lat',  name: 'Cable Lateral Raises',  sets: 4, target: '15–20 reps', machineType: 'pin' },
        { id: 'mon_tri',  name: 'Tricep Rope Pushdowns', sets: 3, target: '12–15 reps', machineType: 'pin' },
        { id: 'mon_ote',  name: 'Overhead DB Extension', sets: 3, target: '12–15 reps' },
      ],
      [
        { id: 'mon_dec',  name: 'Decline DB Press',         sets: 3, target: '10–12 reps' },
        { id: 'mon_pec',  name: 'Pec Deck Machine',          sets: 3, target: '12–15 reps', machineType: 'pin' },
        { id: 'mon_dlat', name: 'DB Lateral Raises',         sets: 4, target: '15–20 reps' },
        { id: 'mon_dip',  name: 'Tricep Dips (Weighted)',    sets: 3, target: '8–12 reps' },
        { id: 'mon_skul', name: 'Skullcrushers',             sets: 3, target: '10–12 reps' },
      ],
    ],
  },
  tue: {
    compounds: [
      { id: 'tue_dl', name: 'Deadlift',               sets: 4, target: '4–5 reps', note: 'Rest 3–4 min.', compound: true },
      { id: 'tue_pu', name: 'Pull-Ups / Weighted PU', sets: 4, target: '5–8 reps', note: 'Full ROM, dead hang.', compound: true },
    ],
    accessories: [
      [
        { id: 'tue_row', name: 'Seated Cable Row',  sets: 3, target: '10–12 reps', machineType: 'pin' },
        { id: 'tue_lpd', name: 'Lat Pulldown',      sets: 3, target: '10–12 reps', machineType: 'pin' },
        { id: 'tue_fp',  name: 'Face Pulls',        sets: 3, target: '15–20 reps', note: 'Never skip — shoulder health.', machineType: 'pin' },
        { id: 'tue_ham', name: 'Hammer Curls',      sets: 3, target: '12–15 reps' },
      ],
      [
        { id: 'tue_sar', name: 'Single Arm DB Row',   sets: 3, target: '10–12 reps' },
        { id: 'tue_cgl', name: 'Close Grip Pulldown', sets: 3, target: '10–12 reps', machineType: 'pin' },
        { id: 'tue_fp2', name: 'Face Pulls',          sets: 3, target: '15–20 reps', note: 'Never skip — shoulder health.', machineType: 'pin' },
        { id: 'tue_inc', name: 'Incline DB Curl',     sets: 3, target: '12–15 reps' },
      ],
    ],
  },
  wed: {
    compounds: [
      { id: 'wed_sq',  name: 'Barbell Back Squat',  sets: 4, target: '4–6 reps',  note: 'Main strength movement. Rest 3 min.', compound: true },
      { id: 'wed_rdl', name: 'Romanian Deadlift',   sets: 4, target: '8–10 reps', note: 'Hip hinge, feel the hamstring stretch.', compound: true },
    ],
    accessories: [
      [
        { id: 'wed_lp',  name: 'Leg Press',             sets: 3, target: '10–12 reps', machineType: 'pin' },
        { id: 'wed_lc',  name: 'Leg Curl (Lying)',       sets: 3, target: '10–12 reps', note: '3 sec eccentric.', machineType: 'pin' },
        { id: 'wed_lex', name: 'Leg Extension',          sets: 3, target: '15 reps', machineType: 'pin' },
        { id: 'wed_cal', name: 'Standing Calf Raises',   sets: 4, target: '15–20 reps', machineType: 'pin' },
      ],
      [
        { id: 'wed_bss', name: 'Bulgarian Split Squat',  sets: 3, target: '8–10 reps/leg' },
        { id: 'wed_nhc', name: 'Nordic Hamstring Curl',  sets: 3, target: '6–10 reps' },
        { id: 'wed_le2', name: 'Leg Extension',          sets: 3, target: '15 reps', machineType: 'pin' },
        { id: 'wed_ca2', name: 'Standing Calf Raises',   sets: 4, target: '15–20 reps', machineType: 'pin' },
      ],
    ],
  },
  fri: {
    compounds: [
      { id: 'fri_bp',  name: 'Bench Press',           sets: 3, target: '6–8 reps', note: 'Moderate weight, quality reps.', compound: true },
      { id: 'fri_row', name: 'Bent Over Barbell Row', sets: 3, target: '6–8 reps', note: 'Overhand grip, row to waist.', compound: true },
    ],
    accessories: [
      [
        { id: 'fri_ezc', name: 'EZ Bar Curl',              sets: 3, target: '10–12 reps' },
        { id: 'fri_ham', name: 'Hammer Curls',             sets: 3, target: '12 reps' },
        { id: 'fri_cc',  name: 'Cable Curl',               sets: 2, target: '15 reps', machineType: 'pin' },
        { id: 'fri_sc',  name: 'Skull Crushers',           sets: 3, target: '10–12 reps' },
        { id: 'fri_ote', name: 'Overhead Tricep Extension',sets: 3, target: '12 reps' },
        { id: 'fri_pd',  name: 'Tricep Pushdowns',         sets: 2, target: '15 reps', machineType: 'pin' },
      ],
      [
        { id: 'fri_pc',  name: 'Preacher Curl',            sets: 3, target: '10–12 reps' },
        { id: 'fri_con', name: 'Concentration Curl',       sets: 3, target: '12 reps' },
        { id: 'fri_cc2', name: 'Cable Curl',               sets: 2, target: '15 reps', machineType: 'pin' },
        { id: 'fri_dip', name: 'Tricep Dips',              sets: 3, target: '10–12 reps' },
        { id: 'fri_coe', name: 'Cable Overhead Extension', sets: 3, target: '12 reps', machineType: 'pin' },
        { id: 'fri_rgp', name: 'Reverse Grip Pushdown',    sets: 2, target: '15 reps', machineType: 'pin' },
      ],
    ],
  },
  sat: {
    compounds: [
      { id: 'sat_hs',  name: 'Hack Squat / Front Squat', sets: 4, target: '8–10 reps', note: 'Quad focused, higher rep than Wed.', compound: true },
      { id: 'sat_lun', name: 'Walking Lunges (DB)',       sets: 3, target: '10 reps/leg', note: 'Control balance, full stride.', compound: true },
    ],
    accessories: [
      [
        { id: 'sat_lex', name: 'Leg Extension',       sets: 4, target: '15–20 reps', note: 'Drop set on last set.', machineType: 'pin' },
        { id: 'sat_slc', name: 'Seated Leg Curl',     sets: 3, target: '12–15 reps', machineType: 'pin' },
        { id: 'sat_hip', name: 'Hip Abductor Machine',sets: 3, target: '15 reps', machineType: 'pin' },
        { id: 'sat_cal', name: 'Seated Calf Raises',  sets: 4, target: '15–20 reps', machineType: 'pin' },
      ],
      [
        { id: 'sat_le2', name: 'Leg Extension',       sets: 4, target: '15–20 reps', note: 'Drop set on last set.', machineType: 'pin' },
        { id: 'sat_sl2', name: 'Seated Leg Curl',     sets: 3, target: '12–15 reps', machineType: 'pin' },
        { id: 'sat_kbs', name: 'KB Sumo Deadlift',    sets: 3, target: '12 reps' },
        { id: 'sat_ca2', name: 'Seated Calf Raises',  sets: 4, target: '15–20 reps', machineType: 'pin' },
      ],
    ],
  },
}

export const DAY_LABELS: Record<string, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
}

export const DAY_TYPE: Record<string, string> = {
  mon: 'Push',
  tue: 'Pull',
  wed: 'Legs',
  fri: 'Arms',
  sat: 'Legs',
}

export const WORKOUT_DAYS = ['mon', 'tue', 'wed', 'fri', 'sat']

// Phase = 4-week block. Accessories rotate between phase A (even) and phase B (odd).
// New behaviour: after every 4 weeks the accessory pool flips automatically.
export function getPhase(week: number) {
  return Math.floor((week - 1) / 4)
}

export function getPhaseLabel(week: number) {
  return `Phase ${getPhase(week) + 1}`
}

export function getAccessoryIndex(week: number) {
  return getPhase(week) % 2
}

export function getSections(dayKey: string, week: number) {
  const d = PLAN[dayKey]
  if (!d) return []
  const accIdx = getAccessoryIndex(week)
  return [
    { label: 'Compounds', exercises: d.compounds, rotates: false },
    { label: `Accessories · Phase ${getPhase(week) + 1}`, exercises: d.accessories[accIdx], rotates: true },
  ]
}

// Parse the "top" of a rep range from a target string.
// Examples:
//   "10–12 reps"      -> 12
//   "15 reps"         -> 15
//   "5–8 reps"        -> 8
//   "10 reps/leg"     -> 10
//   "8–10 reps/leg"   -> 10
export function getTopReps(target: string): number | null {
  const nums = target.match(/\d+/g)
  if (!nums || nums.length === 0) return null
  const first = nums.slice(0, 2).map(Number)
  return Math.max(...first)
}

// Increment for "graduating" to the next weight when double-progression is cleared.
// The unit follows the active gym: pin machines at Jetts step +1 pin, but the same
// machine at FC (displayed in kg) steps +2.5 kg. Free weights are always +2.5 kg.
export function getIncrement(ex: Exercise, gym: GymKey): number {
  if (ex.machineType === 'pin' && gym === 'Jetts') return 1
  return 2.5
}

// Unit label for an exercise in the current gym context.
export function getUnitLabel(ex: Exercise, gym: GymKey): string {
  if (ex.machineType === 'pin' && gym === 'Jetts') return 'pin'
  return 'kg'
}

export type GymKey = 'Jetts' | 'FC'
