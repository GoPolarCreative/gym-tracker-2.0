type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'history'

const TABS: { key: DayKey; label: string; type: string }[] = [
  { key: 'mon', label: 'Mon · Push',  type: 'push' },
  { key: 'tue', label: 'Tue · Pull',  type: 'pull' },
  { key: 'wed', label: 'Wed · Legs',  type: 'legs' },
  { key: 'thu', label: 'Thu · Rest',  type: 'rest' },
  { key: 'fri', label: 'Fri · Arms',  type: 'arms' },
  { key: 'sat', label: 'Sat · Legs',  type: 'legs' },
  { key: 'sun', label: 'Sun · Rest',  type: 'rest' },
  { key: 'history', label: 'History', type: 'history' },
]

const ACTIVE_COLORS: Record<string, string> = {
  push: 'border-[#f0a500] text-[#f0a500]',
  pull: 'border-[#4a9eff] text-[#4a9eff]',
  legs: 'border-[#3ecf6e] text-[#3ecf6e]',
  arms: 'border-[#ff6b6b] text-[#ff6b6b]',
  history: 'border-[#a78bfa] text-[#a78bfa]',
  rest: 'border-white text-white',
}

export function NavBar({ currentDay, setCurrentDay }: { currentDay: DayKey; setCurrentDay: (d: DayKey) => void }) {
  return (
    <nav className="bg-[#18191b] border-b border-[#2a2b2d] sticky top-0 z-50 flex items-center px-4">
      <div className="text-xl font-bold tracking-widest text-white pr-4 border-r border-[#2a2b2d] mr-1 py-4 whitespace-nowrap">
        PPL
      </div>
      <div className="flex overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {TABS.map(tab => {
          const isActive = currentDay === tab.key
          const activeClass = isActive ? ACTIVE_COLORS[tab.type] : 'border-transparent text-white/60 hover:text-white'
          return (
            <button
              key={tab.key}
              onClick={() => setCurrentDay(tab.key)}
              className={`px-3 py-4 text-xs font-semibold tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${activeClass}`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
