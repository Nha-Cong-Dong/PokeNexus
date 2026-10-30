import {
  multiplierClassName,
  multiplierWeightClassName,
} from '../../../components/pokemon/multiplierStyles'
import { Panel } from '../../../components/ui/Panel'
import { formatMultiplier, formatPokemonName } from '../../../lib/formatters'
import { typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { PokemonDetail, TypeName } from '../../../types/api'

type StabPanelProps = {
  left: PokemonDetail
  right: PokemonDetail
}

type StabHit = {
  type: TypeName
  multiplier: number
}

const STAB_TITLE_ID = 'compare-stab-title'

function stabMultipliers(attacker: PokemonDetail, defender: PokemonDetail): StabHit[] {
  return attacker.types.map((type) => ({
    type,
    multiplier: defender.defense.find((entry) => entry.attackingType === type)?.multiplier ?? 1,
  }))
}

export function StabPanel({ left, right }: StabPanelProps) {
  const matchups = [
    { attacker: left, defender: right },
    { attacker: right, defender: left },
  ]

  return (
    <Panel aria-labelledby={STAB_TITLE_ID} className="min-w-0">
      <h2 id={STAB_TITLE_ID} className="text-2xl font-extrabold">
        Đòn cùng hệ
      </h2>
      <p className="mt-1 mb-4 text-base text-ink-muted">
        Sát thương của đòn mang hệ chính khi đánh vào đối thủ.
      </p>
      <div className="flex flex-col gap-3.5">
        {matchups.map(({ attacker, defender }) => {
          const title = `${formatPokemonName(attacker.name)} đánh ${formatPokemonName(defender.name)}`
          return (
            <div key={attacker.id} className="flex flex-col gap-2">
              <p className="text-base font-extrabold md:text-sm">{title}</p>
              <ul aria-label={title} className="flex flex-wrap gap-2">
                {stabMultipliers(attacker, defender).map((hit) => (
                  <li
                    key={hit.type}
                    title={`Đòn ${typeLabel(hit.type)} gây ${formatMultiplier(hit.multiplier)}`}
                    className="flex h-10 items-stretch overflow-hidden rounded-[10px] border-2 border-ink md:h-9"
                  >
                    <span
                      className={`flex items-center px-3 text-sm font-extrabold md:text-[13px] ${typeClassName(hit.type)}`}
                    >
                      {typeLabel(hit.type)}
                    </span>
                    <span
                      className={`flex min-w-10.5 items-center justify-center px-1.5 text-[15px] md:min-w-10 md:text-sm ${multiplierClassName(hit.multiplier)} ${multiplierWeightClassName(hit.multiplier)}`}
                    >
                      {formatMultiplier(hit.multiplier)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}
