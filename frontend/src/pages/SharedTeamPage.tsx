import { useParams } from 'react-router'

export function SharedTeamPage() {
  const { shareCode = '' } = useParams()
  return (
    <section>
      <h1 className="text-2xl font-bold">Đội được chia sẻ</h1>
      <p className="mt-2 text-text-muted">
        Mã chia sẻ <span className="font-medium text-text">{shareCode}</span>. Trang đang được xây
        dựng (T307).
      </p>
    </section>
  )
}
