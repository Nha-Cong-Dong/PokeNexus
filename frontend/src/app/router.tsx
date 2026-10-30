import type { ComponentType } from 'react'
import { createBrowserRouter, type RouteObject } from 'react-router'

import { NotFoundPage } from '../pages/NotFoundPage'
import { AppLayout } from './layout/AppLayout'

const pageFallback = (
  <div aria-busy="true" className="min-h-[60vh]">
    <span className="sr-only">Đang tải trang…</span>
  </div>
)

function lazyPage(
  load: () => Promise<ComponentType>,
): Pick<RouteObject, 'lazy' | 'hydrateFallbackElement'> {
  return {
    lazy: async () => ({ Component: await load() }),
    hydrateFallbackElement: pageFallback,
  }
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, ...lazyPage(async () => (await import('../pages/LandingPage')).LandingPage) },
      { path: 'pokedex', ...lazyPage(async () => (await import('../pages/DexPage')).DexPage) },
      {
        path: 'pokemon/:idOrName',
        ...lazyPage(async () => (await import('../pages/PokemonDetailPage')).PokemonDetailPage),
      },
      {
        path: 'types',
        ...lazyPage(async () => (await import('../pages/TypeChartPage')).TypeChartPage),
      },
      {
        path: 'compare',
        ...lazyPage(async () => (await import('../pages/ComparePage')).ComparePage),
      },
      {
        path: 'team-builder',
        ...lazyPage(async () => (await import('../pages/TeamBuilderPage')).TeamBuilderPage),
      },
      {
        path: 'team/:shareCode',
        ...lazyPage(async () => (await import('../pages/SharedTeamPage')).SharedTeamPage),
      },
      {
        path: 'terrain/:terrainId?',
        ...lazyPage(async () => (await import('../pages/TerrainPage')).TerrainPage),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
