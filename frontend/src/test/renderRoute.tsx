import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { vi } from 'vitest'

import { routes } from '../app/router'
import type { PageResponse, PokemonSummary } from '../types/api'

export function renderRoute(path: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const memoryRouter = createMemoryRouter(routes, { initialEntries: [path] })
  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={memoryRouter} />
    </QueryClientProvider>,
  )
  return memoryRouter
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': status >= 400 ? 'application/problem+json' : 'application/json' },
  })
}

export function pageOf(content: PokemonSummary[], totalPages = 1): PageResponse<PokemonSummary> {
  return { content, page: 0, size: 24, totalElements: content.length, totalPages }
}

export function stubFetch(...responses: Response[]) {
  const fetchMock = vi.fn<typeof fetch>()
  responses.forEach((response) => fetchMock.mockResolvedValueOnce(response))
  fetchMock.mockResolvedValue(jsonResponse(pageOf([])))
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}
