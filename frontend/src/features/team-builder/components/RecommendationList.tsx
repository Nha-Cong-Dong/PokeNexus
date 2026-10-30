import type { UseQueryResult } from '@tanstack/react-query'

import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatNumber } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { staggerDelay } from '../../../lib/motion'
import type { Recommendation, RecommendationResponse } from '../../../types/api'
import { RECOMMENDATION_LIMIT } from '../api'
import { RecommendationCard, RecommendationSkeleton } from './RecommendationCard'

type RecommendationListProps = {
  recommendations: UseQueryResult<RecommendationResponse>
  teamIds: readonly number[]
  sixthId: number | null
  onAdd: (recommendation: Recommendation) => void
}

const LIST_CLASS =
  '-mx-3 flex snap-x snap-mandatory scroll-px-3 gap-3 overflow-x-auto px-3 pt-13.5 pb-3.5 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-4 md:overflow-visible md:p-0 lg:grid-cols-3 min-[84rem]:grid-cols-1'

export function RecommendationList({
  recommendations,
  teamIds,
  sixthId,
  onAdd,
}: RecommendationListProps) {
  if (recommendations.isError) {
    const code = recommendations.error instanceof ApiError ? recommendations.error.code : undefined
    return (
      <ErrorState message={errorMessageFor(code)} onRetry={() => void recommendations.refetch()} />
    )
  }

  const data = recommendations.data
  if (!data) {
    return (
      <div aria-busy="true" className={LIST_CLASS}>
        <span className="sr-only">Đang tìm đề xuất…</span>
        {Array.from({ length: RECOMMENDATION_LIMIT }, (_, index) => (
          <RecommendationSkeleton key={index} />
        ))}
      </div>
    )
  }

  if (data.items.length === 0) {
    return (
      <EmptyState
        title="Chưa có ứng viên phù hợp"
        description="Mọi ứng viên đã tiến hóa hoàn toàn đều trùng với đội hoặc bị loại. Bỏ bớt một thành viên để xem đề xuất mới."
      />
    )
  }

  const busy = recommendations.isPlaceholderData

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-ink-muted">
        Chọn từ {formatNumber(data.candidateCount)} ứng viên đã tiến hóa hoàn toàn, xếp theo điểm
        phù hợp 0-100.
      </p>
      <ol
        aria-busy={busy}
        className={`${LIST_CLASS} transition-opacity duration-150 ${busy ? 'opacity-60' : ''}`}
      >
        {data.items.map((item, index) => {
          const isSixth = item.id === sixthId
          const inTeam = teamIds.includes(item.id)
          return (
            <li
              key={item.id}
              className="flex w-75 flex-none animate-slide-in-right snap-start md:w-auto"
              style={staggerDelay(index, 90)}
            >
              <RecommendationCard
                recommendation={item}
                rank={index + 1}
                actionLabel={
                  isSixth ? 'Đang ở slot 6' : inTeam ? 'Đã có trong đội' : 'Thêm vào đội'
                }
                disabled={busy || isSixth || inTeam}
                onAdd={() => onAdd(item)}
              />
            </li>
          )
        })}
      </ol>
    </div>
  )
}
