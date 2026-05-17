import { useState } from 'react'
import { SWAP_OPTIONS, type ExerciseDef } from '../data/exercises'
import type { MachineLabel } from '../hooks/useProfile'

type Props = {
  currentName: string
  machineLabel: MachineLabel
  onChoose: (def: ExerciseDef, scope: 'session' | 'always') => void
  onClose: () => void
}

export function ExerciseSwapModal({ currentName, machineLabel, onChoose, onClose }: Props) {
  const options = SWAP_OPTIONS[currentName] ?? []
  const [picked, setPicked] = useState<ExerciseDef | null>(null)

  if (options.length === 0) {
    // No alternatives defined — show a tiny notice and let user close.
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
        <div className="bg-[#18191b] border border-[#2a2b2d] rounded-2xl max-w-md w-full p-6 text-center" onClick={e => e.stopPropagation()}>
          <div className="text-white font-bold text-lg mb-2">No swap options yet</div>
          <div className="text-white/60 text-sm font-medium mb-4">
            We haven't curated alternatives for "{currentName}" yet.
          </div>
          <button
            onClick={onClose}
            className="bg-white text-[#111213] font-bold text-sm tracking-widest uppercase px-5 py-2.5 rounded-lg hover:opacity-85"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const unitFor = (def: ExerciseDef) =>
    def.machineType === 'machine' && machineLabel === 'pin' ? 'pin' : 'kg'

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-[#18191b] border border-[#2a2b2d] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#2a2b2d]">
          <div className="text-xs font-bold tracking-widest uppercase text-white/40">Swap exercise</div>
          <div className="text-white font-bold text-lg mt-0.5 truncate">{currentName}</div>
        </div>

        <div className="p-5 flex flex-col gap-2.5 max-h-[55vh] overflow-y-auto">
          {options.map(opt => (
            <button
              key={opt.name}
              onClick={() => setPicked(opt)}
              className={`w-full text-left border rounded-xl p-4 transition-colors ${
                picked?.name === opt.name
                  ? 'border-[#3ecf6e] bg-[#3ecf6e]/10'
                  : 'border-[#2a2b2d] hover:border-[#3a3b3e] bg-[#1e2022]'
              }`}
            >
              <div className="text-white font-bold text-base flex items-center gap-2">
                {opt.name}
                {opt.machineType === 'machine' && (
                  <span className="text-[10px] font-semibold tracking-widest uppercase bg-[#f0a500]/10 text-[#f0a500] px-1.5 py-0.5 rounded">
                    Machine · {unitFor(opt)}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="px-5 py-4 border-t border-[#2a2b2d] flex flex-col gap-2">
          {picked && (
            <div className="text-xs text-white/55 mb-1">
              Apply <span className="text-white font-semibold">{picked.name}</span>:
            </div>
          )}
          <div className="flex flex-wrap gap-2 justify-end">
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-sm font-semibold tracking-widest uppercase px-3 py-2"
            >
              Cancel
            </button>
            <button
              onClick={() => picked && onChoose(picked, 'session')}
              disabled={!picked}
              className="border border-[#4a9eff] text-[#4a9eff] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-md hover:bg-[#4a9eff]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              This session only
            </button>
            <button
              onClick={() => picked && onChoose(picked, 'always')}
              disabled={!picked}
              className="bg-[#3ecf6e] text-[#111213] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-md hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Always
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
