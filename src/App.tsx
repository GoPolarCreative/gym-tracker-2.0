import { useEffect, useState } from 'react'
import { NavBar, type AppTab } from './components/NavBar'
import { WeekBar } from './components/WeekBar'
import { DayPanel } from './components/DayPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { RestPanel } from './components/RestPanel'
import { BodyPanel } from './components/BodyPanel'
import { OnboardingModal } from './components/OnboardingModal'
import { SettingsPanel } from './components/SettingsPanel'
import { useWeek } from './hooks/useWeek'
import { useProfile, type Profile } from './hooks/useProfile'
import { useUserPlan, wipeWorkoutData } from './hooks/useUserPlan'

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('mon')
  const { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek } = useWeek()
  const { profile, save, reset } = useProfile()
  const { userPlan, regenerate, clear } = useUserPlan()
  const [editingProfile, setEditingProfile] = useState(false)

  const showInitialOnboarding = !profile?.completed && !editingProfile

  const dayTypes = userPlan?.dayTypes ?? {}
  const trainingDays = userPlan?.trainingDays ?? []
  const isTrainingDay = (d: string) => trainingDays.includes(d)

  // If a profile exists but no plan has been generated yet (e.g. after migration),
  // synthesize one once on mount.
  useEffect(() => {
    if (profile?.completed && profile.selectedDays.length > 0 && !userPlan) {
      regenerate(profile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.completed])

  const handleProfileComplete = (p: Profile) => {
    save(p)
    const gen = regenerate(p)
    setEditingProfile(false)
    if (gen.trainingDays[0]) {
      setCurrentTab(gen.trainingDays[0] as AppTab)
    }
  }

  const handleWipeAll = () => {
    wipeWorkoutData()
    clear()
    reset()
    window.location.reload()
  }

  const renderContent = () => {
    if (currentTab === 'body')     return <BodyPanel />
    if (currentTab === 'settings') return <SettingsPanel profile={profile} onEdit={() => setEditingProfile(true)} onWipeAll={handleWipeAll} />
    if (currentTab === 'history')  return <HistoryPanel totalWeeks={totalWeeks} userPlan={userPlan?.plan ?? null} dayTypes={dayTypes} trainingDays={trainingDays} />

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
          existing={profile ?? null}
          onComplete={handleProfileComplete}
          onCancel={editingProfile ? () => setEditingProfile(false) : undefined}
        />
      )}
    </div>
  )
}
