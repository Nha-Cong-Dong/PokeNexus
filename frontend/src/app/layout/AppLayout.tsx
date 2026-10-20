import { Outlet } from 'react-router'

import { Footer } from './Footer'
import { Header } from './Header'

export const MAIN_CONTENT_ID = 'main-content'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-20 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Bỏ qua đến nội dung
      </a>
      <Header />
      <main id={MAIN_CONTENT_ID} className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
