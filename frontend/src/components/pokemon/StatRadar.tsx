import type { Stats } from '../../types/api'
import { describeStats, STAT_AXES, STAT_MAX } from './statAxes'

type StatRadarProps = {
  title: string
  series: readonly { label: string; stats: Stats; tone: 'primary' | 'accent' }[]
  max?: number
}

type Tone = StatRadarProps['series'][number]['tone']

const VIEW_WIDTH = 420
const VIEW_HEIGHT = 380
const CENTER_X = 210
const CENTER_Y = 186
const RADIUS = 120
const LABEL_GAP = 18
const LINE_HEIGHT = 17
const RING_STEPS = [0.25, 0.5, 0.75, 1]
const RADAR_DELAY_MS = 300
const RADAR_STEP_MS = 150

const TONE_CLASSES: Record<Tone, { shape: string; dot: string; line: string; dash?: string }> = {
  primary: { shape: 'stroke-primary fill-primary/25', dot: 'fill-primary', line: 'stroke-primary' },
  accent: {
    shape: 'stroke-accent fill-accent/25',
    dot: 'fill-accent',
    line: 'stroke-accent',
    dash: '8 5',
  },
}

function angleAt(index: number): number {
  return -Math.PI / 2 + (index * 2 * Math.PI) / STAT_AXES.length
}

function round(value: number): number {
  return Math.round(value * 10) / 10
}

function pointAt(index: number, ratio: number): [number, number] {
  const angle = angleAt(index)
  return [
    round(CENTER_X + RADIUS * ratio * Math.cos(angle)),
    round(CENTER_Y + RADIUS * ratio * Math.sin(angle)),
  ]
}

function ratioOf(value: number, max: number): number {
  return Math.min(Math.max(value, 0), max) / max
}

function ringPath(ratio: number): string {
  return `${STAT_AXES.map((_, index) => `${index === 0 ? 'M' : 'L'}${pointAt(index, ratio).join(' ')}`).join(' ')} Z`
}

function labelPosition(
  index: number,
  lineCount: number,
): { x: number; y: number; anchor: 'start' | 'middle' | 'end' } {
  const angle = angleAt(index)
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  const x = round(CENTER_X + (RADIUS + LABEL_GAP) * cos)
  const y = CENTER_Y + (RADIUS + LABEL_GAP) * sin
  const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end'
  const firstBaseline =
    sin < -0.2
      ? y - (lineCount - 1) * LINE_HEIGHT
      : sin > 0.2
        ? y + LINE_HEIGHT * 0.8
        : y + 5 - ((lineCount - 1) * LINE_HEIGHT) / 2
  return { x, y: round(firstBaseline), anchor }
}

export function StatRadar({ title, series, max = STAT_MAX }: StatRadarProps) {
  const scale = max > 0 ? max : STAT_MAX
  const ariaLabel = [title, ...series.map((item) => `${item.label}: ${describeStats(item.stats)}`)]
    .join('. ')
    .concat('.')

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        role="img"
        aria-label={ariaLabel}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        className="h-auto w-full max-w-110 overflow-visible"
      >
        <g className="fill-none stroke-border" strokeWidth={1.5}>
          {RING_STEPS.map((step) => (
            <path key={step} d={ringPath(step)} />
          ))}
          <path
            d={STAT_AXES.map(
              (_, index) => `M${CENTER_X} ${CENTER_Y} L${pointAt(index, 1).join(' ')}`,
            ).join(' ')}
          />
        </g>
        {series.map((item, seriesIndex) => {
          const tone = TONE_CLASSES[item.tone]
          const points = STAT_AXES.map((axis, index) =>
            pointAt(index, ratioOf(item.stats[axis.key], scale)),
          )
          return (
            <g
              key={item.label}
              className="animate-radar-in"
              style={{
                transformOrigin: `${CENTER_X}px ${CENTER_Y}px`,
                animationDelay: `${RADAR_DELAY_MS + seriesIndex * RADAR_STEP_MS}ms`,
              }}
            >
              <polygon
                points={points.map((point) => point.join(',')).join(' ')}
                className={tone.shape}
                strokeWidth={3}
                strokeLinejoin="round"
                strokeDasharray={tone.dash}
              />
              {points.map(([x, y], index) => (
                <circle key={STAT_AXES[index]?.key} cx={x} cy={y} r={4} className={tone.dot} />
              ))}
            </g>
          )
        })}
        {STAT_AXES.map((axis, index) => {
          const position = labelPosition(index, axis.lines.length)
          return (
            <text
              key={axis.key}
              x={position.x}
              y={position.y}
              textAnchor={position.anchor}
              className="fill-ink-muted text-[15px] font-extrabold"
            >
              {axis.lines.map((line, lineIndex) => (
                <tspan key={line} x={position.x} dy={lineIndex === 0 ? 0 : LINE_HEIGHT}>
                  {line}
                </tspan>
              ))}
            </text>
          )
        })}
      </svg>
      <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm font-extrabold">
        {series.map((item) => {
          const tone = TONE_CLASSES[item.tone]
          return (
            <li key={item.label} className="flex items-center gap-2">
              <svg aria-hidden="true" viewBox="0 0 28 8" className="h-2 w-7">
                <path
                  d="M2 4h24"
                  className={tone.line}
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray={tone.dash ? '6 4' : undefined}
                />
              </svg>
              {item.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
