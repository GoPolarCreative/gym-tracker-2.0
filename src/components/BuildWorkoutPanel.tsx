import { useState } from 'react'
import { useCustomPlans, newId, type CustomPlan, type CustomDay, type CustomExercise } from '../hooks/useCustomPlans'

type Props = {
  onActivate: (planId: string) => void
}

type WizardStep =
  | { kind: 'planName' }
  | { kind: 'dayName' }
  | { kind: 'exerciseName' }
  | { kind: 'setsReps'; exerciseName: string }

export function BuildWorkoutPanel({ onActivate }: Props) {
  const { plans, save, remove } = useCustomPlans()
  const [mode, setMode] = useState<'list' | 'wizard'>('list')

  // wizard state
  const [step, setStep] = useState<WizardStep>({ kind: 'planName' })
  const [planName, setPlanName] = useState('')
  const [days, setDays] = useState<CustomDay[]>([])           // days completed so far
  const [currentDay, setCurrentDay] = useState<CustomDay | null>(null)  // day being built
  const [dayInput, setDayInput] = useState('')
  const [exerciseInput, setExerciseInput] = useState('')
  const [setsInput, setSetsInput] = useState('')
  const [repsInput, setRepsInput] = useState('')

  const resetWizard = () => {
    setStep({ kind: 'planName' })
    setPlanName('')
    setDays([])
    setCurrentDay(null)
    setDayInput('')
    setExerciseInput('')
    setSetsInput('')
    setRepsInput('')
  }

  const startWizard = () => {
    resetWizard()
    setMode('wizard')
  }

  const exitWizard = () => {
    resetWizard()
    setMode('list')
  }

  // --- wizard step handlers ---

  const savePlanName = () => {
    if (!planName.trim()) return
    setStep({ kind: 'dayName' })
  }

  const saveDayName = () => {
    if (!dayInput.trim()) return
    setCurrentDay({ id: newId('d_'), name: dayInput.trim(), exercises: [] })
    setDayInput('')
    setStep({ kind: 'exerciseName' })
  }

  const saveExerciseName = () => {
    if (!exerciseInput.trim()) return
    setStep({ kind: 'setsReps', exerciseName: exerciseInput.trim() })
    setExerciseInput('')
  }

  const saveSetsReps = () => {
    const setsNum = parseInt(setsInput, 10)
    if (!Number.isFinite(setsNum) || setsNum <= 0) return
    if (!repsInput.trim()) return
    if (step.kind !== 'setsReps' || !currentDay) return

    const exercise: CustomExercise = {
      id: newId('e_'),
      name: step.exerciseName,
      sets: setsNum,
      target: repsInput.trim().toLowerCase().includes('rep') ? repsInput.trim() : `${repsInput.trim()} reps`,
    }
    setCurrentDay({ ...currentDay, exercises: [...currentDay.exercises, exercise] })
    setSetsInput('')
    setRepsInput('')
    setStep({ kind: 'exerciseName' })
  }

  const addAnotherDay = () => {
    if (!currentDay) return
    if (currentDay.exercises.length === 0) return  // require at least one exercise
    setDays([...days, currentDay])
    setCurrentDay(null)
    setDayInput('')
    setStep({ kind: 'dayName' })
  }

  const saveWholePlan = () => {
    const finalDays = currentDay && currentDay.exercises.length > 0
      ? [...days, currentDay]
      : days
    if (finalDays.length === 0) return

    const plan: CustomPlan = {
      id: newId('p_'),
      name: planName.trim() || 'Untitled Plan',
      days: finalDays,
      createdAt: new Date().toISOString(),
    }
    save(plan)
    exitWizard()
  }

  // --- renderers ---

  if (mode === 'list') {
    return (
      <div>
        <h2 className="text-4xl sm:text-5xl font-extrabold tracking-wide uppercase text-[#4a9eff] mb-6">
          Build a Workout
        </h2>

        <button
          onClick={startWizard}
          className="w-full text-left bg-[#18191b] border border-dashed border-[#4a9eff]/60 hover:border-[#4a9eff] hover:bg-[#4a9eff]/5 rounded-xl px-5 py-5 transition-colors mb-6"
        >
          <div className="text-[#4a9eff] font-extrabold text-base sm:text-lg tracking-wide uppercase">
            + Create Your Own Plan
          </div>
          <div className="text-white/55 text-sm font-medium mt-1">
            Build a plan from scratch, day by day.
          </div>
        </button>

        <div className="text-xs font-bold tracking-widest uppercase text-white/50 mb-3">
          Your saved plans
        </div>
        {plans.length === 0 ? (
          <div className="text-center py-12 text-white/40 text-sm font-medium">
            You haven't built any plans yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {plans.map(p => (
              <div key={p.id} className="bg-[#18191b] border border-[#2a2b2d] rounded-xl overflow-hidden">
                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-base truncate">{p.name}</div>
                    <div className="text-white/50 text-xs font-medium mt-0.5">
                      {p.days.length} day{p.days.length === 1 ? '' : 's'} · {p.days.reduce((n, d) => n + d.exercises.length, 0)} exercises
                    </div>
                  </div>
                  <button
                    onClick={() => onActivate(p.id)}
                    className="bg-[#3ecf6e] text-[#111213] font-bold text-xs tracking-widest uppercase px-3 py-2 rounded-md hover:opacity-85 transition-opacity"
                  >
                    Use
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${p.name}"? Logged data for this plan is kept.`)) remove(p.id)
                    }}
                    className="text-white/40 hover:text-[#ff6b6b] text-xs font-semibold tracking-wider uppercase px-2 py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // wizard mode
  const inputCls =
    'w-full bg-[#1e2022] text-white border border-[#2a2b2d] rounded-lg h-12 px-4 text-base font-semibold focus:outline-none focus:border-[#4a9eff] placeholder:text-white/30'

  const primaryBtn =
    'bg-[#3ecf6e] text-[#111213] font-bold text-sm tracking-widest uppercase px-5 py-3 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed'

  // Sub-header showing context the user has built so far in the wizard
  const SummaryStrip = () => {
    if (!planName) return null
    const dayCount = days.length + (currentDay ? 1 : 0)
    const exerciseCount = days.reduce((n, d) => n + d.exercises.length, 0) + (currentDay?.exercises.length ?? 0)
    return (
      <div className="bg-[#1e2022] border border-[#2a2b2d] rounded-lg px-4 py-2.5 mb-4 text-xs font-semibold tracking-wider uppercase text-white/60 flex flex-wrap gap-x-4 gap-y-1">
        <span>Plan: <span className="text-white">{planName}</span></span>
        {dayCount > 0 && <span>Days: <span className="text-white">{dayCount}</span></span>}
        {exerciseCount > 0 && <span>Exercises: <span className="text-white">{exerciseCount}</span></span>}
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide uppercase text-[#4a9eff]">
          {step.kind === 'planName' ? 'Name your plan'
            : step.kind === 'dayName' ? 'Add a Day'
            : step.kind === 'exerciseName' ? 'Add a Workout'
            : 'Set & Rep Range'}
        </h2>
        <button
          onClick={exitWizard}
          className="text-white/40 hover:text-white text-xs font-semibold tracking-widest uppercase px-3 py-2"
        >
          Cancel
        </button>
      </div>

      <SummaryStrip />

      {step.kind === 'planName' && (
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            value={planName}
            onChange={e => setPlanName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && savePlanName()}
            placeholder="Plan Name"
            className={inputCls}
          />
          <button onClick={savePlanName} disabled={!planName.trim()} className={primaryBtn}>Save</button>
        </div>
      )}

      {step.kind === 'dayName' && (
        <div className="flex flex-col gap-3">
          <input
            autoFocus
            type="text"
            value={dayInput}
            onChange={e => setDayInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveDayName()}
            placeholder="e.g. Monday"
            className={inputCls}
          />
          <button onClick={saveDayName} disabled={!dayInput.trim()} className={primaryBtn}>Save</button>
        </div>
      )}

      {step.kind === 'exerciseName' && currentDay && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl p-4 mb-1">
            <div className="text-xs font-bold tracking-widest uppercase text-white/40 mb-1">Day in progress</div>
            <div className="text-white font-bold text-base">{currentDay.name}</div>
            {currentDay.exercises.length > 0 && (
              <div className="mt-2 flex flex-col gap-1">
                {currentDay.exercises.map(ex => (
                  <div key={ex.id} className="text-white/70 text-xs font-medium">
                    • {ex.name} <span className="text-white/40">— {ex.sets} × {ex.target}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <input
            autoFocus
            type="text"
            value={exerciseInput}
            onChange={e => setExerciseInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveExerciseName()}
            placeholder="e.g. Barbell Bench Press"
            className={inputCls}
          />
          <button onClick={saveExerciseName} disabled={!exerciseInput.trim()} className={primaryBtn}>Save</button>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            <button
              onClick={addAnotherDay}
              disabled={currentDay.exercises.length === 0}
              className="border border-[#4a9eff]/50 text-[#4a9eff] font-bold text-xs tracking-widest uppercase px-4 py-3 rounded-lg hover:bg-[#4a9eff]/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              + Add Another Day
            </button>
            <button
              onClick={saveWholePlan}
              disabled={(days.length === 0 && currentDay.exercises.length === 0)}
              className="bg-white text-[#111213] font-bold text-xs tracking-widest uppercase px-4 py-3 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save My Workout
            </button>
          </div>
        </div>
      )}

      {step.kind === 'setsReps' && currentDay && (
        <div className="flex flex-col gap-3">
          <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl p-4 mb-1">
            <div className="text-xs font-bold tracking-widest uppercase text-white/40 mb-1">Adding to {currentDay.name}</div>
            <div className="text-white font-bold text-base">{step.exerciseName}</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">Sets</label>
              <input
                autoFocus
                type="number"
                min={1}
                value={setsInput}
                onChange={e => setSetsInput(e.target.value)}
                placeholder="3"
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-white/40 mb-1">Reps</label>
              <input
                type="text"
                value={repsInput}
                onChange={e => setRepsInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && saveSetsReps()}
                placeholder="8-12"
                className={inputCls}
              />
            </div>
          </div>

          <button
            onClick={saveSetsReps}
            disabled={!setsInput || !repsInput.trim()}
            className={primaryBtn}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}
