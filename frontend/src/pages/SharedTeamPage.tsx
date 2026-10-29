import { useMemo } from 'react'
import { Link, useParams } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { ErrorState } from '../components/ui/ErrorState'
import { GameDialog } from '../components/ui/GameDialog'
import { Panel } from '../components/ui/Panel'
import { isValidShareCode } from '../features/team-builder/api'
import { ShareLinkField } from '../features/team-builder/components/ShareLinkField'
import { ReadOnlyTeamSlots } from '../features/team-builder/components/TeamSlots'
import { AnalysisHeatmap } from '../features/team-builder/components/WeaknessHeatmap'
import { useSharedTeam, useTeamAnalysis } from '../features/team-builder/hooks'
import { formatSavedDate, formatScore } from '../features/team-builder/teamAnalysis'
import { MAX_DRAFT_SIZE } from '../features/team-builder/useTeamDraft'
import { errorMessageFor } from '../lib/errorMessages'
import { ApiError } from '../lib/http'
import { staggerDelay } from '../lib/motion'
import { typeScopeClassName } from '../lib/pokemonTypes'

const DEFAULT_TITLE = 'Đội được chia sẻ'
const HEATMAP_TITLE_ID = 'shared-heatmap-title'
const USE_TITLE_ID = 'shared-use-title'

type ShareCodeBadgeProps = {
  code: string
  className: string
}

function ShareCodeBadge({ code, className }: ShareCodeBadgeProps) {
  return (
    <p
      className={`items-center gap-2.5 rounded-xl border-2 border-ink bg-surface px-3.5 py-2 text-ink ${className}`}
    >
      <span className="text-[0.8125rem] font-extrabold text-ink-muted">Mã đội</span>
      <span className="text-xl leading-5 font-extrabold tracking-[0.06em]">{code}</span>
    </p>
  )
}

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
  const analysisIds = useMemo(() => members.map((member) => member.id), [members])
  const draftIds = analysisIds.slice(0, MAX_DRAFT_SIZE)
  const analysis = useTeamAnalysis(analysisIds)

  const notFound = !validCode || isNotFound(team.error)
  const data = notFound ? undefined : team.data
  const score =
    data?.synergyScore ?? (analysis.isPlaceholderData ? undefined : analysis.data?.teamScore)
  const savedDate = data ? formatSavedDate(data.createdAt) : null
  const subtitle = data
    ? [
        `${members.length} thành viên${score !== undefined ? `, điểm đội ${formatScore(score)}` : ''}.`,
        savedDate ? `Lưu ngày ${savedDate}.` : null,
      ]
        .filter(Boolean)
        .join(' ')
    : undefined

  return (
    <>
      <PageHero
        scene="stadium"
        title={data?.name ?? DEFAULT_TITLE}
        subtitle={subtitle}
        eyebrow={
          data && (
            <p className="mb-2 hidden items-center rounded-full border border-white/35 bg-white/15 px-3 py-0.5 text-[0.8125rem] font-bold md:inline-flex">
              Đội được chia sẻ, chỉ xem
            </p>
          )
        }
        aside={data && <ShareCodeBadge code={data.shareCode} className="hidden md:flex" />}
        topBand={
          data && (
            <>
              <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-2.5">
                {members.map((member, index) => (
                  <span
                    key={member.slot}
                    className={`flex-1 origin-top animate-grow-y bg-(--type-base) ${typeScopeClassName(member.types[0] ?? 'normal')}`}
                    style={staggerDelay(index, 60)}
                  />
                ))}
              </div>
              <ShareCodeBadge
                code={data.shareCode}
                className="absolute top-5 right-3 flex md:hidden"
              />
            </>
          )
        }
      />
      <PageBody scene="stadium" className="flex flex-col gap-4 md:gap-6">
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
            <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(8.5rem,100%),1fr))] gap-3 md:grid-cols-[repeat(auto-fit,minmax(min(10.625rem,100%),1fr))] md:gap-3.5">
              {Array.from({ length: 6 }, (_, index) => (
                <li
                  key={index}
                  aria-hidden="true"
                  className="h-52 animate-pulse rounded-[18px] bg-surface-muted"
                />
              ))}
            </ul>
          </Panel>
        ) : (
          <>
            <Panel aria-label="Thành viên">
              <ReadOnlyTeamSlots members={members} />
            </Panel>

            <div className="grid items-start gap-4 md:gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
              <Panel aria-labelledby={HEATMAP_TITLE_ID} className="flex min-w-0 flex-col gap-3">
                <h2 id={HEATMAP_TITLE_ID} className="text-xl font-extrabold">
                  Các hệ đội đang hở
                </h2>
                {analysisIds.length > 0 ? (
                  <AnalysisHeatmap analysis={analysis} compact />
                ) : (
                  <p className="text-ink-muted">Đội không có thành viên để phân tích.</p>
                )}
              </Panel>

              <Panel aria-labelledby={USE_TITLE_ID} className="flex flex-col gap-4">
                <h2 id={USE_TITLE_ID} className="text-xl font-extrabold">
                  Dùng đội này
                </h2>
                <p className="text-ink-muted">
                  Mở trong Team Builder để sửa thành viên. Đội gốc của người chia sẻ không bị thay
                  đổi.
                </p>
                <Link
                  to={`/team-builder?ids=${draftIds.join(',')}${members[MAX_DRAFT_SIZE] ? `&six=${members[MAX_DRAFT_SIZE].id}` : ''}`}
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
