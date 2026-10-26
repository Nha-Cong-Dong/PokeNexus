import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TYPE_MATRIX_FIXTURE } from '../features/typechart/typeMatrixFixture'
import { jsonResponse, renderRoute, stubFetch } from '../test/renderRoute'

afterEach(() => {
  vi.unstubAllGlobals()
})

function picker() {
  return within(screen.getByRole('group', { name: 'Hệ phòng thủ' }))
}

function resultRow(label: string) {
  const list = screen.getByRole('list', { name: 'Hệ số nhận từ 18 hệ tấn công' })
  return within(list).getByText(label, { selector: 'span' }).closest('li')
}

describe('TypeChartPage', () => {
  it('renders the full 18 x 18 matrix with labelled headers', async () => {
    const fetchMock = stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))

    renderRoute('/types')

    const table = await screen.findByRole('table')
    expect(new URL(String(fetchMock.mock.calls[0]?.[0])).pathname).toBe('/api/v1/types/matrix')
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Bảng tương khắc' })).toBeInTheDocument()

    const columnHeaders = within(table).getAllByRole('columnheader')
    expect(columnHeaders).toHaveLength(19)
    expect(columnHeaders.slice(1, 4).map((header) => header.textContent)).toEqual([
      'NorNormal',
      'FirFire',
      'WatWater',
    ])
    expect(within(table).getAllByRole('rowheader')).toHaveLength(18)
    expect(within(table).getAllByRole('cell')).toHaveLength(324)

    const fireRow = within(table).getByRole('rowheader', { name: 'Fire' }).closest('tr')!
    expect(within(fireRow).getByTitle('Fire tấn công Grass: x2')).toHaveTextContent('x2')
    const groundRow = within(table).getByRole('rowheader', { name: 'Ground' }).closest('tr')!
    expect(within(groundRow).getByTitle('Ground tấn công Flying: x0')).toHaveTextContent('x0')
    expect(within(groundRow).getByTitle('Ground tấn công Normal: x1')).toHaveTextContent('x1')
  })

  it('shows what a Fire/Flying defender takes after picking both types', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    const memoryRouter = renderRoute('/types')
    await screen.findByRole('table')

    await userEvent.click(picker().getByRole('button', { name: 'Fire' }))
    await userEvent.click(picker().getByRole('button', { name: 'Flying' }))

    expect(memoryRouter.state.location.search).toBe('?def=fire&def=flying')
    expect(picker().getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'true')
    expect(picker().getByRole('button', { name: 'Water' })).toBeDisabled()
    expect(resultRow('x4')).toHaveTextContent(/^x4Rock$/)
    expect(resultRow('x2')).toHaveTextContent(/^x2WaterElectric$/)
    expect(resultRow('x¼')).toHaveTextContent(/^x¼GrassBug$/)
    expect(resultRow('x0')).toHaveTextContent(/^x0Ground$/)
    expect(
      screen.getByText(
        'Fire + Flying yếu trước 3 hệ, nặng nhất là Rock x4. Kháng 6 hệ và miễn nhiễm Ground.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Trung tính x1 với 8 hệ còn lại.')).toBeInTheDocument()
  })

  it('ignores invalid def values and keeps at most two types from the URL', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))

    renderRoute('/types?def=banana&def=fire&def=flying&def=water')

    await screen.findByRole('table')
    expect(picker().getByRole('button', { name: 'Fire' })).toHaveAttribute('aria-pressed', 'true')
    expect(picker().getByRole('button', { name: 'Flying' })).toHaveAttribute('aria-pressed', 'true')
    expect(picker().getByRole('button', { name: 'Water' })).toHaveAttribute('aria-pressed', 'false')
    expect(resultRow('x4')).toHaveTextContent('Rock')
  })

  it('suggests a second type for a single pick and clears the selection', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    const memoryRouter = renderRoute('/types?def=ghost')
    await screen.findByRole('table')

    expect(screen.getByText('Chọn thêm 1 hệ nếu Pokémon có hệ kép.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Bỏ chọn' }))

    expect(memoryRouter.state.location.search).toBe('')
    expect(screen.getByText(/^Chưa chọn hệ nào\./)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bỏ chọn' })).toBeDisabled()
  })

  it('shows a Vietnamese error with a retry button when the matrix fails to load', async () => {
    stubFetch(jsonResponse({ status: 503, detail: 'not loaded', code: 'DATA_NOT_READY' }, 503))

    renderRoute('/types')

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Dữ liệu Pokémon đang được nạp')
    expect(alert).not.toHaveTextContent('not loaded')
    expect(within(alert).getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
