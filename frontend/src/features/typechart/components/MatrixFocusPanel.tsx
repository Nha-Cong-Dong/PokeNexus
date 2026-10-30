import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { typeClassName, typeLabel } from '../../../lib/pokemonTypes'
import type { TypeMatrix } from '../../../types/api'
import { axisRole, focusGroups, type MatrixFocus } from '../matrixFocus'

const TITLE_ID = 'matrix-focus-title'
const TITLE_BADGE = 'inline-flex h-7 items-center rounded-full px-3 text-sm font-extrabold'

type MatrixFocusPanelProps = {
  matrix: TypeMatrix
  focus: MatrixFocus | null
  onClear: () => void
  className?: string
}

export function MatrixFocusPanel({
  matrix,
  focus,
  onClear,
  className = '',
}: MatrixFocusPanelProps) {
  const groups = focus ? focusGroups(matrix, focus) : []

  return (
    <aside
      aria-labelledby={TITLE_ID}
      aria-live="polite"
      className={`flex min-w-0 flex-[1_1_280px] flex-col gap-4 rounded-2xl bg-bg p-4 md:px-5.5 md:pt-5 md:pb-5.5 ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 id={TITLE_ID} className="flex flex-wrap items-center gap-2 text-xl font-extrabold">
          {focus ? (
            <>
              <span className={`${TITLE_BADGE} ${typeClassName(focus.type)}`}>
                {typeLabel(focus.type)}
              </span>{' '}
              <span>{axisRole(focus.axis)}</span>
            </>
          ) : (
            <span className={`${TITLE_BADGE} bg-surface-muted text-ink`}>Chưa chọn</span>
          )}
        </h3>
        {focus && (
          <button type="button" onClick={onClear} className={buttonClassName('ghost', 'sm')}>
            Bỏ chọn
          </button>
        )}
      </div>
      {focus ? (
        <div key={`${focus.axis}-${focus.type}`} className="flex animate-fade-up flex-col gap-4">
          {groups.map((group) => (
            <div key={group.multiplier} className="flex flex-col gap-2">
              <p className="flex items-center gap-2 text-sm font-extrabold">
                <MultiplierCell multiplier={group.multiplier} className="h-6.5" />
                {group.title}
              </p>
              {group.types.length > 0 ? (
                <ul aria-label={group.title} className="flex flex-wrap gap-1.5">
                  {group.types.map((type) => (
                    <li key={type}>
                      <TypeBadge type={type} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ink-muted">Không có</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-ink-muted">
          Bấm một tên hệ ở hàng (tấn công) hoặc cột (phòng thủ) để xem tóm tắt tại đây.
        </p>
      )}
    </aside>
  )
}
