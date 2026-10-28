import { Link } from 'react-router'

import { Reveal } from '../../../components/motion/Reveal'

import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { TypeGlyph } from '../../../components/pokemon/TypeGlyph'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { formatMultiplier } from '../../../lib/formatters'
import { typeClassName } from '../../../lib/pokemonTypes'
import type { TypeName } from '../../../types/api'
import { SectionTitle } from './SectionTitle'

const SAMPLE_TEAM: readonly TypeName[] = ['fire', 'water', 'rock', 'fighting', 'ghost']

const SAMPLE_HEATMAP: readonly { type: TypeName; multipliers: number[]; critical: boolean }[] = [
  { type: 'electric', multipliers: [2, 4, 1, 1, 1], critical: true },
  { type: 'rock', multipliers: [4, 1, 0.5, 2, 1], critical: false },
  { type: 'ground', multipliers: [2, 1, 2, 1, 0], critical: false },
]

function SlotsIllustration() {
  return (
    <div aria-hidden="true" className="grid grid-cols-3 gap-2 rounded-2xl bg-surface-muted p-3">
      {SAMPLE_TEAM.map((type) => (
        <span
          key={type}
          className={`flex h-12 items-center justify-center rounded-xl border-2 border-ink ${typeClassName(type)}`}
        >
          <TypeGlyph type={type} className="size-6" strokeWidth={2} />
        </span>
      ))}
      <span className="flex h-12 items-center justify-center rounded-xl border-2 border-dashed border-border-strong text-2xl font-bold text-ink-muted">
        +
      </span>
    </div>
  )
}

function HeatmapIllustration() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-2 overflow-hidden rounded-2xl bg-surface-muted p-3"
    >
      {SAMPLE_HEATMAP.map((row) => (
        <div
          key={row.type}
          className={`flex items-center gap-1.5 border-l-4 pl-1.5 ${row.critical ? 'border-danger' : 'border-transparent'}`}
        >
          <span className="w-17 flex-none">
            <TypeBadge type={row.type} />
          </span>
          {row.multipliers.map((multiplier, index) => (
            <span
              key={index}
              className={`flex h-6 min-w-0 flex-1 items-center justify-center rounded-md text-xs font-extrabold ${multiplierClassName(multiplier)}`}
            >
              {formatMultiplier(multiplier)}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function ShareIllustration() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-2 rounded-2xl bg-surface-muted p-3">
      <span className="flex items-center gap-3 rounded-xl border-2 border-ink bg-surface px-3 py-2">
        <span
          className={`flex size-9 items-center justify-center rounded-full ${typeClassName('dragon')}`}
        >
          <TypeGlyph type="dragon" className="size-5" strokeWidth={2} />
        </span>
        <span className="flex flex-1 flex-col">
          <span className="text-sm font-extrabold">Garchomp</span>
          <span className="text-xs font-bold text-ink-muted">Miễn nhiễm Electric</span>
        </span>
        <span className="tabular-nums text-lg font-extrabold">98</span>
      </span>
      <span className="tabular-nums font-bold rounded-xl border-2 border-dashed border-border-strong bg-surface px-3 py-2 text-sm text-ink-muted">
        /team/K7Q2XM8a
      </span>
    </div>
  )
}

const STEPS = [
  {
    title: 'Chọn 5 Pokémon',
    description: 'Tìm theo tên, mỗi slot mang màu hệ của Pokémon đó.',
    illustration: <SlotsIllustration />,
  },
  {
    title: 'Đọc bản đồ điểm yếu',
    description: 'Hệ nào cả đội cùng sợ mà không ai kháng sẽ được đánh dấu là lỗ hổng.',
    illustration: <HeatmapIllustration />,
  },
  {
    title: 'Thêm slot 6 và chia sẻ',
    description: 'Nhận Pokémon che lỗ hổng tốt nhất, lưu đội và gửi link cho đồng đội.',
    illustration: <ShareIllustration />,
  },
]

export function TeamSteps() {
  return (
    <section aria-labelledby="steps-title" className="bg-bg px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <SectionTitle id="steps-title">Xây đội trong 3 bước</SectionTitle>
          <Link to="/team-builder" className={buttonClassName('primary')}>
            Xây đội ngay
          </Link>
        </div>
        <ol className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex min-w-0">
              <Reveal
                variant="up"
                delay={index * 140}
                className="flex min-w-0 flex-1 flex-col gap-4 rounded-3xl border-2 border-ink bg-surface p-5 shadow-block-lg transition-[translate,rotate] duration-200 ease-out hover:-translate-y-1 hover:-rotate-[0.5deg]"
              >
                <div className="flex items-center gap-3">
                  <span className="tabular-nums flex size-10 flex-none items-center justify-center rounded-full border-2 border-ink bg-dex-yellow text-lg font-extrabold">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-extrabold md:text-2xl">{step.title}</h3>
                </div>
                <p className="text-ink-muted">{step.description}</p>
                <div className="mt-auto">{step.illustration}</div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
