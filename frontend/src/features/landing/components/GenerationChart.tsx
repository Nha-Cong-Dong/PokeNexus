import { Link } from 'react-router'

import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatNumber } from '../../../lib/formatters'
import { GENERATIONS } from '../generations'
import { useGenerationCounts } from '../hooks'
import { SPECIES_COUNT } from '../regions'
import { SectionTitle } from './SectionTitle'

export function GenerationChart() {
  const { counts, isPending, isError, errorCode, retry } = useGenerationCounts()
  const total = counts ? counts.reduce((sum, count) => sum + count, 0) : SPECIES_COUNT
  const max = counts ? Math.max(...counts, 1) : 1

  return (
    <section
      aria-labelledby="gens-title"
      className="bg-linear-to-b from-bg to-surface-muted px-4 py-16 md:px-6 md:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionTitle id="gens-title">{`${formatNumber(total)} loài qua 9 thế hệ`}</SectionTitle>
          <p className="max-w-[50ch] text-lg/7 text-ink-muted">
            Mỗi cột là số loài mới của một thế hệ. Bấm một cột để mở Pokédex lọc theo thế hệ đó.
          </p>
        </div>

        <div className="mt-10 overflow-x-auto rounded-3xl border-2 border-ink bg-surface p-4 shadow-block-lg md:p-6">
          {isError ? (
            <ErrorState message={errorMessageFor(errorCode)} onRetry={retry} />
          ) : (
            <ol className="grid min-w-160 grid-cols-9 gap-3">
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
                      <span className="flex h-56 items-end">
                        <span
                          className={`block w-full rounded-t-xl border-2 border-ink transition-transform group-hover:-translate-y-1 ${count === undefined ? 'bg-surface-muted' : generation.barClassName}`}
                          style={{ height: `${height}%` }}
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
        </div>
      </div>
    </section>
  )
}
