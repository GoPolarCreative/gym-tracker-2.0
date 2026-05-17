import { useEffect, useState } from 'react'
import type { ExerciseDef } from '../data/exercises'

// Two storage maps:
//   "always" — keyed by exercise id, persists across weeks/sessions.
//   "session" — keyed by `${week}:${day}:${exerciseId}`, used for one-off swaps.

const ALWAYS_KEY = 'ppl_swaps_always_v1'
const SESSION_KEY = 'ppl_swaps_session_v1'
const SWAP_EVENT = 'ppl-swap-change'

type SwapMap = Record<string, ExerciseDef>

function readMap(key: string): SwapMap {
  const raw = localStorage.getItem(key)
  if (!raw) return {}
  try {
    return JSON.parse(raw) as SwapMap
  } catch {
    return {}
  }
}

function writeMap(key: string, map: SwapMap) {
  localStorage.setItem(key, JSON.stringify(map))
  window.dispatchEvent(new Event(SWAP_EVENT))
}

export function useExerciseSwaps() {
  const [always, setAlways] = useState<SwapMap>(() => readMap(ALWAYS_KEY))
  const [session, setSession] = useState<SwapMap>(() => readMap(SESSION_KEY))

  useEffect(() => {
    const handler = () => {
      setAlways(readMap(ALWAYS_KEY))
      setSession(readMap(SESSION_KEY))
    }
    window.addEventListener(SWAP_EVENT, handler)
    window.addEventListener('storage', handler)
    return () => {
      window.removeEventListener(SWAP_EVENT, handler)
      window.removeEventListener('storage', handler)
    }
  }, [])

  const sessionKey = (week: number, day: string, exId: string) => `${week}:${day}:${exId}`

  /** Resolve which definition should actually render for this exercise. */
  const resolve = (week: number, day: string, exId: string): ExerciseDef | null => {
    return session[sessionKey(week, day, exId)] ?? always[exId] ?? null
  }

  const setAlwaysSwap = (exId: string, def: ExerciseDef) => {
    const next = { ...readMap(ALWAYS_KEY), [exId]: def }
    writeMap(ALWAYS_KEY, next)
    // Clear any session-level swap that would shadow it
    const sess = { ...readMap(SESSION_KEY) }
    Object.keys(sess).forEach(k => { if (k.endsWith(`:${exId}`)) delete sess[k] })
    writeMap(SESSION_KEY, sess)
  }

  const setSessionSwap = (week: number, day: string, exId: string, def: ExerciseDef) => {
    const next = { ...readMap(SESSION_KEY), [sessionKey(week, day, exId)]: def }
    writeMap(SESSION_KEY, next)
  }

  const clearSwap = (week: number, day: string, exId: string) => {
    const sess = { ...readMap(SESSION_KEY) }
    delete sess[sessionKey(week, day, exId)]
    writeMap(SESSION_KEY, sess)
    const al = { ...readMap(ALWAYS_KEY) }
    delete al[exId]
    writeMap(ALWAYS_KEY, al)
  }

  const wipe = () => {
    localStorage.removeItem(ALWAYS_KEY)
    localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event(SWAP_EVENT))
  }

  return { always, session, resolve, setAlwaysSwap, setSessionSwap, clearSwap, wipe }
}
