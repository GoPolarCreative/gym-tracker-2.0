import type { Exercise } from '../data/plan'
import { SetRow } from './SetRow'

type Props = {
  exercise: Exercise
  week: number
  day: string
  rotates: boolean
}

export function ExerciseCard({ exercise, week, day, rotates }: Props) {
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
          {rotates && !exercise.compound && (
            <span className="text-xs font-semibold tracking-wider uppercase bg-[#a78bfa]/10 text-[#a78bfa] px-2 py-0.5 rounded">
              Rotates Phase 2
            </span>
          )}
        </div>
        {exercise.note && (
          <div className="text-white/60 text-xs font-medium mt-1">{exercise.note}</div>
        )}
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#2a2b2d]">
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40 w-8">Set</th>
            <th className="py-2 px-2 text-left text-xs font-bold tracking-widest uppercase text-white/40 w-36">Target / Last</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">kg</th>
            <th className="py-2 px-1 text-center text-xs font-bold tracking-widest uppercase text-white/40">Reps</th>
            <th className="py-2 px-3 text-center text-xs font-bold tracking-widest uppercase text-white/40">✓</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: exercise.sets }, (_, i) => (
            <SetRow key={`${exercise.id}_s${i + 1}`} week={week} day={day} exId={exercise.id} setNum={i + 1} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
