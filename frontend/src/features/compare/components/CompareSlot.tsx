import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSearchBox } from '../../../components/pokemon/PokemonSearchBox'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonRef } from '../../../types/api'
import type { CompareSide } from '../useCompareSearchParams'

type CompareSlotProps = {
  side: CompareSide
  value: string | undefined
  pokemon: PokemonRef | undefined
  notFound: boolean
  failed: boolean
  excludeIds: readonly number[]
  onSelect: (pokemon: PokemonRef) => void
  onClear: () => void
}

const SIDE_STYLES: Record<CompareSide, { label: string; frame: string; stripe: string }> = {
  left: {
    label: 'Pokémon bên trái',
    frame: 'border-primary',
    stripe: 'bg-primary',
  },
  right: {
    label: 'Pokémon bên phải',
    frame: 'border-accent',
    stripe: 'bg-accent',
  },
}

export function CompareSlot({
  side,
  value,
  pokemon,
  notFound,
  failed,
  excludeIds,
  onSelect,
  onClear,
}: CompareSlotProps) {
  const style = SIDE_STYLES[side]
  const displayName = pokemon ? formatPokemonName(pokemon.name) : undefined

  return (
    <div
      className={`flex min-w-0 flex-1 gap-3 rounded-2xl border-2 bg-surface py-3 pr-3 pl-2.5 ${style.frame}`}
    >
      <span aria-hidden="true" className={`w-1.5 flex-none rounded-full ${style.stripe}`} />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <PokemonSearchBox
          label={style.label}
          onSelect={onSelect}
          excludeIds={excludeIds}
          placeholder={value ? 'Đổi sang Pokémon khác' : 'Ví dụ: garchomp'}
        />
        <div className="flex min-h-14 items-center gap-3">
          {pokemon && displayName ? (
            <>
              <PokemonSprite id={pokemon.id} alt="" size={56} className="size-14 flex-none" />
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-extrabold">{displayName}</span>
                  <DexNumber id={pokemon.id} className="text-sm text-ink-muted" />
                </span>
                <span className="flex flex-wrap gap-1">
                  {pokemon.types.map((type) => (
                    <TypeBadge key={type} type={type} />
                  ))}
                </span>
              </span>
            </>
          ) : (
            <p className="flex-1 text-sm font-bold text-ink-muted">
              {value === undefined
                ? 'Chưa chọn Pokémon.'
                : notFound
                  ? `Không tìm thấy Pokémon "${value}".`
                  : failed
                    ? 'Chưa tải được Pokémon này.'
                    : 'Đang tải…'}
            </p>
          )}
          {value !== undefined && (
            <button
              type="button"
              onClick={onClear}
              aria-label={`Bỏ chọn ${displayName ?? value}`}
              className={`flex-none ${buttonClassName('ghost')}`}
            >
              Bỏ chọn
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
