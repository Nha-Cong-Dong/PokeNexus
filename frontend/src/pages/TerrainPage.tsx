import { Navigate, useParams } from 'react-router'

import { TypeBadge } from '../components/pokemon/TypeBadge'
import { PageBody, PageHero } from '../components/scene/PageHero'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Panel } from '../components/ui/Panel'
import { TerrainPicker } from '../features/terrain/components/TerrainPicker'
import { TerrainPokemon } from '../features/terrain/components/TerrainPokemon'
import { WhosThatPokemon } from '../features/terrain/components/WhosThatPokemon'
import { useTerrainPool } from '../features/terrain/hooks'
import {
  DEFAULT_TERRAIN,
  isTerrainId,
  TERRAIN_BADGES,
  TERRAIN_DESCRIPTIONS,
  TERRAIN_IDS,
  terrainBadgeId,
  terrainTypes,
} from '../features/terrain/terrains'
import { TrainerCard } from '../features/trainer/components/TrainerCard'
import { useTrainerProgress } from '../features/trainer/useTrainerProgress'
import { errorMessageFor } from '../lib/errorMessages'
import { formatNumber } from '../lib/formatters'
import { typeLabel } from '../lib/pokemonTypes'
import { SCENES } from '../lib/scenes'

const PICKER_TITLE_ID = 'terrain-picker-title'
const OVERVIEW_TITLE_ID = 'terrain-overview-title'
const GAME_TITLE_ID = 'whos-that-title'
const LIST_TITLE_ID = 'terrain-pokemon-title'

function Skeleton({ label, className }: { label: string; className: string }) {
  return (
    <div
      role="status"
      aria-busy="true"
      className={`animate-pulse rounded-2xl bg-surface-muted ${className}`}
    >
      <span className="sr-only">{label}</span>
    </div>
  )
}

export function TerrainPage() {
  const { terrainId } = useParams()
  const valid = terrainId === undefined || isTerrainId(terrainId)
  const terrain = isTerrainId(terrainId) ? terrainId : DEFAULT_TERRAIN
  const types = terrainTypes(terrain)
  const pool = useTerrainPool(types)
  const { progress, update } = useTrainerProgress()

  if (!valid) return <Navigate to="/terrain" replace />

  const scene = SCENES[terrain]
  const error = pool.isError ? (
    <ErrorState message={errorMessageFor(pool.errorCode)} onRetry={pool.retry} />
  ) : null

  return (
    <>
      <PageHero
        scene={terrain}
        title="Địa hình"
        subtitle={`${TERRAIN_IDS.length} vùng địa hình, Pokémon sống ở đó và trò chơi Who's that Pokémon?`}
      />
      <PageBody scene={terrain} className="flex flex-col gap-6">
        <Panel aria-labelledby={PICKER_TITLE_ID}>
          <h2 id={PICKER_TITLE_ID} className="mb-4 text-2xl font-extrabold">
            Chọn địa hình
          </h2>
          <TerrainPicker selected={terrain} ownedBadges={progress.badges} />
        </Panel>

        <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
          <Panel aria-labelledby={OVERVIEW_TITLE_ID} className="flex flex-col gap-4">
            <h2 id={OVERVIEW_TITLE_ID} className="text-2xl font-extrabold">
              {scene.name}
            </h2>
            <p className="text-lg/7">{TERRAIN_DESCRIPTIONS[terrain]}</p>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-bold text-ink-muted">Hệ thường gặp:</span>
              {types.map((type) => (
                <TypeBadge key={type} type={type} size="md" />
              ))}
            </div>
            {pool.totals.length > 0 && (
              <p className="text-ink-muted">
                {pool.totals.map(({ type, total }, index) => (
                  <span key={type}>
                    {index > 0 && ', '}
                    <span className="tabular-nums font-extrabold text-ink">
                      {formatNumber(total)}
                    </span>{' '}
                    Pokémon mang hệ {typeLabel(type)}
                  </span>
                ))}{' '}
                (gồm dạng mặc định và dạng vùng miền).
              </p>
            )}
          </Panel>

          <Panel aria-labelledby={GAME_TITLE_ID}>
            <h2 id={GAME_TITLE_ID} className="mb-4 text-2xl font-extrabold">
              Who&apos;s that Pokémon?
            </h2>
            {error ??
              (pool.pokemon === undefined ? (
                <Skeleton label="Đang chuẩn bị trò chơi" className="h-64" />
              ) : (
                <WhosThatPokemon
                  key={terrain}
                  terrain={terrain}
                  pool={pool.pokemon}
                  ownsBadge={progress.badges.includes(terrainBadgeId(terrain))}
                  onProgress={update}
                />
              ))}
          </Panel>
        </div>

        <Panel aria-labelledby={LIST_TITLE_ID}>
          <h2 id={LIST_TITLE_ID} className="mb-4 text-2xl font-extrabold">
            Pokémon thường gặp ở {scene.name}
          </h2>
          {error ??
            (pool.pokemon === undefined ? (
              <Skeleton label="Đang tải Pokémon" className="h-72" />
            ) : pool.pokemon.length === 0 ? (
              <EmptyState
                title="Chưa có Pokémon nào"
                description="Máy chủ chưa trả về Pokémon cho địa hình này. Dữ liệu có thể đang được nạp."
              />
            ) : (
              <TerrainPokemon pool={pool.pokemon} totals={pool.totals} />
            ))}
        </Panel>

        <TrainerCard
          progress={progress}
          badges={TERRAIN_BADGES}
          badgeTitle="Huy hiệu địa hình"
          headingLevel="h2"
        />
      </PageBody>
    </>
  )
}
