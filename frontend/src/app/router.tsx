import { createBrowserRouter, type RouteObject } from 'react-router'

import { ComparePage } from '../pages/ComparePage'
import { DexPage } from '../pages/DexPage'
import { LandingPage } from '../pages/LandingPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { PokemonDetailPage } from '../pages/PokemonDetailPage'
import { SharedTeamPage } from '../pages/SharedTeamPage'
import { TeamBuilderPage } from '../pages/TeamBuilderPage'
import { TerrainPage } from '../pages/TerrainPage'
import { TypeChartPage } from '../pages/TypeChartPage'
import { AppLayout } from './layout/AppLayout'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'pokedex', element: <DexPage /> },
      { path: 'pokemon/:idOrName', element: <PokemonDetailPage /> },
      { path: 'types', element: <TypeChartPage /> },
      { path: 'compare', element: <ComparePage /> },
      { path: 'team-builder', element: <TeamBuilderPage /> },
      { path: 'team/:shareCode', element: <SharedTeamPage /> },
      { path: 'terrain/:terrainId?', element: <TerrainPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes)
