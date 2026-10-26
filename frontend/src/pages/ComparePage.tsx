import { useState } from 'react'
import { Link } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Panel } from '../components/ui/Panel'
import { CompareRadar } from '../features/compare/components/CompareRadar'
import { CompareSlot } from '../features/compare/components/CompareSlot'
import { StatDuelTable } from '../features/compare/components/StatDuelTable'
import { VersusBanner } from '../features/compare/components/VersusBanner'
import { VerdictPanel } from '../features/compare/components/VerdictPanel'
import { useCompare } from '../features/compare/hooks'
import {
  otherSide,
  useCompareSearchParams,
  type CompareSide,
} from '../features/compare/useCompareSearchParams'
import { usePokemonDetail } from '../features/pokemon-detail/hooks'
import { errorMessageFor } from '../lib/errorMessages'
import { formatPokemonName } from '../lib/formatters'
import { ApiError } from '../lib/http'
import type { PokemonRef } from '../types/api'

const SPEAKER = 'Trọng tài'
const SIDE_NAMES: Record<CompareSide, string> = { left: 'bên trái', right: 'bên phải' }

function isNotFound(error: Error | null): boolean {
  return error instanceof ApiError && error.status === 404
}

function matches(key: string | undefined, pokemon: PokemonRef | undefined): boolean {
  if (key === undefined || pokemon === undefined) return false
  return key === pokemon.name || key === String(pokemon.id)
}

export function ComparePage() {
  const { left, right, setSide, swap } = useCompareSearchParams()
  const leftDetail = usePokemonDetail(left)
  const rightDetail = usePokemonDetail(right)
  const [notice, setNotice] = useState('')

  const keys: Record<CompareSide, string | undefined> = { left, right }
  const details = { left: leftDetail, right: rightDetail }
  const sameChoice =
    (left !== undefined && left === right) ||
    (leftDetail.data !== undefined && leftDetail.data.id === rightDetail.data?.id)
  const compare = useCompare(
    leftDetail.data && rightDetail.data && !sameChoice
      ? { left: leftDetail.data.name, right: rightDetail.data.name }
      : undefined,
  )
  const missingSide = (['left', 'right'] as const).find((side) => isNotFound(details[side].error))
  const detailError = [leftDetail, rightDetail].find(
    (query) => query.error && !isNotFound(query.error),
  )?.error

  const select = (side: CompareSide) => (pokemon: PokemonRef) => {
    const other = otherSide(side)
    if (matches(keys[other], pokemon) || details[other].data?.id === pokemon.id) {
      setNotice(
        `${formatPokemonName(pokemon.name)} đã ở ${SIDE_NAMES[other]}. Hãy chọn một Pokémon khác.`,
      )
      return
    }
    setNotice('')
    setSide(side, pokemon.name)
  }

  const clear = (side: CompareSide) => {
    setNotice('')
    setSide(side, undefined)
  }

  const slot = (side: CompareSide) => {
    const other = details[otherSide(side)].data
    return (
      <CompareSlot
        side={side}
        value={keys[side]}
        pokemon={details[side].data}
        notFound={isNotFound(details[side].error)}
        excludeIds={other ? [other.id] : []}
        onSelect={select(side)}
        onClear={() => clear(side)}
      />
    )
  }

  const renderResult = () => {
    if (left === undefined && right === undefined) {
      return (
        <EmptyState
          speaker={SPEAKER}
          title="Bàn cân đang trống"
          description="Tìm Pokémon cho bên trái và bên phải để so chỉ số, tốc độ và lợi thế hệ."
          action={
            <Link to="?left=garchomp&right=salamence" className={buttonClassName('primary')}>
              Thử Garchomp và Salamence
            </Link>
          }
        />
      )
    }
    if (missingSide) {
      return (
        <EmptyState
          speaker={SPEAKER}
          title="Không tìm thấy Pokémon"
          description={`Không có Pokémon nào mang tên "${keys[missingSide]}". Hãy tìm lại ở ô ${SIDE_NAMES[missingSide]}.`}
          action={
            <button
              type="button"
              onClick={() => clear(missingSide)}
              className={buttonClassName('primary')}
            >
              Bỏ chọn {SIDE_NAMES[missingSide]}
            </button>
          }
        />
      )
    }
    if (sameChoice) {
      return (
        <EmptyState
          speaker={SPEAKER}
          title="Hai bên đang là cùng một Pokémon"
          description="Bàn cân cần hai Pokémon khác nhau. Hãy đổi Pokémon ở một bên."
        />
      )
    }
    if (detailError) {
      return (
        <ErrorState
          message={errorMessageFor(detailError instanceof ApiError ? detailError.code : undefined)}
          onRetry={() => {
            if (leftDetail.error) void leftDetail.refetch()
            if (rightDetail.error) void rightDetail.refetch()
          }}
        />
      )
    }
    if (left === undefined || right === undefined) {
      const chosenSide: CompareSide = left === undefined ? 'right' : 'left'
      const chosen = details[chosenSide].data
      return (
        <EmptyState
          speaker={SPEAKER}
          title="Chọn thêm một Pokémon"
          description={`${chosen ? formatPokemonName(chosen.name) : 'Một Pokémon'} đã lên bàn cân. Tìm đối thủ cho ${SIDE_NAMES[otherSide(chosenSide)]}.`}
        />
      )
    }
    if (compare.error) {
      const code = compare.error instanceof ApiError ? compare.error.code : undefined
      if (code === 'INVALID_PARAMETER') {
        return (
          <EmptyState
            speaker={SPEAKER}
            title="Không so sánh được cặp này"
            description="Hai bên phải là hai Pokémon khác nhau. Hãy đổi Pokémon ở một bên."
          />
        )
      }
      return <ErrorState message={errorMessageFor(code)} onRetry={() => void compare.refetch()} />
    }
    if (compare.isPending) return <CompareSkeleton />

    const result = compare.data
    return (
      <div key={`${result.left.id}-${result.right.id}`} className="flex flex-col gap-6">
        <VersusBanner left={result.left} right={result.right} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
          <CompareRadar left={result.left} right={result.right} />
          <StatDuelTable left={result.left} right={result.right} />
        </div>
        <VerdictPanel result={result} />
      </div>
    )
  }

  return (
    <>
      <PageHero
        scene="stadium"
        title="Bàn Cân Sức Mạnh"
        subtitle="Đặt hai Pokémon lên bàn cân: chỉ số, tốc độ và lợi thế hệ."
      />
      <PageBody className="flex flex-col gap-6">
        <Panel aria-label="Chọn Pokémon" className="flex flex-col gap-3">
          <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
            {slot('left')}
            <button
              type="button"
              onClick={() => {
                setNotice('')
                swap()
              }}
              disabled={left === undefined && right === undefined}
              aria-label="Đổi bên hai Pokémon"
              className="inline-flex size-12 flex-none items-center justify-center self-center rounded-full border-2 border-ink bg-surface text-ink shadow-[0_3px_0_var(--color-ink)] transition-[transform,box-shadow,background-color] duration-150 ease-out not-disabled:cursor-pointer not-disabled:hover:bg-surface-muted not-disabled:active:translate-y-0.5 not-disabled:active:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5.5 rotate-90 md:rotate-0"
              >
                <path d="M4 8h14l-4-4M20 16H6l4 4" />
              </svg>
            </button>
            {slot('right')}
          </div>
          <p role="status" className={notice ? 'text-sm font-bold text-danger' : 'sr-only'}>
            {notice}
          </p>
        </Panel>
        {renderResult()}
      </PageBody>
    </>
  )
}

function CompareSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <p className="sr-only">Đang cân sức mạnh hai Pokémon…</p>
      <div
        aria-hidden="true"
        className="h-96 animate-pulse rounded-3xl border-2 border-border bg-surface-muted md:h-88 lg:h-96"
      />
      <div aria-hidden="true" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />
      </div>
    </div>
  )
}
