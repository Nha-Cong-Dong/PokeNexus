import { Link } from 'react-router'

export function NotFoundPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="mt-2 text-text-muted">Đường dẫn không tồn tại hoặc đã bị thay đổi.</p>
      <Link
        to="/"
        className="mt-4 inline-flex min-h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-on-primary hover:bg-primary-hover"
      >
        Về Pokédex
      </Link>
    </section>
  )
}
