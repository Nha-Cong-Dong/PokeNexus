import { PageBody, PageHero } from '../components/scene/PageHero'
import { Panel } from '../components/ui/Panel'

export function TeamBuilderPage() {
  return (
    <>
      <PageHero
        scene="stadium"
        title="Xây đội"
        subtitle="Chọn 5 Pokémon, đọc bản đồ điểm yếu, để PokeNexus đề xuất slot thứ 6."
      />
      <PageBody>
        <Panel aria-label="Trạng thái trang">
          <p className="text-ink-muted">Trang đang được xây dựng (T306).</p>
        </Panel>
      </PageBody>
    </>
  )
}
