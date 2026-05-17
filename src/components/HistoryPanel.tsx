import { useState } from 'react'
import { getSections, getPhaseLabel, getUnitLabel, type PlanMap } from '../data/plan'
import { useProfile, getMachineLabel } from '../hooks/useProfile'
import type { WorkoutType } from '../lib/planGenerator'

function readField(week: number, day: string, exId: string, set: number, field: string) {
  return (
    localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`) ||
    localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}__Jetts`) ||
    localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}__FC`)
  )
}

const DAY_SHORT: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

type Props = {
  totalWeeks: number
  userPlan: PlanMap | null
  dayTypes: Record<string, WorkoutType>
  trainingDays: string[]
}

export function HistoryPanel({ totalWeeks, userPlan, dayTypes, trainingDays }: Props) {
  const { profile } = useProfile()
  const machineLabel = getMachineLabel(profile)
  const days = trainingDays.length > 0 ? trainingDays : ['mon', 'tue', 'wed', 'fri', 'sat']
  const [selectedDay, setSelectedDay] = useState(days[0])
  const weeks = Array.from({ length: totalWeeks }, (_, i) => totalWeeks - i)

  const dayLabelFor = (d: string) => {
    const wt = dayTypes[d]
    return wt ? `${DAY_SHORT[d]} · ${wt}` : DAY_SHORT[d]
  }

  return (
    <div>
      <h2 className="text-5xl font-extrabold tracking-wide uppercase text-[#a78bfa] mb-6">
        History
      </h2>

      <div className="flex gap-2 flex-wrap mb-6">
        {days.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`border px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors
              ${selectedDay === d
                ? 'border-[#a78bfa] text-[#a78bfa]'
                : 'border-[#2a2b2d] text-white/60 hover:border-[#3a3b3e] hover:text-white'
              }`}
          >
            {dayLabelFor(d)}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {weeks.map(w => {
          const sections = getSections(selectedDay, w, userPlan)
          let hasData = false
          sections.forEach(s => s.exercises.forEach(ex => {
            for (let i = 1; i <= ex.sets; i++) {
              if (readField(w, selectedDay, ex.id, i, 'w')) hasData = true
            }
          }))
          if (!hasData) return null

          return (
            <div key={w} className="bg-[#18191b] border border-[#2a2b2d] rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-[#1e2022] border-b border-[#2a2b2d] flex justify-between items-center">
                <span className="font-bold tracking-wider uppercase text-white text-base">Week {w}</span>
                <span className="text-[#a78bfa] text-xs font-semibold tracking-wider">{getPhaseLabel(w)}</span>
              </div>
              <div className="p-4 flex flex-col gap-4">
                {sections.map(section =>
                  section.exercises.map(ex => {
                    const unit = getUnitLabel(ex, machineLabel)
                    const sets = Array.from({ length: ex.sets }, (_, i) => {
                      const wv = readField(w, selectedDay, ex.id, i + 1, 'w')
                      const rv = readField(w, selectedDay, ex.id, i + 1, 'r')
                      const done =
                        localStorage.getItem(`ppl_w${w}_${selectedDay}_${ex.id}_s${i + 1}_done`) === '1' ||
                        localStorage.getItem(`ppl_w${w}_${selectedDay}_${ex.id}_s${i + 1}_done__Jetts`) === '1' ||
                        localStorage.getItem(`ppl_w${w}_${selectedDay}_${ex.id}_s${i + 1}_done__FC`) === '1'
                      return { wv, rv, done }
                    }).filter(s => s.wv || s.rv)

                    if (sets.length === 0) return null
                    return (
                      <div key={ex.id}>
                        <div className="text-white font-bold text-sm mb-2">{ex.name}</div>
                        <div className="flex gap-2 flex-wrap">
                          {sets.map((s, i) => (
                            <span
                              key={i}
                              className={`text-xs font-semibold px-2.5 py-1 rounded border ${
                                s.done
                                  ? 'border-[#3ecf6e]/50 text-[#3ecf6e] bg-[#3ecf6e]/5'
                                  : 'border-[#2a2b2d] text-white/70'
                              }`}
                            >
                              {s.wv || '—'}{unit} × {s.rv || '—'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })
                )}
                {(() => {
                  const notes =
                    localStorage.getItem(`ppl_w${w}_${selectedDay}_notes`) ||
                    localStorage.getItem(`ppl_w${w}_${selectedDay}_notes__Jetts`) ||
                    localStorage.getItem(`ppl_w${w}_${selectedDay}_notes__FC`)
                  return notes ? (
                    <div className="text-white/50 text-xs font-medium italic pt-3 border-t border-[#2a2b2d]">"{notes}"</div>
                  ) : null
                })()}
              </div>
            </div>
          )
        })}

        {weeks.every(w => {
          const sections = getSections(selectedDay, w, userPlan)
          return !sections.some(s => s.exercises.some(ex =>
            Array.from({ length: ex.sets }, (_, i) =>
              readField(w, selectedDay, ex.id, i + 1, 'w')
            ).some(Boolean)
          ))
        }) && (
          <div className="text-center py-12 text-white/40 text-sm font-medium">
            No data logged yet for this day.
          </div>
        )}
      </div>
    </div>
  )
}
