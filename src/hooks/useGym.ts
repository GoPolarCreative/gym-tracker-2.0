// This file is intentionally empty. The gym (Jetts / FC) layer was removed in
// favour of a single per-user machineLabel setting on the profile. Read it via:
//   const { profile } = useProfile()
//   const label = profile?.machineLabel ?? 'kg'
// or the helper:
//   import { getMachineLabel } from './useProfile'
export {}
