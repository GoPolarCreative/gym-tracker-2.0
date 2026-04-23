import { useState, useEffect } from 'react'
import { getKey, setKey, getPrevWeight } from '../hooks/useStorage'

type Props = {
  week: number
  day: string
  exId: string
  setNum: number
}

export function SetRow({ week, day, exId, setNum }: Props) {
  const [weight, setWeight] = useState(() => getKey(week, day, exId, setNum, 'w'))
  const [reps, setReps] = useState(() => getKey(week, day, exId, setNum, 'r'))
  const [done, setDone] = useState(() => localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${setNum}_done`) === '1')
  const prev = getPrevWeight(day, exId, setNum, week)

  useEffect(() => {
    setWeight(getKey(week, day, exId, setNum, 'w'))
    setReps(getKey(week, day, exId, setNum, 'r'))
    setDone(localStorage.getItem(`ppl_w${week}_${day}_${exId}_s${setNum}_done`) === '1')
  }, [week, day, exId, setNum])

  const nudge = prev ? (prev.weight + 2.5).toFixed(1).replace('.0', '') : null

  const handleWeight = (v: string) => { setWeight(v); setKey(week, day, exId, setNum, 'w', v) }
  const handleReps = (v: string) => { setReps(v); setKey(week, day, exId, setNum, 'r', v) }
  const handleDone = (v: boolean) => {
    setDone(v)
    localStorage.setItem(`ppl_w${week}_${day}_${exId}_s${setNum}_done`, v ? '1' : '0')
  }

  return (
    <tr className={`border-b border-[#2a2b2d] last:border-0 transition-colors ${done ? 'bg-[#3ecf6e]/5' : ''}`}>
      <td className="py-2 px-3 text-center text-white font-semibold text-sm w-8">{setNum}</td>

      <td className="py-2 px-2 w-36">
        {prev ? (
          <div className="text-xs leading-snug">
            <span className="text-white font-semibold">{prev.weight}kg</span>
            <span className="text-[#3ecf6e] font-medium"> → try {nudge}kg</span>
          </div>
        ) : (
          <div className="text-xs text-white/50 font-medium">first session</div>
        )}
      </td>

      <td className="py-1.5 px-1 text-center">
        <input
          type="number"
          value={weight}
          onChange={e => handleWeight(e.target.value)}
          placeholder="kg"
          min={0}
          step={0.5}
          className={`w-14 h-9 rounded-md text-center text-sm font-semibold bg-[#1e2022] text-white border transition-colors focus:outline-none placeholder:text-white/30
            ${weight ? 'border-[#3ecf6e]/60' : 'border-[#2a2b2d] focus:border-[#3a3b3e]'}`}
        />
      </td>

      <td className="py-1.5 px-1 text-center">
        <input
          type="number"
          value={reps}
          onChange={e => handleReps(e.target.value)}
          placeholder="reps"
          min={0}
          className={`w-14 h-9 rounded-md text-center text-sm font-semibold bg-[#1e2022] text-white border transition-colors focus:outline-none placeholder:text-white/30
            ${reps ? 'border-[#3ecf6e]/60' : 'border-[#2a2b2d] focus:border-[#3a3b3e]'}`}
        />
      </td>

      <td className="py-1.5 px-3 text-center">
        <input
          type="checkbox"
          checked={done}
          onChange={e => handleDone(e.target.checked)}
          className="w-4 h-4 accent-[#3ecf6e] cursor-pointer"
        />
      </td>
    </tr>
  )
}
