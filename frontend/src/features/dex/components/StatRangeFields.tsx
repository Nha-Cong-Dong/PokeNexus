import { useId, useState, type KeyboardEvent } from 'react'

import { MAX_BST, MAX_SPEED, type DexFilterChange } from '../useDexSearchParams'

type StatRange = Pick<DexFilterChange, 'minBst' | 'maxBst' | 'minSpeed'>

type StatRangeFieldsProps = StatRange & {
  onCommit: (change: StatRange) => void
}

type DraftKey = keyof StatRange
type Draft = Record<DraftKey, string>

const BAR_MIN = 180
const BAR_MAX = 720
const INPUT_CLASS =
  'h-10 w-full rounded-[10px] border-2 border-border-strong bg-surface px-2.5 text-[15px] text-ink [appearance:textfield] aria-invalid:border-danger [&::-webkit-inner-spin-button]:appearance-none'
const LABEL_CLASS = 'text-xs font-bold text-ink-muted'

function toDraft({ minBst, maxBst, minSpeed }: StatRange): Draft {
  return {
    minBst: minBst === undefined ? '' : String(minBst),
    maxBst: maxBst === undefined ? '' : String(maxBst),
    minSpeed: minSpeed === undefined ? '' : String(minSpeed),
  }
}

function parseValue(value: string, max: number): number | undefined | null {
  const trimmed = value.trim()
  if (trimmed === '') return undefined
  if (!/^\d+$/.test(trimmed)) return null
  const parsed = Number(trimmed)
  return parsed <= max ? parsed : null
}

function barPercent(value: number): number {
  return ((Math.min(Math.max(value, BAR_MIN), BAR_MAX) - BAR_MIN) / (BAR_MAX - BAR_MIN)) * 100
}

export function StatRangeFields({ minBst, maxBst, minSpeed, onCommit }: StatRangeFieldsProps) {
  const id = useId()
  const source = `${minBst ?? ''}|${maxBst ?? ''}|${minSpeed ?? ''}`
  const [syncedSource, setSyncedSource] = useState(source)
  const [draft, setDraft] = useState(() => toDraft({ minBst, maxBst, minSpeed }))
  const [bstError, setBstError] = useState<string>()
  const [speedError, setSpeedError] = useState<string>()

  if (syncedSource !== source) {
    setSyncedSource(source)
    setDraft(toDraft({ minBst, maxBst, minSpeed }))
    setBstError(undefined)
    setSpeedError(undefined)
  }

  const commit = () => {
    const nextMin = parseValue(draft.minBst, MAX_BST)
    const nextMax = parseValue(draft.maxBst, MAX_BST)
    const nextSpeed = parseValue(draft.minSpeed, MAX_SPEED)
    const nextBstError =
      nextMin === null || nextMax === null
        ? `BST là số nguyên từ 0 đến ${MAX_BST}.`
        : nextMin !== undefined && nextMax !== undefined && nextMin > nextMax
          ? 'Giá trị "Từ" phải nhỏ hơn hoặc bằng "Đến".'
          : undefined
    const nextSpeedError =
      nextSpeed === null ? `Tốc độ là số nguyên từ 0 đến ${MAX_SPEED}.` : undefined
    setBstError(nextBstError)
    setSpeedError(nextSpeedError)
    if (nextMin === null || nextMax === null || nextSpeed === null || nextBstError) return
    if (nextMin === minBst && nextMax === maxBst && nextSpeed === minSpeed) return
    onCommit({ minBst: nextMin, maxBst: nextMax, minSpeed: nextSpeed })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    }
  }

  const fieldProps = (key: DraftKey) => ({
    id: `${id}-${key}`,
    type: 'number',
    inputMode: 'numeric' as const,
    min: 0,
    value: draft[key],
    onChange: (event: { target: { value: string } }) =>
      setDraft((current) => ({ ...current, [key]: event.target.value })),
    onBlur: commit,
    onKeyDown,
    className: INPUT_CLASS,
  })

  const bstErrorId = `${id}-bst-error`
  const speedErrorId = `${id}-speed-error`

  return (
    <>
      <fieldset>
        <legend className="mb-2.5 text-sm font-bold">Tổng chỉ số (BST)</legend>
        <div className="flex items-end gap-2.5">
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor={`${id}-minBst`} className={LABEL_CLASS}>
              Từ
            </label>
            <input
              {...fieldProps('minBst')}
              max={MAX_BST}
              placeholder={String(BAR_MIN)}
              aria-invalid={bstError !== undefined}
              aria-describedby={bstError ? bstErrorId : undefined}
            />
          </div>
          <span aria-hidden="true" className="flex h-10 items-center text-ink-muted">
            –
          </span>
          <div className="flex flex-1 flex-col gap-1">
            <label htmlFor={`${id}-maxBst`} className={LABEL_CLASS}>
              Đến
            </label>
            <input
              {...fieldProps('maxBst')}
              max={MAX_BST}
              placeholder={String(BAR_MAX)}
              aria-invalid={bstError !== undefined}
              aria-describedby={bstError ? bstErrorId : undefined}
            />
          </div>
        </div>
        <div aria-hidden="true" className="relative mt-3.5 h-2 rounded bg-surface-muted">
          <span
            className="absolute inset-y-0 rounded bg-primary"
            style={{
              left: `${barPercent(minBst ?? BAR_MIN)}%`,
              right: `${100 - barPercent(maxBst ?? BAR_MAX)}%`,
            }}
          />
        </div>
        {bstError && (
          <p id={bstErrorId} className="mt-2 text-sm font-bold text-danger">
            {bstError}
          </p>
        )}
      </fieldset>
      <div className="flex flex-col gap-1">
        <label htmlFor={`${id}-minSpeed`} className="text-sm font-bold">
          Tốc độ tối thiểu
        </label>
        <input
          {...fieldProps('minSpeed')}
          max={MAX_SPEED}
          placeholder="0"
          aria-invalid={speedError !== undefined}
          aria-describedby={speedError ? speedErrorId : undefined}
        />
        {speedError && (
          <p id={speedErrorId} className="mt-1 text-sm font-bold text-danger">
            {speedError}
          </p>
        )}
      </div>
    </>
  )
}
