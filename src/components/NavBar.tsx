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
  'Full Body': 'Full',
  'Upper': 'Upper',
  'Lower': 'Lower',
  'Push': 'Push',
  'Pull': 'Pull',
  'Legs (Quad)': 'Legs Q',
  'Arms': 'Arms',
  'Legs (Ham)': 'Legs H',
  'Push A': 'Push A',
  'Pull A': 'Pull A',
  'Legs A': 'Legs A',
  'Push B': 'Push B',
  'Pull B': 'Pull B',
  'Legs B': 'Legs B',
}

const TYPE_COLOR: Record<WorkoutType, string> = {
  'Full Body': 'border-[#a78bfa] text-[#a78bfa]',
  'Upper': 'border-[#4a9eff] text-[#4a9eff]',
  'Lower': 'border-[#3ecf6e] text-[#3ecf6e]',
  'Push': 'border-[#f0a500] text-[#f0a500]',
  'Pull': 'border-[#4a9eff] text-[#4a9eff]',
  'Legs (Quad)': 'border-[#3ecf6e] text-[#3ecf6e]',
  'Arms': 'border-[#ff6b6b] text-[#ff6b6b]',
  'Legs (Ham)': 'border-[#3ecf6e] text-[#3ecf6e]',
  'Push A': 'border-[#f0a500] text-[#f0a500]',
  'Pull A': 'border-[#4a9eff] text-[#4a9eff]',
  'Legs A': 'border-[#3ecf6e] text-[#3ecf6e]',
  'Push B': 'border-[#f0a500] text-[#f0a500]',
  'Pull B': 'border-[#4a9eff] text-[#4a9eff]',
  'Legs B': 'border-[#3ecf6e] text-[#3ecf6e]',
}

const STATIC_TAB_COLORS: Record<string, string> = {
  history: 'border-[#a78bfa] text-[#a78bfa]',
  body: 'border-[#3ecf6e] text-[#3ecf6e]',
  settings: 'border-white text-white',
  rest: 'border-white text-white',
}

type Props = {
  currentTab: AppTab
  setCurrentTab: (t: AppTab) => void
  dayTypes: Record<string, WorkoutType>
}

export function NavBar({ currentTab, setCurrentTab, dayTypes }: Props) {
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
    { key: 'settings', label: '⚙',       activeClass: STATIC_TAB_COLORS.settings },
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
      </div>
    </nav>
  )
}
