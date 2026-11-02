import { Link } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { Panel } from '../components/ui/Panel'

export function RouteErrorPage() {
  return (
    <>
      <PageHero scene="lab" title="Không hiển thị được trang" />
      <PageBody scene="lab">
        <Panel aria-label="Hướng dẫn" className="flex flex-col items-start gap-4">
          <p className="text-ink-muted">
            Trang gặp lỗi khi tải hoặc hiển thị. Nếu PokeNexus vừa được cập nhật, tải lại trang sẽ
            lấy phiên bản mới.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className={buttonClassName('primary')}
            >
              Tải lại trang
            </button>
            <Link to="/" reloadDocument className={buttonClassName('secondary')}>
              Về trang Tổng quan
            </Link>
          </div>
        </Panel>
      </PageBody>
    </>
  )
}
