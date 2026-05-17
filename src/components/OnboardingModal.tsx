import { useState } from 'react'
import type { Goal, Experience, MachineLabel, Profile } from '../hooks/useProfile'

const DAYS_OPTS: { value: 3 | 4 | 5 | 6; label: string; blurb: string }[] = [
  { value: 3, label: '3 days', blurb: 'Full Body — every session hits every major group.' },
  { value: 4, label: '4 days', blurb: 'Upper / Lower split, twice through.' },
  { value: 5, label: '5 days', blurb: 'Push / Pull / Legs + Arms + extra Legs.' },
  { value: 6, label: '6 days', blurb: 'PPL twice — slightly higher rep B days.' },
]

const GOAL_OPTS: { value: Goal; label: string; blurb: string }[] = [
  { value: 'build_muscle',   label: 'Build Muscle',   blurb: 'Hypertrophy focus.' },
  { value: 'build_strength', label: 'Build Strength', blurb: 'Heavier compounds, lower reps emphasised.' },
  { value: 'general',        label: 'General Fitness', blurb: 'Balanced strength + size.' },
]

const EXP_OPTS: { value: Experience; label: string; blurb: string }[] = [
  { value: 'beginner',     label: 'Beginner',     blurb: 'Under 1 year of consistent training.' },
  { value: 'intermediate', label: 'Intermediate', blurb: '1–3 years, used to a routine.' },
  { value: 'advanced',     label: 'Advanced',     blurb: '3+ years, in tune with your recovery.' },
]

const LABEL_OPTS: { value: MachineLabel; label: string; blurb: string }[] = [
  { value: 'pin', label: 'Number / Pin', blurb: 'Your machines show pin numbers (1, 2, 3…).' },
  { value: 'kg',  label: 'KG Labelled',  blurb: 'Your machines show actual kg ratings.' },
]

const YESNO: { value: boolean; label: string; blurb: string }[] = [
  { value: true,  label: 'Yes', blurb: '~15 min added to one session per week.' },
  { value: false, label: 'No',  blurb: 'Skip the finisher.' },
]

const WEEKDAYS: { value: string; short: string }[] = [
  { value: 'mon', short: 'Mon' },
  { value: 'tue', short: 'Tue' },
  { value: 'wed', short: 'Wed' },
  { value: 'thu', short: 'Thu' },
  { value: 'fri', short: 'Fri' },
  { value: 'sat', short: 'Sat' },
  { value: 'sun', short: 'Sun' },
]

type Props = { onComplete: (p: Profile) => void; onCancel?: () => void; existing?: Profile | null }

export function OnboardingModal({ onComplete, onCancel, existing }: Props) {
  const [step, setStep] = useState(0)
  const [days, setDays] = useState<3 | 4 | 5 | 6 | null>(existing?.daysPerWeek ?? null)
  const [goal, setGoal] = useState<Goal | null>(existing?.goal ?? null)
  const [exp, setExp] = useState<Experience | null>(existing?.experience ?? null)
  const [label, setLabel] = useState<MachineLabel | null>(existing?.machineLabel ?? null)
  const [coreFin, setCoreFin] = useState<boolean | null>(existing?.coreFinisher ?? null)
  const [calfFin, setCalfFin] = useState<boolean | null>(existing?.calfFinisher ?? null)
  const [selectedDays, setSelectedDays] = useState<string[]>(existing?.selectedDays ?? [])

  const TOTAL_STEPS = 7
  const daysOk = days !== null && selectedDays.length === days

  const stepValid = () => {
    if (step === 0) return days !== null
    if (step === 1) return goal !== null
    if (step === 2) return exp !== null
    if (step === 3) return label !== null
    if (step === 4) return coreFin !== null
    if (step === 5) return calfFin !== null
    if (step === 6) return daysOk
    return false
  }

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      if (step === 0 && days && selectedDays.length > days) {
        setSelectedDays(selectedDays.slice(0, days))
      }
      setStep(step + 1)
    } else if (
      days !== null && goal !== null && exp !== null &&
      label !== null && coreFin !== null && calfFin !== null && daysOk
    ) {
      onComplete({
        daysPerWeek: days,
        goal, experience: exp,
        machineLabel: label,
        coreFinisher: coreFin,
        calfFinisher: calfFin,
        selectedDays,
        startedAt: existing?.startedAt ?? new Date().toISOString(),
        completed: true,
      })
    }
  }

  const back = () => step > 0 && setStep(step - 1)

  const toggleDay = (d: string) => {
    if (!days) return
    setSelectedDays(curr => {
      if (curr.includes(d)) return curr.filter(x => x !== d)
      if (curr.length >= days) return curr
      return [...curr, d]
    })
  }

  const Card = ({
    selected, onClick, label: cardLabel, blurb,
  }: { selected: boolean; onClick: () => void; label: string; blurb: string }) => (
    <button
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-4 transition-colors ${
        selected
          ? 'border-[#3ecf6e] bg-[#3ecf6e]/10'
          : 'border-[#2a2b2d] hover:border-[#3a3b3e] bg-[#1e2022]'
      }`}
    >
      <div className="text-white font-bold text-base">{cardLabel}</div>
      <div className="text-white/55 text-xs font-medium mt-1">{blurb}</div>
    </button>
  )

  const stepTitle = () => {
    switch (step) {
      case 0: return 'How many days a week?'
      case 1: return 'Main goal?'
      case 2: return 'Experience level?'
      case 3: return 'Machine labelling?'
      case 4: return 'Add a core finisher? (~15 min)'
      case 5: return 'Add a calf finisher? (~15 min)'
      case 6: return `Pick your ${days ?? ''} training days`
    }
    return ''
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18191b] border border-[#2a2b2d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#2a2b2d] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold tracking-widest uppercase text-white/40">Step {step + 1} of {TOTAL_STEPS}</div>
            <div className="text-white font-bold text-lg mt-0.5">{stepTitle()}</div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div key={i} className={`w-4 h-1 rounded-full ${i <= step ? 'bg-[#3ecf6e]' : 'bg-[#2a2b2d]'}`} />
            ))}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
          {step === 0 && DAYS_OPTS.map(d => (
            <Card key={d.value} selected={days === d.value} onClick={() => { setDays(d.value); setSelectedDays([]) }} label={d.label} blurb={d.blurb} />
          ))}
          {step === 1 && GOAL_OPTS.map(g => (
            <Card key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} label={g.label} blurb={g.blurb} />
          ))}
          {step === 2 && EXP_OPTS.map(e => (
            <Card key={e.value} selected={exp === e.value} onClick={() => setExp(e.value)} label={e.label} blurb={e.blurb} />
          ))}
          {step === 3 && LABEL_OPTS.map(l => (
            <Card key={l.value} selected={label === l.value} onClick={() => setLabel(l.value)} label={l.label} blurb={l.blurb} />
          ))}
          {step === 4 && YESNO.map(o => (
            <Card key={String(o.value)} selected={coreFin === o.value} onClick={() => setCoreFin(o.value)} label={o.label} blurb={o.blurb} />
          ))}
          {step === 5 && YESNO.map(o => (
            <Card key={String(o.value)} selected={calfFin === o.value} onClick={() => setCalfFin(o.value)} label={o.label} blurb={o.blurb} />
          ))}
          {step === 6 && (
            <div>
              <div className="text-xs font-medium text-white/55 mb-3">
                Pick {days} weekdays you'll train. Tap to toggle.
                <span className="ml-2 text-white/40">({selectedDays.length}/{days})</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {WEEKDAYS.map(d => {
                  const on = selectedDays.includes(d.value)
                  const atCap = !on && days !== null && selectedDays.length >= days
                  return (
                    <button
                      key={d.value}
                      onClick={() => toggleDay(d.value)}
                      disabled={atCap}
                      className={`py-3 rounded-xl border text-sm font-bold tracking-wider uppercase transition-colors
                        ${on
                          ? 'border-[#3ecf6e] bg-[#3ecf6e]/15 text-[#3ecf6e]'
                          : atCap
                            ? 'border-[#2a2b2d] text-white/20 cursor-not-allowed'
                            : 'border-[#2a2b2d] hover:border-[#3a3b3e] bg-[#1e2022] text-white/80'
                        }`}
                    >
                      {d.short}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[#2a2b2d] flex justify-between items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={back}
              disabled={step === 0}
              className="text-white/60 hover:text-white text-sm font-semibold tracking-widest uppercase px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {onCancel && (
              <button
                onClick={onCancel}
                className="text-white/40 hover:text-white text-sm font-semibold tracking-widest uppercase px-3 py-2"
              >
                Cancel
              </button>
            )}
          </div>
          <button
            onClick={next}
            disabled={!stepValid()}
            className="bg-[#3ecf6e] text-[#111213] font-bold text-sm tracking-widest uppercase px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === TOTAL_STEPS - 1 ? 'Start Training' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
