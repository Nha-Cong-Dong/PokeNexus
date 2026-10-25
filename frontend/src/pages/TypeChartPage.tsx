import { PageBody, PageHero } from '../components/scene/PageHero'
import { Panel } from '../components/ui/Panel'

export function TypeChartPage() {
  return (
    <>
      <PageHero
        scene="lab"
        title="Bảng tương khắc"
        subtitle="Hệ số sát thương giữa 18 hệ, kể cả hệ kép."
      />
      <PageBody>
        <Panel aria-label="Trạng thái trang">
          <p className="text-ink-muted">Trang đang được xây dựng (T304).</p>
        </Panel>
      </PageBody>
    </>
  )
}
