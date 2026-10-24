import { useParams } from 'react-router'

import { PageBody, PageHero } from '../components/scene/PageHero'
import { Panel } from '../components/ui/Panel'

export function PokemonDetailPage() {
  const { idOrName = '' } = useParams()
  return (
    <>
      <PageHero scene="grassland" title="Chi tiết Pokémon" />
      <PageBody>
        <Panel aria-label="Trạng thái trang">
          <p className="text-ink-muted">
            Đang xem <span className="font-bold text-ink">{idOrName}</span>. Trang đang được xây
            dựng (T303).
          </p>
        </Panel>
      </PageBody>
    </>
  )
}
