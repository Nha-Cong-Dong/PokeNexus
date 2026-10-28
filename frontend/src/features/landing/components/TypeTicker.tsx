import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'

type TypeListProps = {
  label?: string
  hidden?: boolean
}

function TypeList({ label, hidden = false }: TypeListProps) {
  return (
    <ul
      aria-label={label}
      aria-hidden={hidden || undefined}
      className={`flex flex-none gap-2 pr-2 motion-reduce:flex-wrap motion-reduce:justify-center ${hidden ? 'motion-reduce:hidden' : ''}`}
    >
      {TYPE_NAMES.map((type) => (
        <li
          key={type}
          className={`inline-flex h-8.5 flex-none items-center gap-2 rounded-full border-2 border-ink pr-3.5 pl-1.5 text-sm font-extrabold ${typeClassName(type)}`}
        >
          <span className="flex size-6 items-center justify-center rounded-full bg-surface text-ink">
            <TypeGlyph type={type} className="size-4" strokeWidth={2} />
          </span>
          {typeLabel(type)}
        </li>
      ))}
    </ul>
  )
}

export function TypeTicker() {
  return (
    <div className="group relative z-10 overflow-hidden border-y-3 border-ink bg-dex-yellow py-3 shadow-block">
      <div className="flex w-max motion-safe:animate-marquee motion-safe:group-hover:[animation-play-state:paused] motion-reduce:mx-auto motion-reduce:w-auto motion-reduce:max-w-7xl motion-reduce:px-3">
        <TypeList label="18 hệ Pokémon" />
        <TypeList hidden />
      </div>
    </div>
  )
}
