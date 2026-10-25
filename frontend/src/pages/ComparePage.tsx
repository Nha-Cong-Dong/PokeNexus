import { PageBody, PageHero } from '../components/scene/PageHero'
import { Panel } from '../components/ui/Panel'

export function ComparePage() {
  return (
    <>
      <PageHero
        scene="stadium"
        title="Bàn Cân Sức Mạnh"
        subtitle="Đặt hai Pokémon lên bàn cân: chỉ số, tốc độ và kết luận."
      />
      <PageBody>
        <Panel aria-label="Trạng thái trang">
          <p className="text-ink-muted">Trang đang được xây dựng (T308).</p>
        </Panel>
      </PageBody>
    </>
  )
}
