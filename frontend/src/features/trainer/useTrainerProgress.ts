import { useCallback, useEffect, useState } from 'react'

import { parseProgress, type TrainerProgress } from './progress'

export const TRAINER_STORAGE_KEY = 'pokenexus.trainer'

function readStored(): TrainerProgress {
  try {
    return parseProgress(window.localStorage.getItem(TRAINER_STORAGE_KEY))
  } catch {
    return parseProgress(null)
  }
}

function writeStored(progress: TrainerProgress) {
  try {
    window.localStorage.setItem(TRAINER_STORAGE_KEY, JSON.stringify(progress))
  } catch {
    return
  }
}

export type ProgressUpdate = (change: (current: TrainerProgress) => TrainerProgress) => void

export function useTrainerProgress(): { progress: TrainerProgress; update: ProgressUpdate } {
  const [progress, setProgress] = useState<TrainerProgress>(readStored)
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    if (dirty) writeStored(progress)
  }, [dirty, progress])

  const update = useCallback<ProgressUpdate>((change) => {
    setProgress((current) => change(current))
    setDirty(true)
  }, [])

  return { progress, update }
}
