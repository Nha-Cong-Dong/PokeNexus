import { useParams } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { Panel } from '../components/ui/Panel'

export function SharedTeamPage() {
  const { shareCode = '' } = useParams()
  return (
    <>
      <PageHero scene="stadium" title="Đội được chia sẻ" />
      <PageBody>
        <Panel aria-label="Trạng thái trang">
          <p className="text-ink-muted">
            Mã chia sẻ <span className="font-bold text-ink">{shareCode}</span>. Trang đang được xây
            dựng (T307).
          </p>
        </Panel>
      </PageBody>
    </>
  )
}
