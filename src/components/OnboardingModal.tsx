import { useState } from 'react'
import type { Goal, Experience, Profile } from '../hooks/useProfile'
import type { GymKey } from '../data/plan'

const GOALS: { value: Goal; label: string; blurb: string }[] = [
  { value: 'size', label: 'Build muscle', blurb: 'Hypertrophy focus — moderate reps, push volume over time.' },
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
  { value: 3, label: '3 days', blurb: 'Full body or PPL (1 round).' },
  { value: 4, label: '4 days', blurb: 'Upper / lower split.' },
  { value: 5, label: '5 days', blurb: 'PPL + arms/legs accessory (your current plan).' },
  { value: 6, label: '6 days', blurb: 'PPL twice through.' },
]

const GYMS: { value: GymKey; label: string; blurb: string }[] = [
  { value: 'Jetts', label: 'Jetts', blurb: 'Pin-number machines.' },
  { value: 'FC', label: 'FC', blurb: 'kg-rated machines.' },
]

type Props = { onComplete: (p: Profile) => void }

export function OnboardingModal({ onComplete }: Props) {
  const [step, setStep] = useState(0)
  const [goal, setGoal] = useState<Goal | null>(null)
  const [exp, setExp] = useState<Experience | null>(null)
  const [days, setDays] = useState<3 | 4 | 5 | 6 | null>(null)
  const [gym, setGym] = useState<GymKey | null>(null)

  const canAdvance =
    (step === 0 && goal) ||
    (step === 1 && exp) ||
    (step === 2 && days) ||
    (step === 3 && gym)

  const next = () => {
    if (step < 3) {
      setStep(step + 1)
    } else if (goal && exp && days && gym) {
      onComplete({
        goal, experience: exp, daysPerWeek: days, primaryGym: gym,
        startedAt: new Date().toISOString(),
        completed: true,
      })
    }
  }

  const back = () => step > 0 && setStep(step - 1)

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
        <div className="px-5 py-4 border-b border-[#2a2b2d] flex items-center justify-between">
          <div>
            <div className="text-xs font-bold tracking-widest uppercase text-white/40">Step {step + 1} of 4</div>
            <div className="text-white font-bold text-lg mt-0.5">
              {step === 0 && 'What\'s your main goal?'}
              {step === 1 && 'How experienced are you?'}
              {step === 2 && 'How many days a week?'}
              {step === 3 && 'Which gym do you go to most?'}
            </div>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className={`w-6 h-1 rounded-full ${i <= step ? 'bg-[#3ecf6e]' : 'bg-[#2a2b2d]'}`}
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
            <Card key={d.value} selected={days === d.value} onClick={() => setDays(d.value)} label={d.label} blurb={d.blurb} />
          ))}
          {step === 3 && GYMS.map(g => (
            <Card key={g.value} selected={gym === g.value} onClick={() => setGym(g.value)} label={g.label} blurb={g.blurb} />
          ))}
        </div>

        <div className="px-5 py-4 border-t border-[#2a2b2d] flex justify-between gap-3">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-white/60 hover:text-white text-sm font-semibold tracking-widest uppercase px-3 py-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Back
          </button>
          <button
            onClick={next}
            disabled={!canAdvance}
            className="bg-[#3ecf6e] text-[#111213] font-bold text-sm tracking-widest uppercase px-6 py-2.5 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {step === 3 ? 'Start Training' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
