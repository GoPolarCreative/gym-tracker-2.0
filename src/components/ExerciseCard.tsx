import { useState } from 'react'
import type { Exercise } from '../data/plan'
import { getUnitLabel } from '../data/plan'
import type { MachineLabel } from '../hooks/useProfile'
import { SetRow } from './SetRow'
import { ExerciseSwapModal } from './ExerciseSwapModal'
import { getProgression } from '../lib/progression'
import { SWAP_OPTIONS, type ExerciseDef } from '../data/exercises'
import { useExerciseSwaps } from '../hooks/useExerciseSwaps'

type Props = {
  exercise: Exercise
  week: number
  day: string
  machineLabel: MachineLabel
  rotates: boolean
}

export function ExerciseCard({ exercise, week, day, machineLabel, rotates }: Props) {
  const { resolve, setSessionSwap, setAlwaysSwap } = useExerciseSwaps()
  const swap = resolve(week, day, exercise.id)
  const [swapOpen, setSwapOpen] = useState(false)

  // Render the resolved exercise (swap overrides name + machineType + note).
  const resolved: Exercise = swap
    ? { ...exercise, name: swap.name, machineType: swap.machineType, note: swap.note }
    : exercise

  const isTimeBased = resolved.target.toLowerCase().includes('sec')
  const unit = isTimeBased ? 'sec' : getUnitLabel(resolved, machineLabel)
  const isPinUnit = resolved.machineType === 'machine' && machineLabel === 'pin'

  // Progression is only meaningful for weighted, rep-based exercises.
  const advice = isTimeBased ? null : getProgression(week, day, resolved, machineLabel)
  const suggested = advice?.kind === 'graduate' ? advice.nextWeight : null

  const adviceBadge = (() => {
    if (!advice) return null
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

  const canSwap = exercise.compound && SWAP_OPTIONS[exercise.name]
  const swapBaseName = exercise.name  // swaps always reference the *original* compound

  const handleChoose = (def: ExerciseDef, scope: 'session' | 'always') => {
    if (scope === 'session') setSessionSwap(week, day, exercise.id, def)
    else setAlwaysSwap(exercise.id, def)
    setSwapOpen(false)
  }

  return (
    <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl mb-3 overflow-hidden">
      <div className="px-4 pt-3 pb-2.5 border-b border-[#2a2b2d]">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="text-white font-bold text-base flex items-center gap-2 flex-wrap">
              {resolved.name}
              {swap && (
                <span className="text-[10px] font-semibold tracking-widest uppercase bg-[#4a9eff]/10 text-[#4a9eff] px-1.5 py-0.5 rounded">
                  Swapped
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-1 flex-wrap items-center">
              <span className="text-white/70 text-xs font-medium">{resolved.sets} × {resolved.target}</span>
              {resolved.compound && !resolved.finisher && (
                <span className="text-xs font-semibold tracking-wider uppercase bg-white/5 text-white/50 px-2 py-0.5 rounded">
                  Compound
                </span>
              )}
              {resolved.machineType === 'machine' && (
                <span className="text-xs font-semibold tracking-wider uppercase bg-[#f0a500]/10 text-[#f0a500] px-2 py-0.5 rounded">
                  Machine · {isPinUnit ? 'pin' : 'kg'}
                </span>
              )}
              {rotates && !resolved.compound && !resolved.finisher && (
                <span className="text-xs font-semibold tracking-wider uppercase bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded">
                  Rotates Phase 2
                </span>
              )}
            </div>
            {resolved.note && (
              <div className="text-white/60 text-xs font-medium mt-1">{resolved.note}</div>
            )}
            {adviceBadge && (
              <div className={`mt-2 inline-block text-xs font-semibold px-2 py-1 rounded ${adviceBadge.cls}`}>
                {adviceBadge.text}
              </div>
            )}
          </div>
          {canSwap && (
            <button
              onClick={() => setSwapOpen(true)}
              className="shrink-0 border border-[#2a2b2d] hover:border-[#4a9eff] text-white/60 hover:text-[#4a9eff] text-[10px] font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-md transition-colors"
            >
              Swap
            </button>
          )}
        </div>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2b2d]">
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40 w-8">Set</th>
            <th className="py-2 px-2 text-left text-xs font-bold tracking-widest uppercase text-white/40 w-36">Target / Last</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">{unit}</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">{isTimeBased ? 'Sec' : 'Reps'}</th>
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40">✓</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: resolved.sets }, (_, i) => (
            <SetRow
              key={`${resolved.id}_s${i + 1}`}
              week={week}
              day={day}
              exId={resolved.id}
              setNum={i + 1}
              machineLabel={machineLabel}
              machineType={resolved.machineType}
              suggestedWeight={suggested}
              timeBased={isTimeBased}
            />
          ))}
        </tbody>
      </table>

      {swapOpen && (
        <ExerciseSwapModal
          currentName={swapBaseName}
          machineLabel={machineLabel}
          onChoose={handleChoose}
          onClose={() => setSwapOpen(false)}
        />
      )}
    </div>
  )
}
