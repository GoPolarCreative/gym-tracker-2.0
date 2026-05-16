import { useMemo, useState } from 'react'
import { useBodyweight, type BodyEntry } from '../hooks/useBodyweight'

function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function formatShortDate(iso: string): string {
  // YYYY-MM-DD → "12 Apr"
  const [y, m, d] = iso.split('-').map(Number)
  if (!y || !m || !d) return iso
  const date = new Date(y, m - 1, d)
  return `${date.getDate()} ${date.toLocaleString('en', { month: 'short' })}`
}

function BodyChart({ entries }: { entries: BodyEntry[] }) {
  // Need at least 2 points to draw a meaningful line.
  if (entries.length < 2) {
    return (
      <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl px-4 py-12 text-center text-white/40 text-sm font-medium">
        Log at least 2 weigh-ins to see your trend.
      </div>
    )
  }

  const W = 640
  const H = 220
  const padL = 38
  const padR = 12
  const padT = 18
  const padB = 28

  const weights = entries.map(e => e.weight)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const spread = Math.max(max - min, 1)
  const yMin = min - spread * 0.15
  const yMax = max + spread * 0.15

  const xScale = (i: number) =>
    padL + (i / Math.max(entries.length - 1, 1)) * (W - padL - padR)
  const yScale = (w: number) =>
    padT + (1 - (w - yMin) / (yMax - yMin)) * (H - padT - padB)

  const pathD = entries
    .map((e, i) => `${i === 0 ? 'M' : 'L'} ${xScale(i).toFixed(1)} ${yScale(e.weight).toFixed(1)}`)
    .join(' ')

  // 4 y-axis ticks
  const ticks = [0, 0.33, 0.66, 1].map(t => {
    const v = yMin + (yMax - yMin) * (1 - t)
    return { y: padT + t * (H - padT - padB), label: v.toFixed(1) }
  })

  // Sparse x-axis labels (first, last, and ~3 between)
  const xLabelIdx = (() => {
    if (entries.length <= 5) return entries.map((_, i) => i)
    const out = [0]
    for (let k = 1; k < 4; k++) out.push(Math.round((entries.length - 1) * (k / 4)))
    out.push(entries.length - 1)
    return Array.from(new Set(out))
  })()

  const first = entries[0]
  const last = entries[entries.length - 1]
  const delta = last.weight - first.weight

  return (
    <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl p-4">
      <div className="flex items-baseline justify-between mb-2 flex-wrap gap-2">
        <div>
          <span className="text-white text-2xl font-extrabold">{last.weight.toFixed(1)}kg</span>
          <span className="text-white/40 text-xs font-semibold tracking-widest uppercase ml-2">latest</span>
        </div>
        <div className={`text-sm font-semibold ${delta > 0 ? 'text-[#3ecf6e]' : delta < 0 ? 'text-[#ff6b6b]' : 'text-white/50'}`}>
          {delta > 0 ? '+' : ''}{delta.toFixed(1)}kg since {formatShortDate(first.date)}
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={t.y} y2={t.y} stroke="#2a2b2d" strokeDasharray="2 4" />
            <text x={padL - 6} y={t.y + 4} fill="#ffffff66" fontSize="10" textAnchor="end" fontFamily="sans-serif">
              {t.label}
            </text>
          </g>
        ))}

        <path d={pathD} fill="none" stroke="#3ecf6e" strokeWidth="2" />

        {entries.map((e, i) => (
          <circle key={e.date} cx={xScale(i)} cy={yScale(e.weight)} r={3} fill="#3ecf6e" />
        ))}

        {xLabelIdx.map(i => (
          <text
            key={i}
            x={xScale(i)}
            y={H - 8}
            fill="#ffffff66"
            fontSize="10"
            textAnchor="middle"
            fontFamily="sans-serif"
          >
            {formatShortDate(entries[i].date)}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function BodyPanel() {
  const { entries, upsert, remove } = useBodyweight()
  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')
  const [note, setNote] = useState('')

  const sortedDesc = useMemo(
    () => [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    [entries]
  )

  const handleSave = () => {
    const w = parseFloat(weight)
    if (!Number.isFinite(w) || w <= 0) return
    upsert({ date, weight: w, note: note.trim() || undefined })
    setWeight('')
    setNote('')
  }

  // Prefill weight field with the most recent value as a hint
  const placeholder = sortedDesc[0]?.weight ? `${sortedDesc[0].weight}` : 'kg'

  return (
    <div>
      <h2 className="text-5xl font-extrabold tracking-wide uppercase text-[#3ecf6e] mb-6">
        Body
      </h2>

      <div className="mb-6">
        <BodyChart entries={entries} />
      </div>

      <div className="bg-[#18191b] border border-[#2a2b2d] rounded-xl overflow-hidden mb-6">
        <div className="px-4 py-2.5 bg-[#1e2022] border-b border-[#2a2b2d] text-xs font-bold tracking-widest uppercase text-white/60">
          New weigh-in
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-[140px_1fr_auto] gap-3 items-end">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Date</span>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="bg-[#1e2022] text-white border border-[#2a2b2d] rounded-md h-10 px-2 text-sm font-semibold focus:outline-none focus:border-[#3a3b3e]"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-white/40">Weight (kg)</span>
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder={placeholder}
              className="bg-[#1e2022] text-white border border-[#2a2b2d] rounded-md h-10 px-3 text-sm font-semibold focus:outline-none focus:border-[#3a3b3e] placeholder:text-white/30"
            />
          </label>
          <button
            onClick={handleSave}
            disabled={!weight}
            className="bg-[#3ecf6e] text-[#111213] font-bold text-sm tracking-widest uppercase px-5 h-10 rounded-lg hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Log
          </button>
        </div>
        <div className="px-4 pb-4">
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Optional note — diet phase, hydration, time of day…"
            className="w-full bg-[#1e2022] text-white border border-[#2a2b2d] rounded-md h-10 px-3 text-sm font-medium focus:outline-none focus:border-[#3a3b3e] placeholder:text-white/30"
          />
        </div>
      </div>

      <div className="text-xs font-bold tracking-widest uppercase text-white/50 mb-2">Log</div>
      {sortedDesc.length === 0 ? (
        <div className="text-center py-12 text-white/40 text-sm font-medium">
          No weigh-ins yet. Log one above to start tracking.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {sortedDesc.map(e => (
            <div key={e.date} className="bg-[#18191b] border border-[#2a2b2d] rounded-lg px-4 py-2.5 flex items-center gap-3">
              <span className="text-white/80 text-xs font-bold tracking-wider uppercase w-20 shrink-0">
                {formatShortDate(e.date)}
              </span>
              <span className="text-white font-bold text-base">{e.weight.toFixed(1)}kg</span>
              {e.note && <span className="text-white/50 text-xs font-medium italic truncate">"{e.note}"</span>}
              <button
                onClick={() => remove(e.date)}
                className="ml-auto text-white/30 hover:text-[#ff6b6b] text-xs font-semibold tracking-wider uppercase"
                aria-label={`Delete entry for ${e.date}`}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
