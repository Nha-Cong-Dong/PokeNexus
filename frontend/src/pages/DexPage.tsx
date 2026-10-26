import { useState } from 'react'
import { useNavigate } from 'react-router'

import { PokemonSearchBox } from '../components/pokemon/PokemonSearchBox'
import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Pagination } from '../components/ui/Pagination'
import { DexFilters } from '../features/dex/components/DexFilters'
import { DexToolbar } from '../features/dex/components/DexToolbar'
import { FilterSheet } from '../features/dex/components/FilterSheet'
import { PokemonGrid, PokemonGridSkeleton } from '../features/dex/components/PokemonGrid'
import { PokemonList } from '../features/dex/components/PokemonList'
import { ViewToggle } from '../features/dex/components/ViewToggle'
import { emptyResultMessage } from '../features/dex/emptyMessage'
import { usePokemonList } from '../features/dex/hooks'
import { useDexSearchParams } from '../features/dex/useDexSearchParams'
import { errorMessageFor } from '../lib/errorMessages'
import { formatNumber } from '../lib/formatters'
import { ApiError } from '../lib/http'
import type { PokemonRef } from '../types/api'

const SPECIES_COUNT = 1025
const RESULTS_TITLE_ID = 'results-title'
const SEARCH_LABEL = 'Tìm Pokémon theo tên'
const SEARCH_PLACEHOLDER = 'Ví dụ: garchomp'

export function DexPage() {
  const { filter, view, updateFilter, setPage, setView, clearFilter, activeCount } =
    useDexSearchParams()
  const { data, error, isPending, isPlaceholderData, refetch } = usePokemonList(filter)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const navigate = useNavigate()
  const openPokemon = (pokemon: PokemonRef) => void navigate(`/pokemon/${pokemon.name}`)

  const countLabel = !data
    ? 'Pokémon'
    : activeCount > 0
      ? `${formatNumber(data.totalElements)} Pokémon khớp bộ lọc`
      : data.content.length === 0
        ? '0 Pokémon'
        : `Hiển thị ${formatNumber(data.page * data.size + 1)}–${formatNumber(data.page * data.size + data.content.length)} trong ${formatNumber(data.totalElements)} Pokémon`

  const clearButton = (
    <button type="button" onClick={clearFilter} className={buttonClassName('primary')}>
      Xóa bộ lọc
    </button>
  )

  return (
    <>
      <PageHero
        scene="grassland"
        title="Pokédex"
        subtitle={`${formatNumber(SPECIES_COUNT)} loài từ Thế hệ 1 đến 9. Lọc theo hệ, thế hệ và tổng chỉ số; chọn tối đa 2 hệ.`}
      />
      <PageBody className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <aside
          aria-label="Bộ lọc"
          className="hidden flex-none flex-col gap-5.5 rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg lg:flex lg:w-64"
        >
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-extrabold">Bộ lọc</h2>
            <button
              type="button"
              onClick={clearFilter}
              disabled={activeCount === 0}
              className={buttonClassName('ghost', 'sm')}
            >
              Xóa bộ lọc{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
          </div>
          <PokemonSearchBox
            label={SEARCH_LABEL}
            placeholder={SEARCH_PLACEHOLDER}
            onSelect={openPokemon}
          />
          <DexFilters filter={filter} onChange={updateFilter} />
        </aside>

        <section
          aria-labelledby={RESULTS_TITLE_ID}
          className="flex min-w-0 flex-1 flex-col lg:rounded-3xl lg:border-2 lg:border-ink lg:bg-surface lg:px-6 lg:pt-5 lg:pb-6 lg:shadow-block-lg"
        >
          <div className="mb-3 flex flex-col gap-4.5 lg:mb-4.5 lg:flex-row lg:items-center lg:gap-4">
            <div className="flex items-center justify-between gap-3 pl-1 lg:flex-1 lg:pl-0">
              <h2
                id={RESULTS_TITLE_ID}
                aria-live="polite"
                className="text-xl font-extrabold lg:text-[22px] lg:leading-7"
              >
                {countLabel}
              </h2>
              <ViewToggle view={view} onChange={setView} />
            </div>
            <DexToolbar
              sort={filter.sort}
              activeCount={activeCount}
              onSortChange={(sort) => updateFilter({ sort })}
              onOpenFilters={() => setFiltersOpen(true)}
              search={
                <PokemonSearchBox
                  label={SEARCH_LABEL}
                  placeholder={SEARCH_PLACEHOLDER}
                  onSelect={openPokemon}
                />
              }
            />
          </div>

          {error ? (
            <ErrorState
              message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
              onRetry={() => void refetch()}
            />
          ) : isPending ? (
            <PokemonGridSkeleton />
          ) : data.content.length === 0 ? (
            <EmptyState
              title="Không có Pokémon nào khớp bộ lọc"
              description={emptyResultMessage(filter)}
              action={clearButton}
            />
          ) : (
            <div
              aria-busy={isPlaceholderData}
              className={`transition-opacity duration-150 ${isPlaceholderData ? 'opacity-60' : ''}`}
            >
              {view === 'list' ? (
                <PokemonList pokemon={data.content} />
              ) : (
                <PokemonGrid pokemon={data.content} />
              )}
              <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
            </div>
          )}
        </section>
      </PageBody>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        footer={
          <>
            <button
              type="button"
              onClick={clearFilter}
              className={`flex-1 ${buttonClassName('secondary')}`}
            >
              Xóa bộ lọc
            </button>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className={`flex-[1.4] ${buttonClassName('primary')}`}
            >
              {data ? `Xem ${formatNumber(data.totalElements)} kết quả` : 'Xem kết quả'}
            </button>
          </>
        }
      >
        <DexFilters filter={filter} onChange={updateFilter} layout="sheet" />
      </FilterSheet>
    </>
  )
}
