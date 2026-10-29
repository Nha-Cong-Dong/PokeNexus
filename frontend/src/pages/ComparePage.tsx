import { useState } from 'react'
import { Link } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { ComparePicker } from '../features/compare/components/ComparePicker'
import { CompareRadar } from '../features/compare/components/CompareRadar'
import { StabPanel } from '../features/compare/components/StabPanel'
import { StatDuelTable } from '../features/compare/components/StatDuelTable'
import { VersusBanner, VersusBannerSkeleton } from '../features/compare/components/VersusBanner'
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
  const pair =
    leftDetail.data && rightDetail.data && !sameChoice
      ? { left: leftDetail.data, right: rightDetail.data }
      : undefined
  const pairPending =
    pair === undefined &&
    left !== undefined &&
    right !== undefined &&
    !sameChoice &&
    !missingSide &&
    !detailError &&
    (leftDetail.isPending || rightDetail.isPending)
  const versus = pair !== undefined || pairPending

  const select = (side: CompareSide, pokemon: PokemonRef): boolean => {
    const other = otherSide(side)
    if (matches(keys[other], pokemon) || details[other].data?.id === pokemon.id) {
      setNotice(
        `${formatPokemonName(pokemon.name)} đã ở ${SIDE_NAMES[other]}. Hãy chọn một Pokémon khác.`,
      )
      return false
    }
    setNotice('')
    setSide(side, pokemon.name)
    return true
  }

  const clear = (side: CompareSide) => {
    setNotice('')
    setSide(side, undefined)
  }

  const slotOf = (side: CompareSide) => ({
    value: keys[side],
    pokemon: details[side].data,
    notFound: isNotFound(details[side].error),
    failed: details[side].isError,
  })

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
    const leftName = formatPokemonName(result.left.name)
    const rightName = formatPokemonName(result.right.name)
    return (
      <div key={`${result.left.id}-${result.right.id}`} className="flex flex-col gap-4 md:gap-6">
        <div className="grid gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <StatDuelTable left={result.left} right={result.right} />
          <CompareRadar left={result.left} right={result.right} className="lg:order-first" />
        </div>
        <div className="grid items-start gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
          <StabPanel left={result.left} right={result.right} />
          <VerdictPanel result={result} />
        </div>
        <div className="mt-1.5 flex gap-2.5 md:hidden">
          <Link
            to={`/pokemon/${result.right.name}`}
            className={`min-w-0 flex-1 text-center leading-5 max-md:h-13 max-md:px-2 ${buttonClassName('secondary')}`}
          >
            Xem {rightName}
          </Link>
          <Link
            to={`/team-builder?add=${result.left.id}`}
            className={`min-w-0 flex-[1.3] text-center leading-5 max-md:h-13 max-md:px-2 ${buttonClassName('primary')}`}
          >
            Đưa {leftName} vào đội
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {pair ? (
        <VersusBanner
          key={`${pair.left.id}-${pair.right.id}`}
          left={pair.left}
          right={pair.right}
        />
      ) : pairPending ? (
        <VersusBannerSkeleton />
      ) : (
        <PageHero
          scene="stadium"
          title="Bàn Cân Sức Mạnh"
          subtitle="Đặt hai Pokémon lên bàn cân: chỉ số, tốc độ và lợi thế hệ."
        />
      )}
      <PageBody
        scene={versus ? undefined : 'stadium'}
        className={`flex flex-col gap-4 md:gap-6 ${versus ? 'pt-[calc(var(--hero-overlap)+3.75rem)] md:pt-[calc(var(--hero-overlap)+6.875rem)]' : ''}`}
      >
        <ComparePicker
          slots={{ left: slotOf('left'), right: slotOf('right') }}
          notice={notice}
          bare={versus}
          onSelect={select}
          onClear={clear}
          onSwap={() => {
            setNotice('')
            swap()
          }}
        />
        {renderResult()}
      </PageBody>
    </>
  )
}

function CompareSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-6">
      <p className="sr-only">Đang cân sức mạnh hai Pokémon…</p>
      <div aria-hidden="true" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-surface-muted" />
      </div>
    </div>
  )
}
