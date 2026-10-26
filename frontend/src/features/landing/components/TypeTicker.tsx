import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'

export function TypeTicker() {
  return (
    <div className="relative z-10 border-y-3 border-ink bg-dex-yellow px-3 py-3 shadow-block">
      <ul
        aria-label="18 hệ Pokémon"
        className="mx-auto flex max-w-7xl flex-wrap justify-center gap-2"
      >
        {TYPE_NAMES.map((type) => (
          <li
            key={type}
            className={`inline-flex h-8.5 items-center gap-2 rounded-full border-2 border-ink pr-3.5 pl-1.5 text-sm font-extrabold ${typeClassName(type)}`}
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-surface text-ink">
              <TypeGlyph type={type} className="size-4" strokeWidth={2} />
            </span>
            {typeLabel(type)}
          </li>
        ))}
      </ul>
    </div>
  )
}
