import { useState } from 'react'
import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatNumber, formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import type { GenerationProfile } from '../../../types/api'
import { GENERATIONS, type GenerationInfo } from '../generations'
import { useGenerationProfiles } from '../hooks'
import { SPECIES_COUNT } from '../regions'
import { Aura, Blob } from './SectionDecor'
import { SectionTitle } from './SectionTitle'

const PROFILE_TITLE_ID = 'generation-profile-title'

export function GenerationChart() {
  const profiles = useGenerationProfiles()
  const [selected, setSelected] = useState(1)
  const byGeneration = new Map(profiles.data?.map((profile) => [profile.generation, profile]))
  const counts = profiles.data?.map((profile) => profile.speciesCount)
  const total = counts ? counts.reduce((sum, count) => sum + count, 0) : SPECIES_COUNT
  const max = counts ? Math.max(...counts, 1) : 1
  const selectedInfo = GENERATIONS.find((info) => info.generation === selected) ?? GENERATIONS[0]!
  const errorCode = profiles.error instanceof ApiError ? profiles.error.code : undefined

  return (
    <section
      aria-labelledby="gens-title"
      className="relative overflow-hidden bg-linear-to-b from-band-apricot to-band-mint px-4 pt-8 pb-14 md:px-6 md:pt-[70px] md:pb-[110px]"
    >
      <Aura>
        <Blob className="top-[20%] -left-[50%] size-[440px] from-type-grass/30 md:top-[10%] md:-left-[10%] md:size-[680px]" />
        <Blob
          drift="b"
          className="top-0 -right-[50%] size-[420px] from-type-psychic/20 md:-top-[14%] md:-right-[8%] md:size-[640px]"
        />
        <Blob className="right-[20%] -bottom-[30%] hidden size-[640px] from-type-water/26 md:block" />
        <p className="text-outline absolute top-1.5 -right-2.5 font-display text-[110px]/none whitespace-nowrap select-none [--outline-width:1.5px] md:top-2.5 md:right-[3%] md:text-[260px] md:[--outline-width:2px]">
          {total}
        </p>
      </Aura>
      <div className="relative mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <SectionTitle id="gens-title">{`${formatNumber(total)} loài qua 9 thế hệ`}</SectionTitle>
          <p className="max-w-[50ch] text-lg/7 text-ink-muted">
            Mỗi cột là số loài mới của một thế hệ. Bấm một cột để xem hồ sơ thế hệ: Pokémon khởi
            đầu, hệ phổ biến, sức mạnh trung bình.
          </p>
        </div>

        <Reveal className="mt-7 rounded-3xl border-3 border-ink bg-surface px-4 pt-5 pb-4 shadow-block-lg md:px-6 md:pt-7 md:pb-[22px]">
          {profiles.isError ? (
            <ErrorState
              message={errorMessageFor(errorCode)}
              onRetry={() => void profiles.refetch()}
            />
          ) : (
            <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[minmax(0,1fr)_21rem] lg:items-start lg:gap-6">
              <div className="-mx-1 overflow-x-auto px-1 pt-1 pb-1">
                <ol className="grid min-w-190 grid-cols-9 items-end gap-3">
                  {GENERATIONS.map((generation, index) => {
                    const count = byGeneration.get(generation.generation)?.speciesCount
                    const height = count === undefined ? 30 : Math.max((count / max) * 100, 4)
                    const isSelected = generation.generation === selected
                    return (
                      <li key={generation.generation}>
                        <button
                          type="button"
                          aria-pressed={isSelected}
                          aria-label={`Thế hệ ${generation.generation}, ${generation.region}: ${count === undefined ? 'đang tải' : `${count} loài`}. Xem hồ sơ thế hệ`}
                          onClick={() => setSelected(generation.generation)}
                          className="group flex w-full cursor-pointer flex-col items-stretch gap-2 rounded-xl p-1 text-ink focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                        >
                          <span className="text-center text-lg font-extrabold tabular-nums">
                            {count === undefined ? (profiles.isPending ? '...' : '-') : count}
                          </span>
                          <span className="-mx-2.5 flex h-60 items-end border-b-3 border-ink px-2.5">
                            <span
                              className={`reveal-grow-y block w-full rounded-t-xl border-2 border-b-0 border-ink transition-[filter,opacity] duration-150 group-hover:brightness-110 ${isSelected ? '' : 'opacity-55 group-hover:opacity-90'} ${count === undefined ? 'bg-surface-muted' : `bar-stripes ${generation.barClassName}`}`}
                              style={{ height: `${height}%`, animationDelay: `${index * 70}ms` }}
                            />
                          </span>
                          <span className="text-center text-xs font-bold text-ink-muted tabular-nums">
                            {generation.year}
                          </span>
                          <span
                            className={`self-center rounded-full px-2 py-0.5 text-center text-sm font-extrabold ${isSelected ? 'bg-ink text-surface' : ''}`}
                          >
                            {generation.region}
                          </span>
                          <span className="text-center text-xs font-bold text-ink-muted">
                            Thế hệ {generation.generation}
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ol>
              </div>
              <GenerationProfileCard
                info={selectedInfo}
                profile={byGeneration.get(selected)}
                pending={profiles.isPending}
              />
            </div>
          )}
        </Reveal>
      </div>
    </section>
  )
}

type GenerationProfileCardProps = {
  info: GenerationInfo
  profile: GenerationProfile | undefined
  pending: boolean
}

function GenerationProfileCard({ info, profile, pending }: GenerationProfileCardProps) {
  const topCount = profile?.topTypes[0]?.count ?? 1
  return (
    <article
      aria-labelledby={PROFILE_TITLE_ID}
      aria-busy={pending}
      className="flex min-w-0 flex-col gap-4 rounded-2xl border-2 border-ink bg-bg p-4"
    >
      <div className="flex items-baseline justify-between gap-3">
        <h3 id={PROFILE_TITLE_ID} className="text-xl font-extrabold">
          Thế hệ {info.generation} · {info.region}
        </h3>
        <span className="text-sm font-bold text-ink-muted tabular-nums">{info.year}</span>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        {[
          { label: 'Loài mới', value: profile ? formatNumber(profile.speciesCount) : '...' },
          {
            label: 'BST trung bình',
            value: profile ? formatNumber(profile.averageBaseStatTotal) : '...',
          },
          {
            label: 'Huyền thoại, thần thoại',
            value: profile ? `${profile.legendaryCount} + ${profile.mythicalCount}` : '...',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col justify-between gap-1 rounded-xl bg-surface px-1.5 py-2"
          >
            <dt className="text-xs font-bold text-ink-muted">{item.label}</dt>
            <dd className="text-lg font-extrabold tabular-nums">{item.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-extrabold text-ink-muted">Pokémon khởi đầu</h4>
        <ul className="grid grid-cols-3 gap-2">
          {info.starters.map((starter) => {
            const name = formatPokemonName(starter.name)
            return (
              <li key={starter.id}>
                <Link
                  to={`/pokemon/${starter.id}`}
                  className="flex flex-col items-center gap-1 rounded-xl bg-surface px-1 py-2 text-center text-sm font-extrabold text-ink transition-colors duration-150 hover:bg-surface-muted"
                >
                  <PokemonSprite id={starter.id} alt="" size={48} />
                  <span className="max-w-full truncate">{name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="text-sm font-extrabold text-ink-muted">Hệ phổ biến</h4>
        {profile ? (
          <ul className="flex flex-col gap-1.5">
            {profile.topTypes.map((entry) => (
              <li
                key={entry.type}
                className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2"
              >
                <TypeBadge type={entry.type} />
                <span className="h-2.5 overflow-hidden rounded-full bg-surface-muted">
                  <span
                    className="block h-full rounded-full bg-ink/70"
                    style={{ width: `${(entry.count / topCount) * 100}%` }}
                  />
                </span>
                <span className="text-right text-sm font-extrabold tabular-nums">
                  {entry.count}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div aria-hidden="true" className="h-20 animate-pulse rounded-xl bg-surface-muted" />
        )}
      </div>

      {profile ? (
        <Link
          to={`/pokemon/${profile.strongest.id}`}
          className="flex items-center gap-3 rounded-xl bg-surface p-2 text-ink transition-colors duration-150 hover:bg-surface-muted"
        >
          <PokemonSprite id={profile.strongest.id} alt="" size={48} />
          <span className="flex min-w-0 flex-col">
            <span className="text-xs font-bold text-ink-muted">Mạnh nhất, trừ huyền thoại</span>
            <span className="truncate font-extrabold">
              {formatPokemonName(profile.strongest.name)}
            </span>
          </span>
          <span className="ml-auto text-sm font-extrabold tabular-nums">
            BST {profile.strongestBaseStatTotal}
          </span>
        </Link>
      ) : (
        <div aria-hidden="true" className="h-16 animate-pulse rounded-xl bg-surface-muted" />
      )}

      <Link to={`/pokedex?gen=${info.generation}`} className={buttonClassName('primary')}>
        Mở Pokédex thế hệ {info.generation}
      </Link>
    </article>
  )
}
