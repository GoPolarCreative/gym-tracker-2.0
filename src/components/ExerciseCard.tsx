import type { Exercise, GymKey } from '../data/plan'
import { getUnitLabel } from '../data/plan'
import { SetRow } from './SetRow'
import { getProgression } from '../lib/progression'

type Props = {
  exercise: Exercise
  week: number
  day: string
  gym: GymKey
  rotates: boolean
}

export function ExerciseCard({ exercise, week, day, gym, rotates }: Props) {
  const unit = getUnitLabel(exercise, gym)
  const isPinUnit = exercise.machineType === 'pin' && gym === 'Jetts'
  const advice = getProgression(week, day, exercise, gym)
  const suggested = advice.kind === 'graduate' ? advice.nextWeight : null

  // Friendly "where are you in double progression" badge.
  const adviceBadge = (() => {
    switch (advice.kind) {
      case 'graduate':
        return {
          text: `Move up to ${isPinUnit ? Math.round(advice.nextWeight) : advice.nextWeight}${unit}`,
          cls: 'bg-[#3ecf6e]/15 text-[#3ecf6e]',
        }
      case 'one-more':
        return {
          text: `1 more clean session at ${advice.topReps} reps → +${isPinUnit ? '1 pin' : '2.5kg'}`,
          cls: 'bg-[#4a9eff]/15 text-[#4a9eff]',
        }
      case 'hold':
        return advice.topReps
          ? { text: `Hit ${advice.topReps} reps on all sets to progress`, cls: 'bg-white/5 text-white/55' }
          : null
      default:
        return null
    }
  })()

  return (
    <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl mb-3 overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-[#2a2b2d]">
        <div className="text-white font-bold text-base">{exercise.name}</div>
        <div className="flex gap-2 mt-1 flex-wrap items-center">
          <span className="text-white/70 text-xs font-medium">{exercise.sets} × {exercise.target}</span>
          {exercise.compound && (
            <span className="text-xs font-semibold tracking-wider uppercase bg-white/5 text-white/50 px-2 py-0.5 rounded">
              Compound
            </span>
          )}
          {exercise.machineType === 'pin' && (
            <span className="text-xs font-semibold tracking-wider uppercase bg-[#f0a500]/10 text-[#f0a500] px-2 py-0.5 rounded">
              {gym === 'Jetts' ? 'Pin machine' : 'Machine'}
            </span>
          )}
          {rotates && !exercise.compound && (
            <span className="text-xs font-semibold tracking-wider uppercase bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded">
              Rotates Phase 2
            </span>
          )}
        </div>
        {exercise.note && (
          <div className="text-white/60 text-xs font-medium mt-1">{exercise.note}</div>
        )}
        {adviceBadge && (
          <div className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded ${adviceBadge.cls}`}>
            {adviceBadge.text}
          </div>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2b2d]">
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40 w-8">Set</th>
            <th className="py-2 px-2 text-left text-xs font-bold tracking-widest uppercase text-white/40 w-36">Target / Last</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">{unit}</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">Reps</th>
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40">✓</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: exercise.sets }, (_, i) => (
            <SetRow
              key={`${exercise.id}_s${i + 1}`}
              week={week}
              day={day}
              exId={exercise.id}
              setNum={i + 1}
              gym={gym}
              machineType={exercise.machineType}
              suggestedWeight={suggested}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}
