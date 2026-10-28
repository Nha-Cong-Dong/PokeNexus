import { Link } from 'react-router'

import { PageBody, PageHero } from '../../../components/scene/PageHero'
import { SceneBackdrop } from '../../../components/scene/SceneBackdrop'
import { buttonClassName } from '../../../components/ui/buttonStyles'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Panel } from '../../../components/ui/Panel'
import { errorMessageFor } from '../../../lib/errorMessages'

const PAGE_TITLE = 'Chi tiết Pokémon'

type PokemonNotFoundProps = {
  idOrName: string
}

type DetailErrorProps = {
  code: string | undefined
  onRetry: () => void
}

export function DetailSkeleton() {
  return (
    <div aria-busy="true">
      <div className="relative h-70 overflow-hidden bg-scrim lg:h-105">
        <SceneBackdrop scene="lab" />
      </div>
      <PageBody scene="lab" className="flex flex-col gap-6">
        <h1 className="sr-only">{PAGE_TITLE}</h1>
        <p role="status" className="sr-only">
          Đang tải dữ liệu Pokémon
        </p>
        <div className="h-80 animate-pulse rounded-3xl bg-surface-muted" />
        <div className="h-56 animate-pulse rounded-3xl bg-surface-muted" />
      </PageBody>
    </div>
  )
}

export function DetailError({ code, onRetry }: DetailErrorProps) {
  return (
    <>
      <PageHero scene="lab" title={PAGE_TITLE} />
      <PageBody scene="lab">
        <ErrorState message={errorMessageFor(code)} onRetry={onRetry} />
      </PageBody>
    </>
  )
}

export function PokemonNotFound({ idOrName }: PokemonNotFoundProps) {
  return (
    <>
      <PageHero scene="lab" title="Không tìm thấy Pokémon" />
      <PageBody scene="lab">
        <Panel aria-label="Hướng dẫn" className="flex flex-col items-start gap-4">
          <p className="max-w-prose text-ink-muted">
            Pokédex chưa ghi nhận Pokémon nào có tên hoặc số{' '}
            <span className="font-bold break-all text-ink">“{idOrName}”</span>. Kiểm tra lại chính
            tả, hoặc tìm trong Pokédex theo hệ và thế hệ.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/pokedex" className={buttonClassName('primary')}>
              Về Pokédex
            </Link>
            <Link to="/" className={buttonClassName('secondary')}>
              Về trang Tổng quan
            </Link>
          </div>
        </Panel>
      </PageBody>
    </>
  )
}
