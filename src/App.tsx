import { useState } from 'react'
import { NavBar, type AppTab } from './components/NavBar'
import { WeekBar } from './components/WeekBar'
import { DayPanel } from './components/DayPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { RestPanel } from './components/RestPanel'
import { BodyPanel } from './components/BodyPanel'
import { OnboardingModal } from './components/OnboardingModal'
import { SettingsPanel } from './components/SettingsPanel'
import { useWeek } from './hooks/useWeek'
import { useProfile } from './hooks/useProfile'
import { useGym } from './hooks/useGym'
import { useUserPlan, wipeWorkoutData } from './hooks/useUserPlan'
import type { Profile } from './hooks/useProfile'

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('mon')
  const { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek } = useWeek()
  const { profile, save, reset } = useProfile()
  const [, setGym] = useGym()
  const { userPlan, regenerate, clear } = useUserPlan()
  const [editingProfile, setEditingProfile] = useState(false)

  const showInitialOnboarding = !profile?.completed && !editingProfile

  const dayTypes = userPlan?.dayTypes ?? {}
  const trainingDays = userPlan?.trainingDays ?? []
  const isTrainingDay = (d: string) => trainingDays.includes(d)

  const handleProfileComplete = (p: Profile) => {
    save(p)
    setGym(p.primaryGym)
    const gen = regenerate(p)
    setEditingProfile(false)
    // Snap to the first training day so user sees their plan immediately
    if (gen.trainingDays[0]) {
      setCurrentTab(gen.trainingDays[0] as AppTab)
    }
  }

  const handleWipeAll = () => {
    wipeWorkoutData()
    clear()
    reset()
    localStorage.removeItem('ppl_bodyweight_v1')
    // Reload so every hook re-reads cleanly; otherwise stale week state lingers.
    window.location.reload()
  }

  const renderContent = () => {
    if (currentTab === 'body')     return <BodyPanel />
    if (currentTab === 'settings') return <SettingsPanel profile={profile} onEdit={() => setEditingProfile(true)} onWipeAll={handleWipeAll} />
    if (currentTab === 'history')  return <HistoryPanel totalWeeks={totalWeeks} userPlan={userPlan?.plan ?? null} dayTypes={dayTypes} trainingDays={trainingDays} />

    // weekday tabs
    if (!isTrainingDay(currentTab)) {
      return <RestPanel message="Rest Day" sub="Recovery is where growth happens. Sleep, eat, hydrate." />
    }
    return <DayPanel day={currentTab} week={currentWeek} userPlan={userPlan?.plan ?? null} workoutType={dayTypes[currentTab]} />
  }

  const showWeekBar = currentTab !== 'body' && currentTab !== 'settings'

  return (
    <div className="min-h-screen bg-[#111213] text-white">
      <NavBar currentTab={currentTab} setCurrentTab={setCurrentTab} dayTypes={dayTypes} />
      {showWeekBar && (
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

      {(showInitialOnboarding || editingProfile) && (
        <OnboardingModal
          // Prefill from an existing profile when editing, or when an older
          // profile is being migrated to the new selectedDays format.
          existing={profile ?? null}
          onComplete={handleProfileComplete}
          onCancel={editingProfile ? () => setEditingProfile(false) : undefined}
        />
      )}
    </div>
  )
}
