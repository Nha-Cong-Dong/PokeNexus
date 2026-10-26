import { useEffect, useId, useState, type KeyboardEvent } from 'react'

import { SEARCH_MIN_LENGTH } from '../../features/dex/api'
import { usePokemonSearch } from '../../features/dex/hooks'
import { errorMessageFor } from '../../lib/errorMessages'
import { formatPokemonName } from '../../lib/formatters'
import { ApiError } from '../../lib/http'
import type { PokemonRef } from '../../types/api'
import { DexNumber } from './DexNumber'
import { PokemonSprite } from './PokemonSprite'
import { TypeBadge } from './TypeBadge'

type PokemonSearchBoxProps = {
  label: string
  onSelect: (pokemon: PokemonRef) => void
  excludeIds?: readonly number[]
  placeholder?: string
  id?: string
}

const DEBOUNCE_MS = 250
const NO_EXCLUDED_IDS: readonly number[] = []

function useDebouncedValue(value: string, delayMs: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs)
    return () => window.clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}

export function PokemonSearchBox({
  label,
  onSelect,
  excludeIds = NO_EXCLUDED_IDS,
  placeholder = 'Nhập ít nhất 2 chữ cái, ví dụ: char',
  id,
}: PokemonSearchBoxProps) {
  const generatedId = useId()
  const inputId = id ?? `${generatedId}-input`
  const listboxId = `${inputId}-listbox`
  const optionId = (index: number) => `${inputId}-option-${index}`

  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const query = useDebouncedValue(text, DEBOUNCE_MS)
  const { data, error } = usePokemonSearch(query)

  const typed = text.trim()
  const options = (data ?? []).filter((pokemon) => !excludeIds.includes(pokemon.id))
  const popupOpen = open && typed.length >= SEARCH_MIN_LENGTH
  const expanded = popupOpen && options.length > 0
  const active = expanded ? Math.min(Math.max(activeIndex, 0), options.length - 1) : -1

  const status = !popupOpen
    ? ''
    : error
      ? errorMessageFor(error instanceof ApiError ? error.code : undefined)
      : data === undefined
        ? 'Đang tìm…'
        : options.length === 0
          ? `Không tìm thấy Pokémon nào khớp "${query.trim()}".`
          : `${options.length} gợi ý. Dùng phím mũi tên để chọn, Enter để xác nhận.`

  const choose = (pokemon: PokemonRef) => {
    onSelect(pokemon)
    setText('')
    setOpen(false)
    setActiveIndex(0)
  }

  const moveTo = (index: number) => {
    setActiveIndex(index)
    document.getElementById(optionId(index))?.scrollIntoView?.({ block: 'nearest' })
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) setOpen(true)
        else if (expanded) moveTo((active + 1) % options.length)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) setOpen(true)
        else if (expanded) moveTo(active <= 0 ? options.length - 1 : active - 1)
        break
      case 'Enter': {
        const pokemon = options[active]
        if (expanded && pokemon) {
          event.preventDefault()
          choose(pokemon)
        }
        break
      }
      case 'Escape':
        if (popupOpen) {
          event.preventDefault()
          setOpen(false)
        } else if (text !== '') {
          event.preventDefault()
          setText('')
        }
        break
    }
  }

  return (
    <div className="relative flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold text-ink">
        {label}
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          className="pointer-events-none absolute top-1/2 left-3 size-5 -translate-y-1/2 text-ink-muted"
        >
          <path d="M10.5 4a6.5 6.5 0 1 0 0 13a6.5 6.5 0 1 0 0-13z M15.5 15.5L20 20" />
        </svg>
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listboxId}
          aria-activedescendant={active >= 0 ? optionId(active) : undefined}
          value={text}
          placeholder={placeholder}
          onChange={(event) => {
            setText(event.target.value)
            setOpen(true)
            setActiveIndex(0)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="h-11 w-full rounded-[10px] border-2 border-border-strong bg-surface pr-3 pl-10 text-[15px] text-ink placeholder:text-ink-muted"
        />
      </div>
      <div
        hidden={!popupOpen}
        className="absolute inset-x-0 top-full z-45 mt-1.5 overflow-hidden rounded-xl border-2 border-ink bg-surface shadow-xl"
      >
        <ul
          id={listboxId}
          role="listbox"
          aria-label={label}
          hidden={!expanded}
          className="max-h-80 overflow-y-auto py-1"
        >
          {options.map((pokemon, index) => {
            const displayName = formatPokemonName(pokemon.name)
            return (
              <li
                key={pokemon.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActiveIndex(index)}
                onClick={() => choose(pokemon)}
                className={`flex cursor-pointer items-center gap-3 px-3 py-1.5 ${index === active ? 'bg-surface-muted' : ''}`}
              >
                <PokemonSprite id={pokemon.id} alt="" size={40} className="size-10 flex-none" />
                <span className="flex min-w-0 flex-1 flex-col leading-5">
                  <span className="truncate font-extrabold">{displayName}</span>
                  <DexNumber id={pokemon.id} className="text-xs text-ink-muted" />
                </span>
                <span className="flex flex-none flex-wrap justify-end gap-1">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </span>
              </li>
            )
          })}
        </ul>
        <p
          role="status"
          className={expanded ? 'sr-only' : 'px-3.5 py-3 text-sm font-bold text-ink-muted'}
        >
          {status}
        </p>
      </div>
    </div>
  )
}
