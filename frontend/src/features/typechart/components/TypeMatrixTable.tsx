import { multiplierClassName } from '../../../components/pokemon/multiplierStyles'
import { NeutralMark } from '../../../components/pokemon/NeutralMark'
import { formatMultiplier } from '../../../lib/formatters'
import { typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import { singleMultiplier } from '../../../lib/typeEffectiveness'
import type { TypeMatrix, TypeName } from '../../../types/api'
import { matrixTypes } from '../defense'
import { isCellLit, isFocused, type MatrixAxis, type MatrixFocus } from '../matrixFocus'

const CELL_WAVE_STEP_MS = 18
const HEAD_BUTTON = 'group/head flex w-full cursor-pointer items-center focus-visible:outline-none'
const HEAD_PILL =
  'transition-transform duration-150 ease-out group-hover/head:scale-106 group-focus-visible/head:outline-2 group-focus-visible/head:outline-offset-2 group-focus-visible/head:outline-focus-ring'
const PRESSED_RING = 'shadow-[0_0_0_3px_var(--color-surface),0_0_0_5px_var(--color-ink)]'
const CELL =
  'flex h-7 w-8 animate-cell-in items-center justify-center rounded-lg text-xs tabular-nums md:h-8 md:w-9 md:text-[13px]'

type TypeMatrixTableProps = {
  matrix: TypeMatrix
  focus: MatrixFocus | null
  onFocus: (focus: MatrixFocus) => void
  className?: string
}

function MatrixCell({ multiplier, delayMs }: { multiplier: number; delayMs: number }) {
  const style = { animationDelay: `${delayMs}ms` }
  if (multiplier === 1) {
    return (
      <span className={CELL} style={style}>
        <NeutralMark />
      </span>
    )
  }
  const weight = multiplier === 0 || multiplier === 4 ? 'font-extrabold' : 'font-bold'
  return (
    <span className={`${CELL} ${weight} ${multiplierClassName(multiplier)}`} style={style}>
      {formatMultiplier(multiplier)}
    </span>
  )
}

export function TypeMatrixTable({ matrix, focus, onFocus, className = '' }: TypeMatrixTableProps) {
  const types = matrixTypes(matrix)
  const headProps = (axis: MatrixAxis, type: TypeName) => ({
    type: 'button' as const,
    'aria-pressed': isFocused(focus, axis, type),
    onClick: () => onFocus({ axis, type }),
  })

  return (
    <div
      role="region"
      aria-label="Ma trận tương khắc, cuộn ngang để xem đủ cột"
      tabIndex={0}
      className={`relative min-w-0 overflow-auto rounded-l-xl border border-r-0 border-border md:max-h-190 md:rounded-2xl md:border-r ${className}`}
    >
      <table className="border-separate border-spacing-0">
        <caption className="sr-only">
          Hàng là hệ tấn công, cột là hệ phòng thủ. Ô trống là x1. Bấm tên hệ ở hàng hoặc cột để làm
          nổi bật.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 left-0 z-30 min-w-21 bg-surface py-1.5 pr-1.5 pl-2 text-left align-bottom text-[0.6875rem]/[0.8125rem] font-extrabold text-ink-muted md:min-w-30 md:pt-2 md:pr-2 md:pl-2.5 md:text-xs"
            >
              Tấn công ↓
              <br />
              Phòng thủ →
            </th>
            {types.map((type) => {
              const pressed = isFocused(focus, 'defense', type)
              return (
                <th
                  key={type}
                  scope="col"
                  className={`sticky top-0 bg-surface p-0 ${pressed ? 'z-25' : 'z-20'}`}
                >
                  <button
                    {...headProps('defense', type)}
                    title={typeLabel(type)}
                    className={`${HEAD_BUTTON} justify-center px-0.5 py-1.5 md:pt-2`}
                  >
                    <span
                      className={`${HEAD_PILL} flex size-8 items-center justify-center rounded-lg text-[0.6875rem] font-extrabold md:h-10 md:w-9 md:rounded-[10px] md:text-xs ${typeClassName(type)} ${pressed ? PRESSED_RING : ''}`}
                    >
                      <span aria-hidden="true">{typeLabel(type).slice(0, 3)}</span>
                      <span className="sr-only">{typeLabel(type)}</span>
                    </span>
                  </button>
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody>
          {types.map((attacking, row) => {
            const pressed = isFocused(focus, 'attack', attacking)
            return (
              <tr key={attacking} className="group/row">
                <th
                  scope="row"
                  className={`sticky left-0 bg-surface p-0 text-left ${pressed ? 'z-15' : 'z-10'}`}
                >
                  <button
                    {...headProps('attack', attacking)}
                    className={`${HEAD_BUTTON} py-0.75 pr-1.5 pl-2 md:py-0.5 md:pr-2 md:pl-2.5`}
                  >
                    <span
                      className={`${HEAD_PILL} flex h-6.5 items-center rounded-full px-2 text-xs font-extrabold md:h-8 md:w-26 md:px-3 md:text-[13px] ${typeClassName(attacking)} ${pressed ? PRESSED_RING : ''}`}
                    >
                      {typeLabel(attacking)}
                    </span>
                  </button>
                </th>
                {types.map((defending, column) => {
                  const multiplier = singleMultiplier(matrix, attacking, defending)
                  const lit = isCellLit(focus, attacking, defending)
                  return (
                    <td
                      key={defending}
                      title={`${typeLabel(attacking)} tấn công ${typeLabel(defending)}: ${formatMultiplier(multiplier)}`}
                      className={`p-0.5 transition-[opacity,background-color] duration-150 ease-out group-hover/row:bg-mult-1 ${lit ? '' : 'opacity-20'}`}
                    >
                      <MatrixCell
                        multiplier={multiplier}
                        delayMs={(row + column) * CELL_WAVE_STEP_MS}
                      />
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
