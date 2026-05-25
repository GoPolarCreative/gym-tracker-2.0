import { useState, useEffect } from 'react'
import { getSections, DAY_LABELS, type PlanMap } from '../data/plan'
import { ExerciseCard } from './ExerciseCard'
import { getNotesKey, setNotesKey } from '../hooks/useStorage'
import { useProfile, getMachineLabel } from '../hooks/useProfile'
import type { WorkoutType } from '../lib/planGenerator'

const TYPE_COLORS: Record<string, string> = {
  Push: 'text-[#f0a500] bg-[#f0a500]/10',
  'Push A': 'text-[#f0a500] bg-[#f0a500]/10',
  'Push B': 'text-[#f0a500] bg-[#f0a500]/10',
  Pull: 'text-[#4a9eff] bg-[#4a9eff]/10',
  'Pull A': 'text-[#4a9eff] bg-[#4a9eff]/10',
  'Pull B': 'text-[#4a9eff] bg-[#4a9eff]/10',
  Legs: 'text-[#3ecf6e] bg-[#3ecf6e]/10',
  'Legs A': 'text-[#3ecf6e] bg-[#3ecf6e]/10',
  'Legs B': 'text-[#3ecf6e] bg-[#3ecf6e]/10',
  'Legs (Quad)': 'text-[#3ecf6e] bg-[#3ecf6e]/10',
  'Legs (Ham)':  'text-[#3ecf6e] bg-[#3ecf6e]/10',
  Arms: 'text-[#ff6b6b] bg-[#ff6b6b]/10',
  Upper: 'text-[#4a9eff] bg-[#4a9eff]/10',
  Lower: 'text-[#3ecf6e] bg-[#3ecf6e]/10',
  'Full Body': 'text-[#a78bfa] bg-[#a78bfa]/10',
}

const TITLE_COLORS: Record<string, string> = {
  Push: 'text-[#f0a500]',
  'Push A': 'text-[#f0a500]',
  'Push B': 'text-[#f0a500]',
  Pull: 'text-[#4a9eff]',
  'Pull A': 'text-[#4a9eff]',
  'Pull B': 'text-[#4a9eff]',
  Legs: 'text-[#3ecf6e]',
  'Legs A': 'text-[#3ecf6e]',
  'Legs B': 'text-[#3ecf6e]',
  'Legs (Quad)': 'text-[#3ecf6e]',
  'Legs (Ham)': 'text-[#3ecf6e]',
  Arms: 'text-[#ff6b6b]',
  Upper: 'text-[#4a9eff]',
  Lower: 'text-[#3ecf6e]',
  'Full Body': 'text-[#a78bfa]',
}

type Props = {
  day: string
  week: number
  userPlan: PlanMap | null
  workoutType?: WorkoutType
  /** Override the default DAY_LABELS lookup. Used for custom plans whose day keys aren't weekdays. */
  displayName?: string
}

export function DayPanel({ day, week, userPlan, workoutType, displayName }: Props) {
  const { profile } = useProfile()
  const machineLabel = getMachineLabel(profile)
  const sections = getSections(day, week, userPlan)
  const label = displayName ?? DAY_LABELS[day] ?? day
  // No workoutType means this is a custom plan day — render with a neutral colour.
  const type = workoutType
  const titleClass = type ? (TITLE_COLORS[type] ?? 'text-white') : 'text-white'
  const chipClass = type ? (TYPE_COLORS[type] ?? 'bg-white/10 text-white') : ''
  const [notes, setNotes] = useState(() => getNotesKey(week, day))
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setNotes(getNotesKey(week, day))
  }, [week, day])

  if (sections.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-4xl font-extrabold tracking-widest uppercase text-white/20 mb-3">No plan yet</h3>
        <p className="text-white/50 text-sm font-medium">Complete the questionnaire to generate a plan for this day.</p>
      </div>
    )
  }

  const handleNotes = (v: string) => {
    setNotes(v)
    setNotesKey(week, day, v)
  }

  const handleMasterSave = () => {
    localStorage.setItem(`ppl_w${week}_${day}_committed`, '1')
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6 flex-wrap">
        <h2 className={`text-5xl font-extrabold tracking-wide uppercase leading-none ${titleClass}`}>
          {label}
        </h2>
        {type && (
          <span className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md ${chipClass}`}>
            {type}
          </span>
        )}
      </div>

      {sections.map(section => (
        <div key={section.label}>
          <div className="flex items-center gap-3 mb-2 mt-6 first:mt-0">
            <span className="text-xs font-bold tracking-widest uppercase text-white/50">{section.label}</span>
            <div className="flex-1 h-px bg-[#2a2b2d]" />
          </div>
          {section.exercises.map(ex => (
            <ExerciseCard key={ex.id} exercise={ex} week={week} day={day} machineLabel={machineLabel} rotates={!!section.rotates} />
          ))}
        </div>
      ))}

      <div className="mt-5 border border-[#2a2b2d] rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#1e2022] border-b border-[#2a2b2d] text-xs font-bold tracking-widest uppercase text-white/60">
          Session Notes
        </div>
        <textarea
          value={notes}
          onChange={e => handleNotes(e.target.value)}
          placeholder="Energy, soreness, PRs, anything worth noting..."
          className="w-full bg-[#18191b] text-white text-sm font-medium p-4 resize-y min-h-[80px] focus:outline-none placeholder:text-white/25"
        />
      </div>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <button
          onClick={handleMasterSave}
          className="bg-white text-[#111213] font-bold text-sm tracking-widest uppercase px-6 py-3 rounded-lg hover:opacity-85 transition-opacity"
        >
          Save to History
        </button>
        {saved && (
          <span className="text-[#3ecf6e] text-sm font-semibold">✓ Saved to history</span>
        )}
        <span className="text-white/40 text-xs font-medium ml-auto">Sets auto-save as you type</span>
      </div>
    </div>
  )
}
