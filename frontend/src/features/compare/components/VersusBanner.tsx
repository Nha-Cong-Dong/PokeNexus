import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { formatPokemonName } from '../../../lib/formatters'
import { sceneForTypes } from '../../../lib/scenes'
import type { PokemonDetail } from '../../../types/api'

type VersusBannerProps = {
  left: PokemonDetail
  right: PokemonDetail
}

const HALF_CLASS =
  'absolute inset-0 transition-[translate,opacity] duration-400 ease-out starting:opacity-0'

export function VersusBanner({ left, right }: VersusBannerProps) {
  const leftName = formatPokemonName(left.name)
  const rightName = formatPokemonName(right.name)

  return (
    <section
      aria-label={`${leftName} đối đầu ${rightName}`}
      className="relative h-96 overflow-hidden rounded-3xl border-2 border-ink bg-scrim shadow-block-lg md:h-88 lg:h-96"
    >
      <div
        className={`${HALF_CLASS} [clip-path:polygon(0_0,100%_0,100%_52%,0_40%)] starting:-translate-y-1/4 md:[clip-path:polygon(0_0,57%_0,43%_100%,0_100%)] md:starting:-translate-x-1/3 md:starting:translate-y-0`}
      >
        <SceneBackdrop scene={sceneForTypes(left.types)} />
      </div>
      <div
        className={`${HALF_CLASS} [clip-path:polygon(0_40%,100%_52%,100%_100%,0_100%)] starting:translate-y-1/4 md:[clip-path:polygon(57%_0,100%_0,100%_100%,43%_100%)] md:starting:translate-x-1/3 md:starting:translate-y-0`}
      >
        <SceneBackdrop scene={sceneForTypes(right.types)} />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-dex-yellow [clip-path:polygon(0_39%,100%_51%,100%_53.5%,0_41.5%)] md:[clip-path:polygon(56%_0,58%_0,44%_100%,42%_100%)]"
      />

      <PokemonSprite
        id={left.id}
        alt={leftName}
        variant="artwork"
        size={240}
        className="absolute top-3 right-2 size-40 object-contain md:top-auto md:right-auto md:bottom-3 md:left-[12%] md:size-52 lg:size-60"
      />
      <PokemonSprite
        id={right.id}
        alt={rightName}
        variant="artwork"
        size={240}
        className="absolute bottom-3 left-2 size-40 object-contain md:right-[12%] md:left-auto md:size-52 lg:size-60"
      />

      <NamePlate pokemon={left} name={leftName} className="top-3 left-3 md:top-5 md:left-5" />
      <NamePlate
        pokemon={right}
        name={rightName}
        className="right-3 bottom-3 items-end text-right md:top-5 md:right-5 md:bottom-auto"
      />

      <span
        aria-hidden="true"
        className="absolute top-[46%] left-1/2 flex size-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-ink bg-dex-yellow font-display text-2xl text-ink shadow-[0_5px_0_var(--color-ink)] md:top-1/2 md:size-24 md:text-4xl"
      >
        VS
      </span>
    </section>
  )
}

type NamePlateProps = {
  pokemon: PokemonDetail
  name: string
  className: string
}

function NamePlate({ pokemon, name, className }: NamePlateProps) {
  return (
    <div
      className={`absolute flex max-w-[55%] flex-col gap-1.5 rounded-2xl bg-scrim/85 px-4 py-3 text-white md:max-w-[40%] ${className}`}
    >
      <DexNumber id={pokemon.id} className="text-sm text-white/80" />
      <p className="font-display text-2xl leading-7 break-words md:text-3xl md:leading-9">{name}</p>
      <span className="flex flex-wrap gap-1.5">
        {pokemon.types.map((type) => (
          <TypeBadge key={type} type={type} />
        ))}
      </span>
    </div>
  )
}
