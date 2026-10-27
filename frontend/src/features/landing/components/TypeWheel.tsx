import { useState } from 'react'
import { Link } from 'react-router'

import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { ErrorState } from '../../../components/ui/ErrorState'
import { errorMessageFor } from '../../../lib/errorMessages'
import { ApiError } from '../../../lib/http'
import { TYPE_NAMES, typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import { attackProfile, type AttackProfile } from '../../../lib/typeEffectiveness'
import type { TypeName } from '../../../types/api'
import { useTypeMatrix } from '../../typechart/hooks'
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

const BADGE_LABELS: Record<number, string> = { 2: 'x2', 0.5: 'x½', 0: 'x0' }

type EffectRowProps = {
  multiplier: number
  types: TypeName[]
}

function EffectRow({ multiplier, types }: EffectRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <dt
        className={`inline-flex h-7 min-w-10 items-center justify-center rounded-md px-2 text-sm font-extrabold ${multiplierClassName(multiplier)}`}
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
      className="bg-scrim bg-radial-[at_72%_50%] from-primary/35 to-scrim to-60% px-4 py-16 text-white md:px-6 md:py-24"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
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
            className="rounded-2xl border-2 border-ink bg-surface p-5 text-ink shadow-block-lg"
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
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full">
              <circle
                cx="50"
                cy="50"
                r={RADIUS_PERCENT}
                fill="none"
                className="stroke-white/15"
                strokeWidth="0.4"
              />
              {profile?.superEffective.map((type) => {
                const target = chipPosition(TYPE_NAMES.indexOf(type))
                return (
                  <line
                    key={type}
                    x1="50"
                    y1="50"
                    x2={target.left}
                    y2={target.top}
                    className="stroke-mult-2"
                    strokeWidth="0.7"
                    strokeLinecap="round"
                  />
                )
              })}
            </svg>
            <div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 flex size-[30%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center gap-1 rounded-full border-4 border-mult-2 bg-scrim"
            >
              <TypeGlyph type={selected} className="size-1/3 text-white" strokeWidth={1.8} />
              <span className="text-sm font-extrabold md:text-lg">{typeLabel(selected)}</span>
            </div>
            {TYPE_NAMES.map((type, index) => {
              const position = chipPosition(index)
              const badge = badgeFor(type, profile)
              const active = type === selected
              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${typeLabel(type)}${badge === undefined ? '' : `, nhận ${BADGE_LABELS[badge]}`}`}
                  onClick={() => setSelected(type)}
                  className={`absolute flex size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center justify-center rounded-full border-2 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-white md:size-15 ${typeClassName(type)} ${active ? 'z-10 scale-110 border-dex-yellow ring-3 ring-dex-yellow' : 'border-ink'}`}
                  style={{ left: `${position.left}%`, top: `${position.top}%` }}
                >
                  <TypeGlyph type={type} className="size-5 md:size-6" strokeWidth={2} />
                  <span
                    aria-hidden="true"
                    className="hidden text-[0.6875rem] leading-3 font-extrabold md:block"
                  >
                    {typeLabel(type)}
                  </span>
                  {badge !== undefined && (
                    <span
                      aria-hidden="true"
                      className={`absolute -top-2 -right-2 rounded-md border border-ink px-1 text-[0.6875rem] leading-4 font-extrabold ${multiplierClassName(badge)}`}
                    >
                      {BADGE_LABELS[badge]}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
