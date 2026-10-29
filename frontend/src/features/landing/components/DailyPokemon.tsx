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
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import { SCENES, sceneForTypes } from '../../../lib/scenes'
import { usePokemonDetail } from '../../pokemon-detail/hooks'
import { describeDefense } from '../describeDefense'
import { dailyPokemonId } from '../regions'
import { Aura, Blob } from './SectionDecor'

const dateFormat = new Intl.DateTimeFormat('vi-VN', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export function DailyPokemon({ date = new Date() }: { date?: Date }) {
  const id = dailyPokemonId(date)
  const { data, isPending, isError, error, refetch } = usePokemonDetail(id)
  const scene = data ? sceneForTypes(data.types) : 'grassland'
  const primaryType = data?.types[0]
  const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

  return (
    <section
      aria-labelledby="daily-title"
      className={`relative overflow-hidden bg-linear-to-b from-band-rose to-band-cream px-4 pt-[110px] pb-14 md:px-6 md:pt-[152px] md:pb-[110px] ${primaryType ? typeScopeClassName(primaryType) : ''}`}
    >
      <Aura>
        <Blob className="top-0 -left-[40%] size-[420px] from-type-fighting/20 md:-left-[8%] md:size-[640px]" />
        <Blob
          drift="b"
          className="-right-[40%] bottom-0 size-[440px] from-type-steel-deep/26 md:-right-[10%] md:-bottom-[20%] md:size-[720px]"
        />
        {data && (
          <p className="text-outline absolute top-[30px] -left-3 -rotate-5 font-display text-[92px]/none whitespace-nowrap uppercase select-none [--outline-color:color-mix(in_oklab,var(--type-base)_18%,transparent)] [--outline-width:1.5px] md:top-[34px] md:-right-10 md:left-auto md:-rotate-4 md:text-[220px] md:[--outline-color:color-mix(in_oklab,var(--type-base)_16%,transparent)] md:[--outline-width:2px]">
            {formatPokemonName(data.name)}
          </p>
        )}
      </Aura>
      <Reveal className="relative mx-auto flex max-w-7xl flex-col rounded-[22px] border-3 border-ink bg-surface shadow-[0_5px_0_rgb(22_33_62/0.22),0_26px_40px_-24px_color-mix(in_oklab,var(--type-base,var(--color-ink))_45%,transparent)] md:flex-row md:rounded-3xl md:shadow-block-lg">
        <div className="relative h-60 flex-none md:h-auto md:min-h-95 md:flex-[1_1_440px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 overflow-hidden rounded-t-[19px] md:rounded-l-[21px] md:rounded-tr-none"
          >
            <SceneBackdrop scene={scene} />
          </div>
          <span
            aria-hidden="true"
            className="absolute top-[176px] left-1/2 h-[30px] w-[200px] -translate-x-1/2 animate-float-shadow rounded-full bg-radial-[closest-side] from-ink/55 to-transparent md:top-[252px] md:w-[220px]"
          />
          <div className="absolute -top-[84px] left-1/2 z-10 size-[230px] -translate-x-1/2 md:-top-[88px] md:size-[300px]">
            <div className="absolute inset-0 animate-float">
              <span
                aria-hidden="true"
                className={`type-blob absolute inset-2.5 rotate-4 rounded-[52%_48%_54%_46%/46%_54%_48%_52%] border-6 border-white shadow-[0_0_0_3px_var(--color-ink),8px_10px_0_0_rgb(22_33_62/0.35)] md:inset-3 md:border-7 md:shadow-[0_0_0_3px_var(--color-ink),10px_14px_0_0_rgb(22_33_62/0.35)]`}
              />
              <PokemonSprite
                id={id}
                alt={data ? `Artwork ${formatPokemonName(data.name)}` : 'Artwork Pokémon hôm nay'}
                size={300}
                variant="artwork"
                className="absolute bottom-3 left-1/2 w-[108%] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_8px_0_rgb(22_33_62/0.3)]"
              />
            </div>
          </div>
          <p className="absolute bottom-4 left-4 rounded-full bg-scrim/80 px-3 py-1.5 text-[13px]/[18px] font-bold text-white">
            Khung cảnh: {SCENES[scene].name}
          </p>
        </div>

        <div className="flex flex-col gap-4 px-4 py-5 md:flex-[1_1_440px] md:px-10 md:py-9">
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
