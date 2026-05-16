import { useGym } from '../hooks/useGym'
import type { GymKey } from '../data/plan'
import type { WorkoutType } from '../lib/planGenerator'

export type AppTab =
  | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
  | 'history' | 'body' | 'settings'

const WEEKDAY_KEYS: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] =
  ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const SHORT_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

const TYPE_DISPLAY_SHORT: Record<WorkoutType, string> = {
  Push: 'Push',
  Pull: 'Pull',
  Legs: 'Legs',
  Arms: 'Arms',
  Upper: 'Upper',
  Lower: 'Lower',
  FullBody: 'Full',
}

const TYPE_COLOR: Record<WorkoutType, string> = {
  Push: 'border-[#f0a500] text-[#f0a500]',
  Pull: 'border-[#4a9eff] text-[#4a9eff]',
  Legs: 'border-[#3ecf6e] text-[#3ecf6e]',
  Arms: 'border-[#ff6b6b] text-[#ff6b6b]',
  Upper: 'border-[#4a9eff] text-[#4a9eff]',
  Lower: 'border-[#3ecf6e] text-[#3ecf6e]',
  FullBody: 'border-[#a78bfa] text-[#a78bfa]',
}

const STATIC_TAB_COLORS: Record<string, string> = {
  history: 'border-[#a78bfa] text-[#a78bfa]',
  body: 'border-[#3ecf6e] text-[#3ecf6e]',
  settings: 'border-white text-white',
  rest: 'border-white text-white',
}

const GYMS: GymKey[] = ['Jetts', 'FC']

type Props = {
  currentTab: AppTab
  setCurrentTab: (t: AppTab) => void
  dayTypes: Record<string, WorkoutType>
}

export function NavBar({ currentTab, setCurrentTab, dayTypes }: Props) {
  const [gym, setGym] = useGym()

  const trainingTabs = WEEKDAY_KEYS.map(d => {
    const wt = dayTypes[d]
    if (wt) {
      return {
        key: d as AppTab,
        label: `${SHORT_LABELS[d]} · ${TYPE_DISPLAY_SHORT[wt]}`,
        activeClass: TYPE_COLOR[wt],
      }
    }
    return {
      key: d as AppTab,
      label: `${SHORT_LABELS[d]} · Rest`,
      activeClass: STATIC_TAB_COLORS.rest,
    }
  })

  const extraTabs: { key: AppTab; label: string; activeClass: string }[] = [
    { key: 'body',     label: 'Body',     activeClass: STATIC_TAB_COLORS.body },
    { key: 'history',  label: 'History',  activeClass: STATIC_TAB_COLORS.history },
    { key: 'settings', label: '⚙',        activeClass: STATIC_TAB_COLORS.settings },
  ]

  const allTabs = [...trainingTabs, ...extraTabs]

  return (
    <nav className="bg-[#18191b] border-b border-[#2a2b2d] sticky top-0 z-50">
      <div className="flex items-center px-4">
        <div className="text-xl font-bold tracking-widest text-white pr-4 border-r border-[#2a2b2d] mr-1 py-4 whitespace-nowrap">
          PPL
        </div>
        <div className="flex overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          {allTabs.map(tab => {
            const isActive = currentTab === tab.key
            const cls = isActive ? tab.activeClass : 'border-transparent text-white/60 hover:text-white'
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={`px-3 py-4 text-xs font-semibold tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${cls}`}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="hidden sm:flex items-center gap-1 ml-3 pl-3 border-l border-[#2a2b2d]">
          {GYMS.map(g => (
            <button
              key={g}
              onClick={() => setGym(g)}
              className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1.5 rounded-md transition-colors
                ${gym === g ? 'bg-[#3ecf6e]/15 text-[#3ecf6e]' : 'text-white/40 hover:text-white'}`}
              aria-pressed={gym === g}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      <div className="flex sm:hidden items-center gap-1 px-4 py-2 border-t border-[#2a2b2d]">
        <span className="text-[10px] font-bold tracking-widest uppercase text-white/40 mr-2">Gym</span>
        {GYMS.map(g => (
          <button
            key={g}
            onClick={() => setGym(g)}
            className={`text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-md transition-colors
              ${gym === g ? 'bg-[#3ecf6e]/15 text-[#3ecf6e]' : 'text-white/40 hover:text-white'}`}
            aria-pressed={gym === g}
          >
            {g}
          </button>
        ))}
      </div>
    </nav>
  )
}
