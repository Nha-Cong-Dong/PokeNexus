import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { formatMultiplier } from '../../../lib/formatters'
import { typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import { singleMultiplier } from '../../../lib/typeEffectiveness'
import type { TypeMatrix } from '../../../types/api'
import { matrixTypes } from '../defense'

type TypeMatrixTableProps = {
  matrix: TypeMatrix
}

export function TypeMatrixTable({ matrix }: TypeMatrixTableProps) {
  const types = matrixTypes(matrix)

  return (
    <div
      role="region"
      aria-label="Ma trận tương khắc, cuộn ngang để xem đủ cột"
      tabIndex={0}
      className="relative max-h-184 overflow-auto rounded-2xl border border-border"
    >
      <table className="border-separate border-spacing-0">
        <caption className="sr-only">
          Hàng là hệ tấn công, cột là hệ phòng thủ. Ô có dấu chấm là x1.
        </caption>
        <thead>
          <tr>
            <th
              scope="col"
              className="sticky top-0 left-0 z-20 min-w-28 bg-surface px-2.5 pt-2 pb-1.5 text-left align-bottom text-xs font-extrabold text-ink-muted"
            >
              Tấn công ↓
              <br />
              Phòng thủ →
            </th>
            {types.map((type) => (
              <th
                key={type}
                scope="col"
                title={typeLabel(type)}
                className="sticky top-0 z-10 bg-surface px-0.5 pt-2 pb-1.5"
              >
                <span
                  className={`flex size-10 items-center justify-center rounded-[10px] text-xs font-extrabold ${typeClassName(type)}`}
                >
                  <span aria-hidden="true">{typeLabel(type).slice(0, 3)}</span>
                  <span className="sr-only">{typeLabel(type)}</span>
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {types.map((attacking) => (
            <tr key={attacking}>
              <th
                scope="row"
                className="sticky left-0 z-10 bg-surface py-0.5 pr-2 pl-2.5 text-left"
              >
                <span
                  className={`flex h-8 w-26 items-center rounded-full px-3 text-sm font-extrabold ${typeClassName(attacking)}`}
                >
                  {typeLabel(attacking)}
                </span>
              </th>
              {types.map((defending) => {
                const multiplier = singleMultiplier(matrix, attacking, defending)
                return (
                  <td
                    key={defending}
                    title={`${typeLabel(attacking)} tấn công ${typeLabel(defending)}: ${formatMultiplier(multiplier)}`}
                    className="p-0.5"
                  >
                    {multiplier === 1 ? (
                      <span className="flex h-8 w-10 items-center justify-center font-extrabold text-ink-muted">
                        <span aria-hidden="true">·</span>
                        <span className="sr-only">x1</span>
                      </span>
                    ) : (
                      <MultiplierCell multiplier={multiplier} className="h-8 w-10" />
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
