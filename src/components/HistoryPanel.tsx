import { useState } from 'react'
import { getSections, getPhaseLabel, WORKOUT_DAYS, getUnitLabel } from '../data/plan'
import { useGym } from '../hooks/useGym'

const DAY_LABELS_SHORT: Record<string, string> = {
  mon: 'Mon · Push',
  tue: 'Tue · Pull',
  wed: 'Wed · Legs',
  fri: 'Fri · Arms',
  sat: 'Sat · Legs',
}

type Props = { totalWeeks: number }

// Read either the gym-scoped value or the legacy unsuffixed value.
function readField(week: number, day: string, exId: string, set: number, field: string, gym: string) {
  return (
    localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}__${gym}`) ||
    localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${set}_${field}`)
  )
}

export function HistoryPanel({ totalWeeks }: Props) {
  const [selectedDay, setSelectedDay] = useState('mon')
  const [gym] = useGym()
  const weeks = Array.from({ length: totalWeeks }, (_, i) => totalWeeks - i)

  return (
    <div>
      <h2 className="text-5xl font-extrabold tracking-wide uppercase text-[#a78bfa] mb-2">
        History
      </h2>
      <div className="text-xs text-white/40 font-medium tracking-widest uppercase mb-6">
        Showing {gym} logs
      </div>

      <div className="flex gap-2 flex-wrap mb-6">
        {WORKOUT_DAYS.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`border px-3 py-1.5 rounded-md text-xs font-semibold tracking-wider uppercase transition-colors
              ${selectedDay === d
                ? 'border-[#a78bfa] text-[#a78bfa]'
                : 'border-[#2a2b2d] text-white/60 hover:border-[#3a3b3e] hover:text-white'
              }`}
          >
            {DAY_LABELS_SHORT[d]}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {weeks.map(w => {
          const sections = getSections(selectedDay, w)
          let hasData = false
          sections.forEach(s => s.exercises.forEach(ex => {
            for (let i = 1; i <= ex.sets; i++) {
              if (readField(w, selectedDay, ex.id, i, 'w', gym)) hasData = true
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
                    const unit = getUnitLabel(ex, gym)
                    const sets = Array.from({ length: ex.sets }, (_, i) => {
                      const wv = readField(w, selectedDay, ex.id, i + 1, 'w', gym)
                      const rv = readField(w, selectedDay, ex.id, i + 1, 'r', gym)
                      const done =
                        localStorage.getItem(`ppl_w${w}_${selectedDay}_${ex.id}_s${i + 1}_done__${gym}`) === '1' ||
                        localStorage.getItem(`ppl_w${w}_${selectedDay}_${ex.id}_s${i + 1}_done`) === '1'
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
                    localStorage.getItem(`ppl_w${w}_${selectedDay}_notes__${gym}`) ||
                    localStorage.getItem(`ppl_w${w}_${selectedDay}_notes`)
                  return notes ? (
                    <div className="text-white/50 text-xs font-medium italic pt-3 border-t border-[#2a2b2d]">"{notes}"</div>
                  ) : null
                })()}
              </div>
            </div>
          )
        })}

        {weeks.every(w => {
          const sections = getSections(selectedDay, w)
          return !sections.some(s => s.exercises.some(ex =>
            Array.from({ length: ex.sets }, (_, i) =>
              readField(w, selectedDay, ex.id, i + 1, 'w', gym)
            ).some(Boolean)
          ))
        }) && (
          <div className="text-center py-12 text-white/40 text-sm font-medium">
            No data logged yet for this day at {gym}.
          </div>
        )}
      </div>
    </div>
  )
}
