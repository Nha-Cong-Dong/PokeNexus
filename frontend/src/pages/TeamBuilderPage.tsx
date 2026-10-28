import { useCallback, useMemo, useState } from 'react'

import { PokemonSearchBox } from '../components/pokemon/PokemonSearchBox'
import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { EmptyState } from '../components/ui/EmptyState'
import { Panel } from '../components/ui/Panel'
import { MAX_TEAM_SIZE } from '../features/team-builder/api'
import { CoverageAndStats } from '../features/team-builder/components/CoverageAndStats'
import { RecommendationList } from '../features/team-builder/components/RecommendationList'
import { SaveTeamDialog } from '../features/team-builder/components/SaveTeamDialog'
import { TeamScoreGauge } from '../features/team-builder/components/TeamScoreGauge'
import { TeamSlots } from '../features/team-builder/components/TeamSlots'
import { AnalysisHeatmap } from '../features/team-builder/components/WeaknessHeatmap'
import { useRecommendations, useTeamAnalysis } from '../features/team-builder/hooks'
import { analysisSummary, buildTeamMembers } from '../features/team-builder/teamAnalysis'
import { useTeamDraft } from '../features/team-builder/useTeamDraft'
import { formatPokemonName } from '../lib/formatters'
import type { PokemonRef, Recommendation } from '../types/api'

const SAMPLE_TEAM = [6, 130, 149, 663, 637]
const SEARCH_INPUT_ID = 'team-search'
const SLOTS_TITLE_ID = 'team-slots-title'
const SCORE_TITLE_ID = 'team-score-title'
const HEATMAP_TITLE_ID = 'team-heatmap-title'
const ATTACK_TITLE_ID = 'team-attack-title'
const RECOMMENDATION_TITLE_ID = 'team-recommendation-title'

function toRef({ id, name, types }: PokemonRef): PokemonRef {
  return { id, name, types }
}

export function TeamBuilderPage() {
  const draft = useTeamDraft()
  const [excludeLegendary, setExcludeLegendary] = useState(false)
  const recommendations = useRecommendations(draft.ids, excludeLegendary)
  const [knownRefs, setKnownRefs] = useState<Record<number, PokemonRef>>({})
  const [saveOpen, setSaveOpen] = useState(false)

  const activeSixthId =
    draft.isFull && draft.sixth !== null && !draft.ids.includes(draft.sixth) ? draft.sixth : null
  const teamIds = useMemo(
    () => (activeSixthId !== null ? [...draft.ids, activeSixthId] : draft.ids),
    [draft.ids, activeSixthId],
  )
  const analysis = useTeamAnalysis(teamIds)
  const hasMembers = draft.ids.length > 0
  const analysisData = hasMembers ? analysis.data : undefined
  const freshAnalysis = analysis.isPlaceholderData ? undefined : analysisData
  const suggestion =
    draft.isFull && !recommendations.isPlaceholderData
      ? (recommendations.data?.items[0] ?? null)
      : null

  const refFor = useCallback(
    (id: number) => analysisData?.members.find((member) => member.id === id) ?? knownRefs[id],
    [analysisData, knownRefs],
  )

  const remember = (pokemon: PokemonRef) =>
    setKnownRefs((previous) =>
      previous[pokemon.id] ? previous : { ...previous, [pokemon.id]: toRef(pokemon) },
    )

  const handleSelect = (pokemon: PokemonRef) => {
    remember(pokemon)
    draft.add(pokemon.id)
  }

  const handleRemove = (id: number) => {
    draft.remove(id)
    if (activeSixthId !== null) {
      draft.add(activeSixthId)
      draft.setSixth(null)
    }
  }

  const handleAddRecommendation = (recommendation: Recommendation) => {
    remember(recommendation)
    if (draft.isFull) draft.setSixth(recommendation.id)
    else draft.add(recommendation.id)
  }

  const saveMembers = buildTeamMembers(draft.ids, activeSixthId)
  const memberNames = saveMembers.map(({ pokemonId }) => {
    const pokemon = refFor(pokemonId)
    return pokemon ? formatPokemonName(pokemon.name) : `#${pokemonId}`
  })
  const memberCount = saveMembers.length

  return (
    <>
      <PageHero
        scene="stadium"
        wide
        title="Xây đội"
        subtitle="Chọn tối đa 5 Pokémon, đọc bản đồ điểm yếu, rồi để PokeNexus đề xuất slot thứ 6."
      />
      <PageBody
        scene="stadium"
        wide
        className="grid items-start gap-4 md:gap-6 lg:grid-cols-[20rem_minmax(0,1fr)] min-[84rem]:grid-cols-[19rem_minmax(0,1fr)_18rem]"
      >
        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          <Panel aria-labelledby={SLOTS_TITLE_ID} className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id={SLOTS_TITLE_ID} className="text-xl font-extrabold">
                Đội của bạn
              </h2>
              <span className="text-sm font-extrabold text-ink-muted">
                {memberCount} / {MAX_TEAM_SIZE}
              </span>
            </div>
            {draft.isFull ? (
              <p className="text-sm text-ink-muted">
                Đã đủ 5 thành viên. Slot 6 dành cho đề xuất; bỏ bớt một thành viên để thêm Pokémon
                khác.
              </p>
            ) : (
              <PokemonSearchBox
                id={SEARCH_INPUT_ID}
                label="Thêm Pokémon"
                placeholder="Tìm theo tên, ví dụ Garchomp"
                excludeIds={teamIds}
                onSelect={handleSelect}
              />
            )}
            <TeamSlots
              ids={draft.ids}
              refFor={refFor}
              sixthId={activeSixthId}
              suggestion={suggestion}
              unavailable={analysis.isError}
              onRemove={handleRemove}
              onRemoveSixth={() => draft.setSixth(null)}
              onAddSuggestion={() => suggestion && handleAddRecommendation(suggestion)}
              onAddClick={() => document.getElementById(SEARCH_INPUT_ID)?.focus()}
            />
          </Panel>

          <Panel aria-labelledby={SCORE_TITLE_ID} className="flex flex-col gap-4">
            <h2 id={SCORE_TITLE_ID} className="text-xl font-extrabold">
              Điểm đội
            </h2>
            <div className="flex flex-col gap-3">
              {!hasMembers ? (
                <p className="text-ink-muted">Thêm ít nhất 1 Pokémon để tính điểm đội.</p>
              ) : analysisData ? (
                <TeamScoreGauge
                  score={analysisData.teamScore}
                  teamKey={analysisData.members.map((member) => member.id).join(',')}
                />
              ) : analysis.isError ? (
                <p className="text-ink-muted">Chưa tính được điểm đội.</p>
              ) : (
                <div
                  aria-hidden="true"
                  className="h-16 animate-pulse rounded-xl bg-surface-muted"
                />
              )}
              <p aria-live="polite" className="text-ink-muted">
                {freshAnalysis ? analysisSummary(freshAnalysis) : ''}
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <button
                type="button"
                onClick={() => setSaveOpen(true)}
                disabled={!hasMembers}
                className={buttonClassName('primary')}
              >
                Lưu đội
              </button>
              <button
                type="button"
                onClick={draft.clear}
                disabled={!hasMembers}
                className={buttonClassName('secondary')}
              >
                Đặt lại
              </button>
            </div>
          </Panel>
        </div>

        <div className="flex min-w-0 flex-col gap-4 md:gap-6">
          <Panel aria-labelledby={HEATMAP_TITLE_ID} className="flex flex-col gap-3">
            <h2 id={HEATMAP_TITLE_ID} className="text-xl font-extrabold">
              Bản đồ điểm yếu
            </h2>
            {hasMembers ? (
              <AnalysisHeatmap analysis={analysis} />
            ) : (
              <EmptyState
                title="Đội đang trống"
                description="Tìm Pokémon ở ô Thêm Pokémon để bắt đầu, hoặc thử đội mẫu Charizard, Gyarados, Dragonite, Talonflame, Volcarona."
                action={
                  <button
                    type="button"
                    onClick={() => draft.replace(SAMPLE_TEAM)}
                    className={buttonClassName('primary')}
                  >
                    Dùng đội mẫu
                  </button>
                }
              />
            )}
          </Panel>

          <Panel aria-labelledby={ATTACK_TITLE_ID} className="flex flex-col gap-4">
            <h2 id={ATTACK_TITLE_ID} className="text-xl font-extrabold">
              Tấn công và chỉ số
            </h2>
            {!hasMembers ? (
              <p className="text-ink-muted">
                Thêm thành viên để xem độ phủ tấn công và chỉ số trung bình của đội.
              </p>
            ) : analysisData ? (
              <div className={analysis.isPlaceholderData ? 'opacity-60' : ''}>
                <CoverageAndStats analysis={analysisData} />
              </div>
            ) : analysis.isError ? (
              <p className="text-ink-muted">Chưa có kết quả phân tích.</p>
            ) : (
              <div aria-hidden="true" className="h-48 animate-pulse rounded-xl bg-surface-muted" />
            )}
          </Panel>
        </div>

        <section
          aria-labelledby={RECOMMENDATION_TITLE_ID}
          className="flex min-w-0 flex-col gap-4 lg:col-span-2 min-[84rem]:col-span-1"
        >
          <h2
            id={RECOMMENDATION_TITLE_ID}
            className="rounded-2xl bg-ink px-4 py-2.5 text-xl font-extrabold text-surface"
          >
            {draft.isFull ? 'Đề xuất slot thứ 6' : 'Đề xuất thành viên tiếp theo'}
          </h2>
          <label className="flex min-h-10 cursor-pointer items-center gap-3 rounded-2xl border-2 border-border bg-surface px-4 py-2 font-bold">
            <input
              type="checkbox"
              checked={excludeLegendary}
              onChange={(event) => setExcludeLegendary(event.target.checked)}
              className="size-5 flex-none accent-primary"
            />
            Loại huyền thoại, thần thoại và Paradox
          </label>
          {hasMembers ? (
            <RecommendationList
              recommendations={recommendations}
              teamIds={draft.ids}
              sixthId={activeSixthId}
              onAdd={handleAddRecommendation}
            />
          ) : (
            <p className="rounded-2xl border-2 border-border bg-surface p-4 text-ink-muted">
              Thêm ít nhất 1 Pokémon để nhận 3 đề xuất bù lỗ hổng của đội.
            </p>
          )}
        </section>
      </PageBody>

      <SaveTeamDialog
        open={saveOpen}
        onClose={() => setSaveOpen(false)}
        members={saveMembers}
        memberNames={memberNames}
      />
    </>
  )
}
