import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Pagination } from '../components/ui/Pagination'
import { DexFilters } from '../features/dex/components/DexFilters'
import { PokemonGrid, PokemonGridSkeleton } from '../features/dex/components/PokemonGrid'
import { usePokemonList } from '../features/dex/hooks'
import { useDexSearchParams } from '../features/dex/useDexSearchParams'
import { errorMessageFor } from '../lib/errorMessages'
import { formatNumber } from '../lib/formatters'
import { ApiError } from '../lib/http'

export function DexPage() {
  const { filter, updateFilter, setPage, clearFilter } = useDexSearchParams()
  const { data, error, isPending, refetch } = usePokemonList(filter)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-bold">Pokédex</h1>
        {data && (
          <p className="text-sm text-text-muted" aria-live="polite">
            {formatNumber(data.totalElements)} kết quả
          </p>
        )}
      </div>
      <div className="flex flex-col gap-6 md:flex-row">
        <aside className="md:w-64 md:flex-none">
          <DexFilters filter={filter} onChange={updateFilter} onClear={clearFilter} />
        </aside>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          {error ? (
            <ErrorState
              message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
              onRetry={() => void refetch()}
            />
          ) : isPending ? (
            <PokemonGridSkeleton />
          ) : data.content.length === 0 ? (
            <EmptyState
              title="Không có Pokémon khớp bộ lọc."
              action={
                <button
                  type="button"
                  onClick={clearFilter}
                  className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
                >
                  Xóa bộ lọc
                </button>
              }
            />
          ) : (
            <>
              <PokemonGrid pokemon={data.content} />
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </>
          )}
        </div>
      </div>
    </section>
  )
}
