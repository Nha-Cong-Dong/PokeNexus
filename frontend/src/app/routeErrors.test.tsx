import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { routes } from './router'

vi.mock('../pages/TypeChartPage', () => {
  throw new TypeError('Failed to fetch dynamically imported module')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('route errors', () => {
  it('keeps the header and offers a reload when a page module fails to load', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const memoryRouter = createMemoryRouter(routes, { initialEntries: ['/types'] })
    render(
      <QueryClientProvider client={new QueryClient()}>
        <RouterProvider router={memoryRouter} />
      </QueryClientProvider>,
    )

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Không hiển thị được trang' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Điều hướng chính' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Tải lại trang' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Về trang Tổng quan' })).toHaveAttribute('href', '/')
  })
})
