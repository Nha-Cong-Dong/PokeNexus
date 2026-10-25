import { Outlet } from 'react-router'

import { Footer } from './Footer'
import { Header } from './Header'

export const MAIN_CONTENT_ID = 'main-content'

export function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-4 focus:z-50 focus:rounded-[10px] focus:bg-surface focus:px-3 focus:py-2 focus:font-bold"
      >
        Bỏ qua đến nội dung
      </a>
      <Header />
      <main id={MAIN_CONTENT_ID} className="w-full flex-1 pb-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
