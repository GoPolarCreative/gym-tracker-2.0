import { useState } from 'react'

type Props = {
  onCustomWorkout: () => void
  onBuildWorkout: () => void
  onHistory: () => void
  onBodyWeight: () => void
  onClearHistory: () => void
}

export function Dashboard({
  onCustomWorkout, onBuildWorkout, onHistory, onBodyWeight, onClearHistory,
}: Props) {
  const [confirming, setConfirming] = useState(false)

  const cards: { label: string; sub: string; onClick: () => void; accent: string }[] = [
    {
      label: 'Custom Workout',
      sub: 'A plan tailored to you from the questionnaire',
      onClick: onCustomWorkout,
      accent: 'border-l-[#3ecf6e]',
    },
    {
      label: 'Build a Workout',
      sub: 'Create and log your own plan',
      onClick: onBuildWorkout,
      accent: 'border-l-[#4a9eff]',
    },
    {
      label: 'Workout History',
      sub: 'See every session you have logged',
      onClick: onHistory,
      accent: 'border-l-[#a78bfa]',
    },
    {
      label: 'Body Weight History',
      sub: 'Track and chart your weight over time',
      onClick: onBodyWeight,
      accent: 'border-l-[#f0a500]',
    },
  ]

  return (
    <div className="min-h-screen bg-[#111213] text-white">
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-12">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-widest uppercase text-white mb-2">
          Dashboard
        </h1>
        <p className="text-white/40 text-sm font-medium mb-8">
          Pick where you're heading.
        </p>

        <div className="flex flex-col gap-3">
          {cards.map(card => (
            <button
              key={card.label}
              onClick={card.onClick}
              className={`group text-left bg-[#18191b] border border-[#2a2b2d] border-l-4 ${card.accent} rounded-xl px-5 py-5 hover:bg-[#1e2022] hover:border-[#3a3b3e] transition-colors`}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-white font-extrabold text-lg sm:text-xl tracking-wide uppercase">
                    {card.label}
                  </div>
                  <div className="text-white/55 text-sm font-medium mt-1">{card.sub}</div>
                </div>
                <div className="text-white/30 group-hover:text-white/60 text-2xl font-bold shrink-0">
                  →
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-[#2a2b2d]">
          <button
            onClick={() => setConfirming(true)}
            className="w-full border border-[#ff6b6b]/40 text-[#ff6b6b] hover:bg-[#ff6b6b]/10 font-bold text-sm tracking-widest uppercase px-5 py-3 rounded-lg transition-colors"
          >
            Clear All History
          </button>
          <p className="text-white/30 text-xs font-medium text-center mt-2">
            Clears logged sets, notes, and bodyweight entries. Plans are kept.
          </p>
        </div>
      </div>

      {confirming && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setConfirming(false)}
        >
          <div
            className="w-full max-w-sm bg-[#18191b] border border-[#ff6b6b]/40 rounded-2xl overflow-hidden shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b border-[#2a2b2d]">
              <div className="text-[#ff6b6b] font-bold text-base">Are you sure?</div>
              <p className="text-white/60 text-sm font-medium mt-1">
                This will delete all your history and cannot be undone.
              </p>
            </div>
            <div className="p-4 flex flex-col gap-2">
              <button
                onClick={() => { onClearHistory(); setConfirming(false) }}
                className="bg-[#ff6b6b] text-[#111213] font-bold text-sm tracking-widest uppercase px-5 py-3 rounded-lg hover:opacity-85 transition-opacity"
              >
                Yes, Delete Everything
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="text-white/60 hover:text-white text-sm font-semibold tracking-widest uppercase px-3 py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
