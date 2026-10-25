import { Link } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { buttonClassName } from '../components/ui/buttonStyles'
import { Panel } from '../components/ui/Panel'

export function NotFoundPage() {
  return (
    <>
      <PageHero scene="lab" title="Không tìm thấy trang" />
      <PageBody>
        <Panel aria-label="Hướng dẫn" className="flex flex-col items-start gap-4">
          <p className="text-ink-muted">Đường dẫn không tồn tại hoặc đã bị thay đổi.</p>
          <Link to="/" className={buttonClassName('primary')}>
            Về Pokédex
          </Link>
        </Panel>
      </PageBody>
    </>
  )
}
