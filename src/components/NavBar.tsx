import type { WorkoutType } from '../lib/planGenerator'

// Tab keys are now arbitrary strings: 'history' | 'body' | 'settings' | 'build'
// plus day keys ('mon'..'sun' for the questionnaire plan, or custom plan day ids).
export type AppTab = string

export type DayTabSpec = {
  key: string
  shortLabel: string
  typeLabel?: string  // optional second line / chip ("Push", "Rest", etc)
  activeClass: string
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

const SHORT_LABELS: Record<string, string> = {
  mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun',
}

const STATIC_TAB_COLORS = {
  history:  'border-[#a78bfa] text-[#a78bfa]',
  body:     'border-[#3ecf6e] text-[#3ecf6e]',
  settings: 'border-white text-white',
  build:    'border-[#4a9eff] text-[#4a9eff]',
  rest:     'border-white text-white',
  custom:   'border-[#4a9eff] text-[#4a9eff]',
}

// Build day tabs for the questionnaire plan (weekday-based).
export function buildQuestionnaireDayTabs(dayTypes: Record<string, WorkoutType>): DayTabSpec[] {
  const WEEKDAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
  return WEEKDAY_KEYS.map(d => {
    const wt = dayTypes[d]
    if (wt) {
      return {
        key: d,
        shortLabel: SHORT_LABELS[d],
        typeLabel: TYPE_DISPLAY_SHORT[wt],
        activeClass: TYPE_COLOR[wt],
      }
    }
    return {
      key: d,
      shortLabel: SHORT_LABELS[d],
      typeLabel: 'Rest',
      activeClass: STATIC_TAB_COLORS.rest,
    }
  })
}

// Build day tabs for a custom plan (one per CustomDay).
export function buildCustomDayTabs(
  days: { id: string; name: string }[]
): DayTabSpec[] {
  return days.map(d => ({
    key: d.id,
    shortLabel: d.name,
    activeClass: STATIC_TAB_COLORS.custom,
  }))
}

type Props = {
  currentTab: AppTab
  setCurrentTab: (t: AppTab) => void
  dayTabs: DayTabSpec[]
  onHome: () => void
  showBuildTab?: boolean
}

export function NavBar({ currentTab, setCurrentTab, dayTabs, onHome, showBuildTab }: Props) {
  const extraTabs: DayTabSpec[] = [
    { key: 'body',     shortLabel: 'Body',     activeClass: STATIC_TAB_COLORS.body },
    { key: 'history',  shortLabel: 'History',  activeClass: STATIC_TAB_COLORS.history },
    { key: 'settings', shortLabel: '⚙',        activeClass: STATIC_TAB_COLORS.settings },
  ]
  if (showBuildTab) {
    extraTabs.unshift({ key: 'build', shortLabel: 'Build', activeClass: STATIC_TAB_COLORS.build })
  }

  const allTabs = [...dayTabs, ...extraTabs]

  return (
    <nav className="bg-[#18191b] border-b border-[#2a2b2d] sticky top-0 z-50">
      <div className="flex items-center px-4">
        <button
          onClick={onHome}
          className="text-xl font-bold tracking-widest text-white pr-4 border-r border-[#2a2b2d] mr-1 py-4 whitespace-nowrap hover:text-[#3ecf6e] transition-colors"
          aria-label="Back to dashboard"
        >
          PPL
        </button>
        <div className="flex overflow-x-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          {allTabs.map(tab => {
            const isActive = currentTab === tab.key
            const cls = isActive ? tab.activeClass : 'border-transparent text-white/60 hover:text-white'
            const label = tab.typeLabel ? `${tab.shortLabel} · ${tab.typeLabel}` : tab.shortLabel
            return (
              <button
                key={tab.key}
                onClick={() => setCurrentTab(tab.key)}
                className={`px-3 py-4 text-xs font-semibold tracking-widest uppercase whitespace-nowrap border-b-2 transition-colors ${cls}`}
              >
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
