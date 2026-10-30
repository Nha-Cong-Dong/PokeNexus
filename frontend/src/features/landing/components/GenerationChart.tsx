import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatNumber } from '../../../lib/formatters'
import { GENERATIONS } from '../generations'
import { useGenerationCounts } from '../hooks'
import { SPECIES_COUNT } from '../regions'
import { Aura, Blob } from './SectionDecor'
import { SectionTitle } from './SectionTitle'

export function GenerationChart() {
  const { counts, isPending, isError, errorCode, retry } = useGenerationCounts()
  const total = counts ? counts.reduce((sum, count) => sum + count, 0) : SPECIES_COUNT
  const max = counts ? Math.max(...counts, 1) : 1

  return (
    <section
      aria-labelledby="gens-title"
      className="relative overflow-hidden bg-linear-to-b from-band-apricot to-band-mint px-4 pt-8 pb-14 md:px-6 md:pt-[70px] md:pb-[110px]"
    >
      <Aura>
        <Blob className="top-[20%] -left-[50%] size-[440px] from-type-grass/30 md:top-[10%] md:-left-[10%] md:size-[680px]" />
        <Blob
          drift="b"
          className="top-0 -right-[50%] size-[420px] from-type-psychic/20 md:-top-[14%] md:-right-[8%] md:size-[640px]"
        />
        <Blob className="right-[20%] -bottom-[30%] hidden size-[640px] from-type-water/26 md:block" />
        <p className="text-outline absolute top-1.5 -right-2.5 font-display text-[110px]/none whitespace-nowrap select-none [--outline-width:1.5px] md:top-2.5 md:right-[3%] md:text-[260px] md:[--outline-width:2px]">
          {total}
        </p>
      </Aura>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionTitle id="gens-title">{`${formatNumber(total)} loài qua 9 thế hệ`}</SectionTitle>
          <p className="max-w-[50ch] text-lg/7 text-ink-muted">
            Mỗi cột là số loài mới của một thế hệ. Bấm một cột để mở Pokédex lọc theo thế hệ đó.
          </p>
        </div>

        <Reveal className="mt-7 overflow-x-auto rounded-3xl border-3 border-ink bg-surface px-4 pt-5 pb-4 shadow-block-lg md:px-6 md:pt-7 md:pb-[22px]">
          {isError ? (
            <ErrorState message={errorMessageFor(errorCode)} onRetry={retry} />
          ) : (
            <ol className="grid min-w-190 grid-cols-9 items-end gap-3">
              {GENERATIONS.map((generation, index) => {
                const count = counts?.[index]
                const height = count === undefined ? 30 : Math.max((count / max) * 100, 4)
                return (
                  <li key={generation.generation}>
                    <Link
                      to={`/pokedex?gen=${generation.generation}`}
                      aria-label={`Thế hệ ${generation.generation}, ${generation.region}: ${count === undefined ? 'đang tải' : `${count} loài`}. Mở Pokédex lọc thế hệ này`}
                      className="group flex flex-col items-stretch gap-2 rounded-xl p-1 text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      <span className="text-center text-lg font-extrabold">
                        {count === undefined ? (isPending ? '...' : '-') : count}
                      </span>
                      <span className="-mx-2.5 flex h-60 items-end border-b-3 border-ink px-2.5">
                        <span
                          className={`reveal-grow-y block w-full rounded-t-xl border-2 border-b-0 border-ink transition-[translate,filter] duration-150 group-hover:-translate-y-1 group-hover:brightness-108 ${count === undefined ? 'bg-surface-muted' : `bar-stripes ${generation.barClassName}`}`}
                          style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }}
                        />
                      </span>
                      <span className="tabular-nums font-bold text-center text-xs text-ink-muted">
                        {generation.year}
                      </span>
                      <span className="text-center text-sm font-extrabold">
                        {generation.region}
                      </span>
                      <span className="text-center text-xs font-bold text-ink-muted">
                        Thế hệ {generation.generation}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          )}
        </Reveal>
      </div>
    </section>
  )
}
