import { useState } from 'react'
import type { Profile } from '../hooks/useProfile'

const GOAL_LABEL: Record<string, string> = {
  build_muscle: 'Build Muscle',
  build_strength: 'Build Strength',
  general: 'General Fitness',
}

const EXP_LABEL: Record<string, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
}

const LABEL_DISPLAY: Record<string, string> = {
  pin: 'Number / Pin',
  kg: 'KG Labelled',
}

const DAY_FULL: Record<string, string> = {
  mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday',
  fri: 'Friday', sat: 'Saturday', sun: 'Sunday',
}

type Props = {
  profile: Profile | null
  onEdit: () => void
  onWipeAll: () => void
}

export function SettingsPanel({ profile, onEdit, onWipeAll }: Props) {
  const [confirmWipe, setConfirmWipe] = useState(false)

  return (
    <div>
      <h2 className="text-5xl font-extrabold tracking-wide uppercase text-white mb-6">
        Settings
      </h2>

      <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-[#1e2022] border-b border-[#2a2b2d] text-xs font-bold tracking-widest uppercase text-white/60">
          Your Plan
        </div>
        {profile ? (
          <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Frequency</div>
              <div className="text-white font-semibold">{profile.daysPerWeek} days/week</div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Goal</div>
              <div className="text-white font-semibold">{GOAL_LABEL[profile.goal]}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Experience</div>
              <div className="text-white font-semibold">{EXP_LABEL[profile.experience]}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Machine labelling</div>
              <div className="text-white font-semibold">{LABEL_DISPLAY[profile.machineLabel]}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Core finisher</div>
              <div className="text-white font-semibold">{profile.coreFinisher ? 'On' : 'Off'}</div>
            </div>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Calf finisher</div>
              <div className="text-white font-semibold">{profile.calfFinisher ? 'On' : 'Off'}</div>
            </div>
            <div className="col-span-2">
              <div className="text-[10px] font-bold tracking-widest uppercase text-white/40 mb-0.5">Training days</div>
              <div className="text-white font-semibold">
                {profile.selectedDays.map(d => DAY_FULL[d]).join(', ') || '—'}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-white/50 text-sm font-medium">
            No profile yet — complete the questionnaire to generate a plan.
          </div>
        )}
      </div>

      <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-[#1e2022] border-b border-[#2a2b2d] text-xs font-bold tracking-widest uppercase text-white/60">
          Edit your plan
        </div>
        <div className="p-4">
          <p className="text-white/55 text-xs font-medium mb-3">
            Re-run the questionnaire to change any answer. Your existing logged data stays put.
          </p>
          <button
            onClick={onEdit}
            className="bg-[#4a9eff] text-[#111213] font-bold text-sm tracking-widest uppercase px-5 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
          >
            Re-run Questionnaire
          </button>
        </div>
      </div>

      <div className="bg-[#18191b] border border-[#ff6b6b]/30 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-[#ff6b6b]/10 border-b border-[#ff6b6b]/20 text-xs font-bold tracking-widest uppercase text-[#ff6b6b]">
          Danger zone
        </div>
        <div className="p-4">
          <p className="text-white/55 text-xs font-medium mb-3">
            Wipes every set, note, bodyweight entry, swap, and the active plan. Use this if you want a totally clean slate.
          </p>
          {confirmWipe ? (
            <div className="flex gap-2 items-center flex-wrap">
              <span className="text-[#ff6b6b] text-sm font-semibold">Are you sure?</span>
              <button
                onClick={() => { onWipeAll(); setConfirmWipe(false) }}
                className="bg-[#ff6b6b] text-[#111213] font-bold text-xs tracking-widest uppercase px-4 py-2 rounded-md hover:opacity-85 transition-opacity"
              >
                Yes, wipe everything
              </button>
              <button
                onClick={() => setConfirmWipe(false)}
                className="text-white/50 hover:text-white text-xs font-semibold tracking-widest uppercase px-3 py-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmWipe(true)}
              className="border border-[#ff6b6b]/50 text-[#ff6b6b] font-bold text-sm tracking-widest uppercase px-5 py-2.5 rounded-lg hover:bg-[#ff6b6b]/10 transition-colors"
            >
              Wipe all data
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
