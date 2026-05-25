import { useEffect, useMemo, useState } from 'react'
import {
  NavBar,
  buildQuestionnaireDayTabs,
  buildCustomDayTabs,
  type AppTab,
  type DayTabSpec,
} from './components/NavBar'
import { WeekBar } from './components/WeekBar'
import { DayPanel } from './components/DayPanel'
import { HistoryPanel } from './components/HistoryPanel'
import { RestPanel } from './components/RestPanel'
import { BodyPanel } from './components/BodyPanel'
import { OnboardingModal } from './components/OnboardingModal'
import { SettingsPanel } from './components/SettingsPanel'
import { Dashboard } from './components/Dashboard'
import { BuildWorkoutPanel } from './components/BuildWorkoutPanel'
import { useWeek } from './hooks/useWeek'
import { useProfile, type Profile } from './hooks/useProfile'
import { useUserPlan, wipeWorkoutData } from './hooks/useUserPlan'
import { useActivePlan } from './hooks/useActivePlan'
import { useCustomPlans } from './hooks/useCustomPlans'
import { customPlanToPlanMap } from './lib/customPlanToPlanMap'
import type { PlanMap } from './data/plan'
import type { WorkoutType } from './lib/planGenerator'

export default function App() {
  const [currentTab, setCurrentTab] = useState<AppTab>('dashboard')
  const { currentWeek, totalWeeks, goToPrev, goToNext, addNewWeek } = useWeek()
  const { profile, save, reset } = useProfile()
  const { userPlan, regenerate, clear } = useUserPlan()
  const { active, setActive } = useActivePlan()
  const { getById } = useCustomPlans()
  const [editingProfile, setEditingProfile] = useState(false)
  const [pendingQuestionnaire, setPendingQuestionnaire] = useState(false)

  // Resolve the *active* plan into the shape DayPanel / HistoryPanel expect.
  const resolvedPlan = useMemo<{
    plan: PlanMap | null
    dayKeys: string[]
    dayNames: Record<string, string>
    dayTypes: Record<string, WorkoutType>
    trainingDays: string[]
    isCustom: boolean
  }>(() => {
    if (active?.source === 'custom') {
      const cp = getById(active.planId)
      if (cp) {
        const { plan, dayKeys, dayNames } = customPlanToPlanMap(cp)
        return {
          plan,
          dayKeys,
          dayNames,
          dayTypes: {},
          trainingDays: dayKeys,
          isCustom: true,
        }
      }
    }
    // Default to the questionnaire plan.
    return {
      plan: userPlan?.plan ?? null,
      dayKeys: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      dayNames: {},
      dayTypes: userPlan?.dayTypes ?? {},
      trainingDays: userPlan?.trainingDays ?? [],
      isCustom: false,
    }
  }, [active, userPlan, getById])

  const isTrainingDay = (d: string) =>
    resolvedPlan.isCustom
      ? resolvedPlan.dayKeys.includes(d)
      : resolvedPlan.trainingDays.includes(d)

  // If a profile exists but no plan has been generated yet, synthesize one.
  useEffect(() => {
    if (profile?.completed && profile.selectedDays.length > 0 && !userPlan) {
      regenerate(profile)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.completed])

  const showOnboarding = (!profile?.completed && pendingQuestionnaire) || editingProfile

  const handleProfileComplete = (p: Profile) => {
    save(p)
    const gen = regenerate(p)
    setEditingProfile(false)
    setPendingQuestionnaire(false)
    setActive({ source: 'questionnaire' })
    if (gen.trainingDays[0]) {
      setCurrentTab(gen.trainingDays[0])
    }
  }

  const handleWipeAll = () => {
    wipeWorkoutData()
    clear()
    reset()
    setActive(null)
    setCurrentTab('dashboard')
    window.location.reload()
  }

  // "Clear All History" from the dashboard: wipes logged sets, notes, bodyweight,
  // swaps. Keeps the questionnaire profile, the generated plan, and any custom plans.
  const handleClearHistory = () => {
    wipeWorkoutData()
    window.location.reload()
  }

  // --- Dashboard wiring ---

  const goToCustomWorkout = () => {
    if (!profile?.completed) {
      // Need the questionnaire first.
      setPendingQuestionnaire(true)
      return
    }
    setActive({ source: 'questionnaire' })
    const firstDay = userPlan?.trainingDays?.[0] ?? 'mon'
    setCurrentTab(firstDay)
  }

  const goToBuildWorkout = () => {
    setCurrentTab('build')
  }

  const goToHistory = () => {
    setCurrentTab('history')
  }

  const goToBody = () => {
    setCurrentTab('body')
  }

  const goHome = () => {
    setCurrentTab('dashboard')
  }

  const handleActivateCustom = (planId: string) => {
    setActive({ source: 'custom', planId })
    const cp = getById(planId)
    if (cp && cp.days.length > 0) {
      setCurrentTab(cp.days[0].id)
    }
  }

  // --- Render ---

  const renderContent = () => {
    if (currentTab === 'dashboard') {
      return (
        <Dashboard
          onCustomWorkout={goToCustomWorkout}
          onBuildWorkout={goToBuildWorkout}
          onHistory={goToHistory}
          onBodyWeight={goToBody}
          onClearHistory={handleClearHistory}
        />
      )
    }

    if (currentTab === 'build') {
      return <BuildWorkoutPanel onActivate={handleActivateCustom} />
    }

    if (currentTab === 'body') return <BodyPanel />

    if (currentTab === 'settings') {
      return (
        <SettingsPanel
          profile={profile}
          onEdit={() => setEditingProfile(true)}
          onWipeAll={handleWipeAll}
        />
      )
    }

    if (currentTab === 'history') {
      return (
        <HistoryPanel
          totalWeeks={totalWeeks}
          userPlan={resolvedPlan.plan}
          dayTypes={resolvedPlan.dayTypes}
          trainingDays={resolvedPlan.trainingDays}
          dayNames={resolvedPlan.isCustom ? resolvedPlan.dayNames : undefined}
        />
      )
    }

    // Otherwise, it's a day tab.
    if (!isTrainingDay(currentTab)) {
      return <RestPanel message="Rest Day" sub="Recovery is where growth happens. Sleep, eat, hydrate." />
    }
    return (
      <DayPanel
        day={currentTab}
        week={currentWeek}
        userPlan={resolvedPlan.plan}
        workoutType={resolvedPlan.dayTypes[currentTab]}
        displayName={resolvedPlan.isCustom ? resolvedPlan.dayNames[currentTab] : undefined}
      />
    )
  }

  const isDashboard = currentTab === 'dashboard'
  const showWeekBar =
    !isDashboard &&
    currentTab !== 'body' &&
    currentTab !== 'settings' &&
    currentTab !== 'build'

  const dayTabs: DayTabSpec[] = resolvedPlan.isCustom
    ? buildCustomDayTabs(
        resolvedPlan.dayKeys.map(k => ({ id: k, name: resolvedPlan.dayNames[k] ?? k }))
      )
    : buildQuestionnaireDayTabs(resolvedPlan.dayTypes)

  return (
    <div className="min-h-screen bg-[#111213] text-white">
      {!isDashboard && (
        <NavBar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          dayTabs={dayTabs}
          onHome={goHome}
          showBuildTab={currentTab === 'build'}
        />
      )}
      {showWeekBar && (
        <WeekBar
          currentWeek={currentWeek}
          totalWeeks={totalWeeks}
          onPrev={goToPrev}
          onNext={goToNext}
          onNewWeek={addNewWeek}
        />
      )}
      <main className={isDashboard ? '' : 'max-w-4xl mx-auto px-4 py-6 pb-20'}>
        {renderContent()}
      </main>

      {showOnboarding && (
        <OnboardingModal
          existing={profile ?? null}
          onComplete={handleProfileComplete}
          onCancel={
            editingProfile
              ? () => setEditingProfile(false)
              : () => {
                  setPendingQuestionnaire(false)
                  setCurrentTab('dashboard')
                }
          }
        />
      )}
    </div>
  )
}
