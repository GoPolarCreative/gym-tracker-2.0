import { useState } from 'react'
import type { Goal, Experience, Profile } from '../hooks/useProfile'
import type { GymKey } from '../data/plan'

const GOALS: { value: Goal; label: string; blurb: string }[] = [
  { value: 'size', label: 'Build muscle', blurb: 'Hypertrophy focus — moderate reps, more volume.' },
  { value: 'strength', label: 'Get stronger', blurb: 'Heavier compounds, lower reps, longer rest.' },
  { value: 'cut', label: 'Lose fat / get lean', blurb: 'Maintain muscle while in a deficit. Higher rep accessories.' },
  { value: 'general', label: 'General fitness', blurb: 'Balanced strength + size + conditioning.' },
]

const EXPERIENCES: { value: Experience; label: string; blurb: string }[] = [
  { value: 'beginner', label: 'Beginner', blurb: 'Under 1 year of consistent training.' },
  { value: 'intermediate', label: 'Intermediate', blurb: '1–3 years, lifts have stalled at some point.' },
  { value: 'advanced', label: 'Advanced', blurb: '3+ years, in tune with your recovery.' },
]

const DAYS: { value: 3 | 4 | 5 | 6; label: string; blurb: string }[] = [
  { value: 3, label: '3 days', blurb: 'Push / Pull / Legs once each.' },
  { value: 4, label: '4 days', blurb: 'Upper / Lower split, twice through.' },
  { value: 5, label: '5 days', blurb: 'PPL + extra arms/legs.' },
  { value: 6, label: '6 days', blurb: 'PPL twice through.' },
]

const GYMS: { value: GymKey; label: string; blurb: string }[] = [
  { value: 'Jetts', label: 'Jetts', blurb: 'Pin-number machines.' },
  { value: 'FC', label: 'FC', blurb: 'kg-rated machines.' },
]

const WEEKDAYS: { value: string; label: string; short: string }[] = [
  { value: 'mon', label: 'Monday',    short: 'Mon' },
  { value: 'tue', label: 'Tuesday',   short: 'Tue' },
  { value: 'wed', label: 'Wednesday', short: 'Wed' },
  { value: 'thu', label: 'Thursday',  short: 'Thu' },
  { value: 'fri', label: 'Friday',    short: 'Fri' },
  { value: 'sat', label: 'Saturday',  short: 'Sat' },
  { value: 'sun', label: 'Sunday',    short: 'Sun' },
]

type Props = { onComplete: (p: Profile) => void; onCancel?: () => void; existing?: Profile | null }

export function OnboardingModal({ onComplete, onCancel, existing }: Props) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal | null>(existing?.goal ?? null)
  const [exp, setExp] = useState<Experience | null>(existing?.experience ?? null)
  const [days, setDays] = useState<3 | 4 | 5 | 6 | null>(existing?.daysPerWeek ?? null)
  const [selectedDays, setSelectedDays] = useState<string[]>(existing?.selectedDays ?? [])
  const [gym, setGym] = useState<GymKey | null>(existing?.primaryGym ?? null)

  const TOTAL_STEPS = 5

  const daysOk = days !== null && selectedDays.length === days
  const canAdvance =
    (step === 0 && goal) ||
    (step === 1 && exp) ||
    (step === 2 && days) ||
    (step === 3 && daysOk) ||
    (step === 4 && gym)

  const next = () => {
    if (step < TOTAL_STEPS - 1) {
      // When advancing from days-count, trim selectedDays if it exceeds the new count
      if (step === 2 && days && selectedDays.length > days) {
        setSelectedDays(selectedDays.slice(0, days))
      }
      setStep(step + 1)
    } else if (goal && exp && days && gym && daysOk) {
      onComplete({
        goal, experience: exp, daysPerWeek: days, selectedDays,
        primaryGym: gym,
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
      if (curr.length >= days) return curr  // cap at target count
      return [...curr, d]
    })
  }

  const Card = ({
    selected, onClick, label, blurb,
  }: { selected: boolean; onClick: () => void; label: string; blurb: string }) => (
    <button
      onClick={onClick}
      className={`w-full text-left border rounded-xl p-4 transition-colors ${
        selected
          ? 'border-[#3ecf6e] bg-[#3ecf6e]/10'
          : 'border-[#2a2b2d] hover:border-[#3a3b3e] bg-[#1e2022]'
      }`}
    >
      <div className="text-white font-bold text-base">{label}</div>
      <div className="text-white/55 text-xs font-medium mt-1">{blurb}</div>
    </button>
  )

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#18191b] border border-[#2a2b2d] rounded-2xl overflow-hidden shadow-2xl">
        <div className="px-5 py-4 border-b border-[#2a2b2d] flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs font-bold tracking-widest uppercase text-white/40">Step {step + 1} of {TOTAL_STEPS}</div>
            <div className="text-white font-bold text-lg mt-0.5">
              {step === 0 && 'What\'s your main goal?'}
              {step === 1 && 'How experienced are you?'}
              {step === 2 && 'How many days a week?'}
              {step === 3 && `Pick your ${days ?? ''} training days`}
              {step === 4 && 'Which gym do you go to most?'}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`w-5 h-1 rounded-full ${i <= step ? 'bg-[#3ecf6e]' : 'bg-[#2a2b2d]'}`}
              />
            ))}
          </div>
        </div>

        <div className="p-5 flex flex-col gap-2.5 max-h-[60vh] overflow-y-auto">
          {step === 0 && GOALS.map(g => (
            <Card key={g.value} selected={goal === g.value} onClick={() => setGoal(g.value)} label={g.label} blurb={g.blurb} />
          ))}
          {step === 1 && EXPERIENCES.map(e => (
            <Card key={e.value} selected={exp === e.value} onClick={() => setExp(e.value)} label={e.label} blurb={e.blurb} />
          ))}
          {step === 2 && DAYS.map(d => (
            <Card key={d.value} selected={days === d.value} onClick={() => { setDays(d.value); setSelectedDays([]) }} label={d.label} blurb={d.blurb} />
          ))}
          {step === 3 && (
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
          {step === 4 && GYMS.map(g => (
            <Card key={g.value} selected={gym === g.value} onClick={() => setGym(g.value)} label={g.label} blurb={g.blurb} />
          ))}
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
            disabled={!canAdvance}
            className="bg-[#3ecf6e] text-[#111213] font-bold text-sm tracking-widest uppercase px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === TOTAL_STEPS - 1 ? 'Start Training' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
