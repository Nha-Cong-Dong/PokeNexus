import { useState } from 'react'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { EmptyState } from '../components/ui/EmptyState'
import { ErrorState } from '../components/ui/ErrorState'
import { Panel } from '../components/ui/Panel'
import { DefenseResult } from '../features/typechart/components/DefenseResult'
import { DualTypePicker } from '../features/typechart/components/DualTypePicker'
import { MatrixFocusPanel } from '../features/typechart/components/MatrixFocusPanel'
import { MatrixLegend } from '../features/typechart/components/MatrixLegend'
import { TypeMatrixTable } from '../features/typechart/components/TypeMatrixTable'
import { useTypeMatrix } from '../features/typechart/hooks'
import { toggleFocus, type MatrixFocus } from '../features/typechart/matrixFocus'
import { useDefendingTypes } from '../features/typechart/useDefendingTypes'
import { errorMessageFor } from '../lib/errorMessages'
import { ApiError } from '../lib/http'

const PICKER_TITLE_ID = 'defense-picker-title'
const MATRIX_TITLE_ID = 'type-matrix-title'

export function TypeChartPage() {
  const { data: matrix, error, isPending, refetch } = useTypeMatrix()
  const { selected, toggle, clear } = useDefendingTypes()
  const [focus, setFocus] = useState<MatrixFocus | null>(null)

  return (
    <>
      <PageHero
        scene="lab"
        title="Bảng tương khắc"
        subtitle="18 hệ tấn công gặp 18 hệ phòng thủ. Ô trống là x1, nên bạn chỉ cần nhìn các ô có màu."
      />
      <PageBody scene="lab" className="flex flex-col gap-6">
        {error ? (
          <ErrorState
            message={errorMessageFor(error instanceof ApiError ? error.code : undefined)}
            onRetry={() => void refetch()}
          />
        ) : (
          <>
            <Panel
              aria-labelledby={PICKER_TITLE_ID}
              className="flex min-w-0 flex-wrap gap-6 max-md:rounded-[20px] max-md:p-4 lg:gap-7"
            >
              <DualTypePicker
                titleId={PICKER_TITLE_ID}
                selected={selected}
                onToggle={toggle}
                onClear={clear}
              />
              <DefenseResult matrix={matrix} defending={selected} />
            </Panel>

            <Panel
              aria-labelledby={MATRIX_TITLE_ID}
              className="min-w-0 max-md:rounded-[20px] max-md:py-4 max-md:pr-0 max-md:pl-4"
            >
              <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 max-md:pr-4">
                <div className="max-w-prose">
                  <h2 id={MATRIX_TITLE_ID} className="text-2xl font-extrabold">
                    Ma trận 18 × 18
                  </h2>
                  <p className="mt-1 text-ink-muted">
                    Bấm tên hệ ở hàng hoặc cột để làm nổi bật.
                    <span className="lg:hidden"> Vuốt ngang để xem đủ cột.</span>
                    <span className="hidden lg:inline"> Các ô khác mờ đi.</span>
                  </p>
                </div>
                <MatrixLegend />
              </div>
              {isPending ? (
                <div
                  key="matrix-loading"
                  role="status"
                  aria-busy="true"
                  className="h-160 animate-pulse rounded-2xl bg-surface-muted max-md:mr-4"
                >
                  <span className="sr-only">Đang tải ma trận tương khắc</span>
                </div>
              ) : matrix.types.length === 0 ? (
                <div className="max-md:pr-4">
                  <EmptyState
                    title="Chưa có dữ liệu tương khắc"
                    description="Máy chủ chưa trả về hệ nào. Dữ liệu có thể đang được nạp."
                    action={
                      <button
                        type="button"
                        onClick={() => void refetch()}
                        className={buttonClassName('primary')}
                      >
                        Tải lại
                      </button>
                    }
                  />
                </div>
              ) : (
                <div key="matrix" className="flex flex-wrap items-start gap-6">
                  <TypeMatrixTable
                    matrix={matrix}
                    focus={focus}
                    onFocus={(next) => setFocus((current) => toggleFocus(current, next))}
                    className="flex-[999_1_600px]"
                  />
                  <MatrixFocusPanel
                    matrix={matrix}
                    focus={focus}
                    onClear={() => setFocus(null)}
                    className="max-md:mr-4"
                  />
                </div>
              )}
            </Panel>
          </>
        )}
      </PageBody>
    </>
  )
}
