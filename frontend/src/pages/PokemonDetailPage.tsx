import { useParams } from 'react-router'

export function PokemonDetailPage() {
  const { idOrName = '' } = useParams()
  return (
    <section>
      <h1 className="text-2xl font-bold">Chi tiết Pokémon</h1>
      <p className="mt-2 text-text-muted">
        Đang xem <span className="font-medium text-text">{idOrName}</span>. Trang đang được xây dựng
        (T303).
      </p>
    </section>
  )
}
