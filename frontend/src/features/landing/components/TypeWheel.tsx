import { useState } from 'react'
import { Link } from 'react-router'

import {
  multiplierClassName,
  multiplierWeightClassName,
} from '../../../components/pokemon/multiplierStyles'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { ApiError } from '../../../lib/http'
import { TYPE_NAMES, typeClassName, typeLabel, typeScopeClassName } from '../../../lib/pokemonTypes'
import { attackProfile, type AttackProfile } from '../../../lib/typeEffectiveness'
import type { TypeName } from '../../../types/api'
import { useTypeMatrix } from '../../typechart/hooks'
import { Aura, Blob, Spark } from './SectionDecor'
import { SectionTitle } from './SectionTitle'

const RADIUS_PERCENT = 42

function chipPosition(index: number): { left: number; top: number } {
  const angle = ((index * 360) / TYPE_NAMES.length - 90) * (Math.PI / 180)
  return {
    left: 50 + RADIUS_PERCENT * Math.cos(angle),
    top: 50 + RADIUS_PERCENT * Math.sin(angle),
  }
}

function badgeFor(type: TypeName, profile: AttackProfile | undefined): number | undefined {
  if (!profile) return undefined
  if (profile.superEffective.includes(type)) return 2
  if (profile.notVeryEffective.includes(type)) return 0.5
  if (profile.noEffect.includes(type)) return 0
  return undefined
}

function connectorPath(selected: TypeName, profile: AttackProfile | undefined): string {
  const source = chipPosition(TYPE_NAMES.indexOf(selected))
  const segments = (profile?.superEffective ?? [])
    .filter((type) => type !== selected)
    .map((type) => {
      const target = chipPosition(TYPE_NAMES.indexOf(type))
      return `M${source.left.toFixed(2)} ${source.top.toFixed(2)} Q50 50 ${target.left.toFixed(2)} ${target.top.toFixed(2)}`
    })
  return segments.length > 0 ? segments.join(' ') : 'M50 50'
}

const BADGE_LABELS: Record<number, string> = { 2: 'x2', 0.5: 'x½', 0: 'x0' }

type EffectRowProps = {
  multiplier: number
  types: TypeName[]
}

function EffectRow({ multiplier, types }: EffectRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <dt
        className={`inline-flex h-7 w-11 items-center justify-center rounded-md text-sm ${multiplierClassName(multiplier)} ${multiplierWeightClassName(multiplier)}`}
      >
        {BADGE_LABELS[multiplier]}
      </dt>
      <dd className="flex flex-wrap gap-1.5">
        {types.length > 0 ? (
          types.map((type) => <TypeBadge key={type} type={type} />)
        ) : (
          <span className="text-sm text-ink-muted">Không có</span>
        )}
      </dd>
    </div>
  )
}

export function TypeWheel() {
  const [selected, setSelected] = useState<TypeName>('fire')
  const { data: matrix, isPending, isError, error, refetch } = useTypeMatrix()
  const profile = matrix ? attackProfile(matrix, selected) : undefined
  const errorCode = error instanceof ApiError ? error.code : undefined

  return (
    <section
      aria-labelledby="wheel-title"
      className={`relative overflow-hidden bg-scrim bg-radial-[at_72%_50%] from-(--type-base)/32 to-transparent to-55% px-4 pt-16 pb-24 text-white md:px-6 md:pt-[70px] md:pb-[170px] ${typeScopeClassName(selected)}`}
    >
      <Aura>
        <Blob
          drift="b"
          className="-top-[20%] -left-[40%] size-[440px] from-type-dragon/34 md:-left-[12%] md:size-[760px]"
        />
        <Blob className="-bottom-[30%] left-[30%] size-[420px] from-type-ice-deep/38 md:size-[700px]" />
        <Blob className="top-[10%] -right-[30%] size-[360px] from-type-psychic/22 md:-right-[6%] md:size-[520px]" />
      </Aura>
      <div aria-hidden="true">
        <Spark
          outlined={false}
          className="top-[90px] left-[6%] w-[18px] fill-dex-yellow"
          style={{ animationDelay: '0.4s' }}
        />
        <Spark
          outlined={false}
          className="top-[60px] left-[44%] w-3 fill-white"
          style={{ animationDelay: '1.5s' }}
        />
        <Spark
          outlined={false}
          className="bottom-[170px] left-[30%] w-3.5 fill-type-ice"
          style={{ animationDelay: '2.2s' }}
        />
        <svg
          viewBox="0 0 200 200"
          className="pointer-events-none absolute -top-[180px] -right-[180px] hidden size-[520px] stroke-white opacity-8 motion-safe:animate-spin-slow md:block"
          fill="none"
          strokeWidth="1"
        >
          <circle cx="100" cy="100" r="96" strokeDasharray="2 6" />
          <circle cx="100" cy="100" r="70" />
        </svg>
      </div>
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex max-w-130 flex-col gap-5">
          <SectionTitle id="wheel-title" tone="dark">
            Vòng tương khắc
          </SectionTitle>
          <p className="text-lg/7 text-white/85">
            Chọn một hệ trên vòng. Đường cam nối tới những hệ nó gây x2; các hệ chặn được đòn hiện
            nhãn xanh.
          </p>
          <div
            aria-live="polite"
            className="rounded-[20px] border-3 border-ink bg-surface px-[22px] py-5 text-ink shadow-[0_6px_0_rgb(0_0_0/0.3)]"
          >
            <p className="flex items-center gap-2.5 text-lg font-extrabold">
              <TypeBadge type={selected} size="md" />
              khi tấn công
            </p>
            {isError ? (
              <ErrorState message={errorMessageFor(errorCode)} onRetry={() => void refetch()} />
            ) : isPending || !profile ? (
              <p className="mt-4 text-ink-muted">Đang tải bảng tương khắc...</p>
            ) : (
              <dl className="mt-4 flex flex-col gap-3">
                <EffectRow multiplier={2} types={profile.superEffective} />
                <EffectRow multiplier={0.5} types={profile.notVeryEffective} />
                <EffectRow multiplier={0} types={profile.noEffect} />
              </dl>
            )}
            <Link
              to="/types"
              className="mt-4 inline-flex min-h-10 items-center font-extrabold text-primary underline"
            >
              Mở bảng tương khắc đầy đủ
            </Link>
          </div>
        </div>

        <div className="mx-auto w-full max-w-140 lg:mx-0">
          <div role="group" aria-label="Chọn hệ tấn công" className="relative aspect-square w-full">
            <svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="absolute inset-0 size-full overflow-visible"
            >
              <circle
                cx="50"
                cy="50"
                r={RADIUS_PERCENT}
                fill="none"
                className="stroke-white/15"
                strokeWidth="0.4"
              />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                className="stroke-white/12"
                strokeWidth="0.3"
                strokeDasharray="0.6 1.6"
              />
              <path
                key={`${selected}-${profile ? 'ready' : 'waiting'}`}
                d={connectorPath(selected, profile)}
                pathLength={100}
                strokeDasharray="100"
                fill="none"
                className="stroke-mult-2 motion-safe:animate-draw"
                strokeWidth="0.7"
                strokeLinecap="round"
              />
            </svg>
            <div
              key={selected}
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 animate-pop-in flex-col items-center justify-center gap-1 rounded-full border-3 border-(--type-base) bg-scrim-raised shadow-[0_0_0_8px_rgb(255_255_255/0.05),0_0_60px_color-mix(in_oklab,var(--type-base)_32%,transparent)]"
            >
              <TypeGlyph
                type={selected}
                className="size-[38%] text-(--type-base)"
                strokeWidth={1.6}
              />
              <span className="text-base/5 font-extrabold text-white md:text-lg/[22px]">
                {typeLabel(selected)}
              </span>
            </div>
            {TYPE_NAMES.map((type, index) => {
              const position = chipPosition(index)
              const active = type === selected
              const badge = active ? undefined : badgeFor(type, profile)
              const dimmed = profile !== undefined && !active && badge === undefined
              const ring = active
                ? 'border-dex-yellow'
                : badge === 2
                  ? 'border-mult-2'
                  : 'border-white/30'
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${typeLabel(type)}${badge === undefined ? '' : `, nhận ${BADGE_LABELS[badge]}`}`}
                  onClick={() => setSelected(type)}
                  className={`group absolute flex -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center gap-1 rounded-full transition-[scale] duration-300 ease-[cubic-bezier(0.3,0.7,0.4,1)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white ${active ? 'z-10 scale-120' : ''}`}
                  style={{ left: `${position.left}%`, top: `${position.top}%` }}
                >
                  <span
                    className={`relative flex size-11 items-center justify-center rounded-full border-3 transition-[opacity,box-shadow] duration-300 group-hover:opacity-100 group-hover:shadow-[0_0_0_4px_rgb(255_255_255/0.35)] group-focus-visible:opacity-100 md:size-13 ${typeClassName(type)} ${ring} ${dimmed ? 'opacity-40' : ''}`}
                  >
                    <TypeGlyph type={type} className="size-5.5 md:size-6.5" strokeWidth={1.9} />
                    {badge !== undefined && (
                      <span
                        aria-hidden="true"
                        className={`absolute -top-2 -right-3 inline-flex h-5 min-w-[30px] items-center justify-center rounded-md border-2 border-ink px-1 text-[11px] font-extrabold ${multiplierClassName(badge)}`}
                      >
                        {BADGE_LABELS[badge]}
                      </span>
                    )}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`hidden text-[11px]/[14px] font-extrabold transition-opacity duration-300 group-hover:opacity-100 md:block ${dimmed ? 'opacity-40' : ''}`}
                  >
                    {typeLabel(type)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
