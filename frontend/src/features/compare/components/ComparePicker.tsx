import { useEffect, useId, useRef, useState } from 'react'

import type { PokemonRef } from '../../../types/api'
import type { CompareSide } from '../useCompareSearchParams'
import { CompareSlot } from './CompareSlot'

export type PickerSlot = {
  value: string | undefined
  pokemon: PokemonRef | undefined
  notFound: boolean
  failed: boolean
}

type ComparePickerProps = {
  slots: Record<CompareSide, PickerSlot>
  notice: string
  bare: boolean
  onSelect: (side: CompareSide, pokemon: PokemonRef) => boolean
  onClear: (side: CompareSide) => void
  onSwap: () => void
}

type FocusTarget = { side: CompareSide; part: 'toggle' | 'search' }

const SIDES = ['left', 'right'] as const

export function ComparePicker({
  slots,
  notice,
  bare,
  onSelect,
  onClear,
  onSwap,
}: ComparePickerProps) {
  const baseId = useId()
  const [open, setOpen] = useState<Record<CompareSide, boolean>>({ left: false, right: false })
  const focusTarget = useRef<FocusTarget | null>(null)

  const elementId = ({ side, part }: FocusTarget) => `${baseId}-${side}-${part}`

  useEffect(() => {
    const target = focusTarget.current
    if (!target) return
    const element = document.getElementById(elementId(target))
    if (element) {
      element.focus()
      focusTarget.current = null
    }
  })

  const setSideOpen = (side: CompareSide, value: boolean, focus: FocusTarget['part']) => {
    focusTarget.current = { side, part: focus }
    setOpen((current) => ({ ...current, [side]: value }))
  }

  const noneChosen = slots.left.value === undefined && slots.right.value === undefined

  return (
    <section
      aria-label="Chọn Pokémon"
      className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-2 gap-y-3 md:gap-x-5 md:gap-y-3.5 md:rounded-3xl md:border-2 md:border-ink md:bg-surface md:px-5 md:py-4.5 md:shadow-block-lg ${bare ? '' : 'max-md:rounded-3xl max-md:border-2 max-md:border-ink max-md:bg-surface max-md:p-3 max-md:shadow-block-lg'}`}
    >
      {SIDES.map((side) => {
        const slot = slots[side]
        const other = slots[side === 'left' ? 'right' : 'left'].pokemon
        const editing = slot.value === undefined || open[side]
        return (
          <CompareSlot
            key={side}
            side={side}
            value={slot.value}
            pokemon={slot.pokemon}
            notFound={slot.notFound}
            failed={slot.failed}
            excludeIds={other ? [other.id] : []}
            editing={editing}
            toggleId={elementId({ side, part: 'toggle' })}
            searchId={elementId({ side, part: 'search' })}
            onToggle={() => setSideOpen(side, !open[side], open[side] ? 'toggle' : 'search')}
            onClose={() => setSideOpen(side, false, 'toggle')}
            onSelect={(pokemon) => {
              if (onSelect(side, pokemon)) setSideOpen(side, false, 'toggle')
            }}
            onClear={() => {
              focusTarget.current = { side, part: 'search' }
              onClear(side)
            }}
          />
        )
      })}
      <button
        type="button"
        onClick={onSwap}
        disabled={noneChosen}
        aria-label="Đổi bên hai Pokémon"
        className="group col-start-2 row-start-1 inline-flex size-12 flex-none items-center justify-center rounded-full border-2 border-ink bg-dex-yellow text-ink shadow-[0_3px_0_var(--color-ink)] transition-[transform,box-shadow,background-color] duration-150 ease-out not-disabled:cursor-pointer not-disabled:active:translate-y-0.5 not-disabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 md:bg-surface md:not-disabled:hover:bg-surface-muted"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5.5 md:hidden"
        >
          <path d="M8 4v15 M4.5 7.5L8 4l3.5 3.5 M16 20V5 M12.5 16.5L16 20l3.5-3.5" />
        </svg>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5.5 transition-transform duration-300 ease-out group-enabled:group-hover:rotate-180 max-md:hidden"
        >
          <path d="M4 8h14l-4-4M20 16H6l4 4" />
        </svg>
      </button>
      <p role="status" className={notice ? 'col-span-3 text-sm font-bold text-danger' : 'sr-only'}>
        {notice}
      </p>
    </section>
  )
}
