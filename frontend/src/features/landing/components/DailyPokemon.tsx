import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { SCENES, sceneForTypes } from '../../../lib/scenes'
import { usePokemonDetail } from '../../pokemon-detail/hooks'
import { describeDefense } from '../describeDefense'
import { dailyPokemonId } from '../regions'

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function DailyPokemon({ date = new Date() }: { date?: Date }) {
  const id = dailyPokemonId(date)
  const { data, isPending, isError, error, refetch } = usePokemonDetail(id)
  const scene = data ? sceneForTypes(data.types) : 'grassland'
  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  return (
    <section
      aria-labelledby="daily-title"
      className="bg-linear-to-b from-surface-muted to-bg px-4 py-16 md:px-6 md:py-24"
    >
      <Reveal className="mx-auto grid max-w-6xl overflow-hidden rounded-3xl border-2 border-ink bg-surface shadow-block-lg md:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-64 overflow-hidden border-b-2 border-ink md:min-h-96 md:border-r-2 md:border-b-0">
          <SceneBackdrop scene={scene} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex size-52 items-center justify-center rounded-full border-6 border-white bg-surface-muted shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.35)] md:size-64">
              <PokemonSprite
                id={id}
                alt={data ? `Artwork ${formatPokemonName(data.name)}` : 'Artwork Pokémon hôm nay'}
                size={224}
                variant="artwork"
                className="size-44 object-contain md:size-56"
              />
            </div>
          </div>
          <p className="absolute bottom-3 left-3 rounded-full bg-scrim/85 px-3 py-1 text-xs font-bold text-white">
            Khung cảnh: {SCENES[scene].name}
          </p>
        </div>

        <div className="flex flex-col gap-4 p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="daily-title" className="text-2xl font-extrabold">
              Pokémon hôm nay
            </h2>
            <time
              dateTime={isoDate}
              className="rounded-full bg-surface-muted px-3 py-1 text-sm font-bold text-ink-muted"
            >
              {dateFormat.format(date)}
            </time>
          </div>
          {isError ? (
            <ErrorState
              message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
              onRetry={() => void refetch()}
            />
          ) : isPending || !data ? (
            <p className="text-ink-muted">Đang tìm Pokémon của ngày hôm nay...</p>
          ) : (
            <>
              <p className="flex items-baseline gap-3">
                <DexNumber id={data.id} className="text-lg text-ink-muted" />
                <span className="text-4xl font-extrabold">{formatPokemonName(data.name)}</span>
              </p>
              <p className="flex flex-wrap gap-1.5">
                {data.types.map((type) => (
                  <TypeBadge key={type} type={type} size="md" />
                ))}
              </p>
              <p className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink-muted">Tổng chỉ số</span>
                <span className="tabular-nums text-num-lg font-extrabold">
                  {data.baseStatTotal}
                </span>
              </p>
              <p className="max-w-[54ch] text-lg/7">{describeDefense(data)}</p>
              <div className="mt-2 flex flex-wrap gap-3">
                <Link to={`/pokemon/${data.name}`} className={buttonClassName('primary')}>
                  Xem chi tiết
                </Link>
                <Link to={`/team-builder?add=${data.id}`} className={buttonClassName('secondary')}>
                  Thêm vào đội
                </Link>
              </div>
            </>
          )}
        </div>
      </Reveal>
    </section>
  )
}
