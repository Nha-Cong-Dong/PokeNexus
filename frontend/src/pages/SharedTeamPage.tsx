import { useMemo } from 'react'
import { Link, useParams } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { ErrorState } from '../components/ui/ErrorState'
import { GameDialog } from '../components/ui/GameDialog'
import { Panel } from '../components/ui/Panel'
import { isValidShareCode } from '../features/team-builder/api'
import { ShareLinkField } from '../features/team-builder/components/ShareLinkField'
import { TeamScoreGauge } from '../features/team-builder/components/TeamScoreGauge'
import { ReadOnlyTeamSlots } from '../features/team-builder/components/TeamSlots'
import { AnalysisHeatmap } from '../features/team-builder/components/WeaknessHeatmap'
import { useSharedTeam, useTeamAnalysis } from '../features/team-builder/hooks'
import { formatSavedDate, formatScore } from '../features/team-builder/teamAnalysis'
import { MAX_DRAFT_SIZE } from '../features/team-builder/useTeamDraft'
import { errorMessageFor } from '../lib/errorMessages'
import { ApiError } from '../lib/http'

const DEFAULT_TITLE = 'Đội được chia sẻ'
const MEMBERS_TITLE_ID = 'shared-members-title'
const HEATMAP_TITLE_ID = 'shared-heatmap-title'
const USE_TITLE_ID = 'shared-use-title'

function isNotFound(error: Error | null): boolean {
  return (
    error instanceof ApiError &&
    (error.status === 404 || error.code === 'TEAM_NOT_FOUND' || error.code === 'INVALID_PARAMETER')
  )
}

export function SharedTeamPage() {
  const { shareCode = '' } = useParams()
  const validCode = isValidShareCode(shareCode)
  const team = useSharedTeam(shareCode)
  const members = useMemo(
    () => [...(team.data?.members ?? [])].sort((a, b) => a.slot - b.slot),
    [team.data],
  )
  const analysisIds = useMemo(
    () => members.slice(0, MAX_DRAFT_SIZE).map((member) => member.id),
    [members],
  )
  const analysis = useTeamAnalysis(analysisIds)

  const notFound = !validCode || isNotFound(team.error)
  const data = notFound ? undefined : team.data
  const score =
    data?.synergyScore ?? (analysis.isPlaceholderData ? undefined : analysis.data?.teamScore)
  const savedDate = data ? formatSavedDate(data.createdAt) : null
  const subtitle = data
    ? [
        `${members.length} thành viên`,
        score !== undefined ? `điểm đội ${formatScore(score)}` : null,
        savedDate ? `lưu ngày ${savedDate}` : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : undefined

  return (
    <>
      <PageHero scene="stadium" title={data?.name ?? DEFAULT_TITLE} subtitle={subtitle} />
      <PageBody className="flex flex-col gap-4 md:gap-6">
        {notFound ? (
          <Panel aria-label="Không tìm thấy đội">
            <GameDialog speaker="Pokédex" className="mx-auto my-4 max-w-155">
              <h2 className="text-xl font-extrabold">Không tìm thấy đội</h2>
              <p className="mt-1.5 text-ink-muted">
                {errorMessageFor('TEAM_NOT_FOUND')} Mã chia sẻ gồm đúng 8 chữ cái hoặc chữ số, phân
                biệt hoa thường.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                <Link to="/team-builder" className={buttonClassName('primary')}>
                  Xây đội mới
                </Link>
                <Link to="/pokedex" className={buttonClassName('secondary')}>
                  Về Pokédex
                </Link>
              </div>
            </GameDialog>
          </Panel>
        ) : team.isError ? (
          <Panel aria-label="Lỗi tải đội">
            <ErrorState
              message={errorMessageFor(
                team.error instanceof ApiError ? team.error.code : undefined,
              )}
              onRetry={() => void team.refetch()}
            />
          </Panel>
        ) : !data ? (
          <Panel aria-label="Đang tải đội" aria-busy="true">
            <ul className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
              {Array.from({ length: 6 }, (_, index) => (
                <li
                  key={index}
                  aria-hidden="true"
                  className="h-40 animate-pulse rounded-2xl bg-surface-muted"
                />
              ))}
            </ul>
          </Panel>
        ) : (
          <>
            <Panel aria-labelledby={MEMBERS_TITLE_ID} className="flex flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={MEMBERS_TITLE_ID} className="text-xl font-extrabold">
                  Thành viên
                </h2>
                <span className="text-sm font-bold text-ink-muted">
                  Mã đội{' '}
                  <span className="font-extrabold tracking-wider text-ink">{data.shareCode}</span>
                </span>
              </div>
              <ReadOnlyTeamSlots members={members} />
            </Panel>

            <div className="grid items-start gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <Panel aria-labelledby={HEATMAP_TITLE_ID} className="flex min-w-0 flex-col gap-3">
                <h2 id={HEATMAP_TITLE_ID} className="text-xl font-extrabold">
                  Bản đồ điểm yếu
                </h2>
                {members.length > MAX_DRAFT_SIZE && (
                  <p className="text-sm text-ink-muted">
                    Phân tích 5 thành viên đầu theo thứ tự slot, giống cách tính điểm khi lưu.
                  </p>
                )}
                {analysisIds.length > 0 ? (
                  <AnalysisHeatmap analysis={analysis} />
                ) : (
                  <p className="text-ink-muted">Đội không có thành viên để phân tích.</p>
                )}
              </Panel>

              <Panel aria-labelledby={USE_TITLE_ID} className="flex flex-col gap-4">
                <h2 id={USE_TITLE_ID} className="text-xl font-extrabold">
                  Dùng đội này
                </h2>
                {score !== undefined ? (
                  <TeamScoreGauge score={score} teamKey={data.shareCode} />
                ) : (
                  <p className="text-ink-muted">Đội chưa có điểm.</p>
                )}
                <p className="text-ink-muted">
                  Mở trong Team Builder để sửa thành viên. Đội gốc của người chia sẻ không bị thay
                  đổi.
                </p>
                <Link
                  to={`/team-builder?ids=${analysisIds.join(',')}`}
                  className={buttonClassName('primary')}
                >
                  Mở trong Team Builder
                </Link>
                <ShareLinkField shareCode={data.shareCode} />
              </Panel>
            </div>
          </>
        )}
      </PageBody>
    </>
  )
}
