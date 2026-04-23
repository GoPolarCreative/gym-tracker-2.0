import { useState } from 'react'
import { NavBar } from './components/NavBar'
import { WeekBar } from './components/WeekBar'
import { DayPanel } from './components/DayPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { RestPanel } from './components/RestPanel'
import { useWeek } from './hooks/useWeek'

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun' | 'history'

export default function App() {
  const [currentDay, setCurrentDay] = useState<DayKey>('mon')
  const { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek } = useWeek()

  const renderContent = () => {
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
      <WeekBar
        currentWeek={currentWeek}
        totalWeeks={totalWeeks}
        onPrev={goToPrev}
        onNext={goToNext}
        onNewWeek={addNewWeek}
      />
      <main className="max-w-4xl mx-auto px-4 py-6 pb-20">
        {renderContent()}
      </main>
    </div>
  )
}
