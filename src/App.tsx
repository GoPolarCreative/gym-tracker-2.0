import { useState } from 'react'
import { NavBar } from './components/NavBar'
import { WeekBar } from './components/WeekBar'
import { DayPanel } from './components/DayPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { RestPanel } from './components/RestPanel'
import { BodyPanel } from './components/BodyPanel'
import { OnboardingModal } from './components/OnboardingModal'
import { useWeek } from './hooks/useWeek'
import { useProfile } from './hooks/useProfile'
import { useGym } from './hooks/useGym'

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'history' | 'body'

export default function App() {
  const [currentDay, setCurrentDay] = useState<DayKey>('mon')
  const { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek } = useWeek()
  const { profile, save } = useProfile()
  const [, setGym] = useGym()

  const showOnboarding = !profile?.completed

  const renderContent = () => {
    if (currentDay === 'body') {
      return <BodyPanel />
    }
    if (currentDay === 'history') {
      return <HistoryPanel totalWeeks={totalWeeks} />
    }
    if (currentDay === 'thu') {
      return <RestPanel message="Rest Day" sub="Recovery is where growth happens. Sleep, eat, hydrate." />
    }
    if (currentDay === 'sun') {
      return <RestPanel message="Rest Day" sub="Full week complete. Reset and go again." />
    }
    return <DayPanel day={currentDay} week={currentWeek} />
  }

  return (
    <div className="min-h-screen bg-[#111213] text-white">
      <NavBar currentDay={currentDay} setCurrentDay={d => setCurrentDay(d as DayKey)} />
      {currentDay !== 'body' && (
        <WeekBar
          currentWeek={currentWeek}
          totalWeeks={totalWeeks}
          onPrev={goToPrev}
          onNext={goToNext}
          onNewWeek={addNewWeek}
        />
      )}
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {renderContent()}
      </main>

      {showOnboarding && (
        <OnboardingModal
          onComplete={p => {
            save(p)
            setGym(p.primaryGym)
          }}
        />
      )}
    </div>
  )
}
