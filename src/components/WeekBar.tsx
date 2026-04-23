import { getPhaseLabel } from '../data/plan'

type Props = {
  currentWeek: number
  totalWeeks: number
  onPrev: () => void
  onNext: () => void
  onNewWeek: () => void
}

export function WeekBar({ currentWeek, totalWeeks, onPrev, onNext, onNewWeek }: Props) {
  return (
    <div className="bg-[#1e2022] border-b border-[#2a2b2d] px-4 py-2 flex items-center gap-3 flex-wrap">
      <span className="text-xs font-semibold tracking-widest uppercase text-white/60">Week</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={currentWeek <= 1}
          className="w-7 h-7 rounded-md bg-[#2a2b2d] text-white font-bold flex items-center justify-center hover:bg-[#3a3b3e] disabled:opacity-30 transition-colors text-base"
        >
          ‹
        </button>
        <span className="text-lg font-bold tracking-wider min-w-[72px] text-center text-white">
          Week {currentWeek}
        </span>
        <button
          onClick={onNext}
          disabled={currentWeek >= totalWeeks}
          className="w-7 h-7 rounded-md bg-[#2a2b2d] text-white font-bold flex items-center justify-center hover:bg-[#3a3b3e] disabled:opacity-30 transition-colors text-base"
        >
          ›
        </button>
      </div>
      <button
        onClick={onNewWeek}
        className="border border-[#3a3b3e] text-white/70 hover:border-[#3ecf6e] hover:text-[#3ecf6e] text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-md transition-colors"
      >
        + New Week
      </button>
      <span className="ml-auto bg-[#a78bfa]/10 text-[#a78bfa] text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-md">
        {getPhaseLabel(currentWeek)}
      </span>
    </div>
  )
}
