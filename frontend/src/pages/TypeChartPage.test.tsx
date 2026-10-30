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

    expect(screen.getByText('Chọn thêm 1 hệ nếu Pokémon có hệ kép')).toBeInTheDocument()
    expect(screen.getByText('Chọn thêm 1 hệ cho Pokémon hệ kép.')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Bỏ chọn' }))

    expect(memoryRouter.state.location.search).toBe('')
    expect(screen.getByText('Chưa chọn hệ nào.')).toBeInTheDocument()
    expect(screen.getByText('Chọn hệ ở bên trái')).toBeInTheDocument()
    expect(screen.getByText('Chọn 1 hoặc 2 hệ.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Bỏ chọn' })).toBeDisabled()
  })

  it('summarises a single weakness and tells a full pick how to swap', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    renderRoute('/types?def=water&def=ground')
    await screen.findByRole('table')

    expect(
      screen.getByText(
        'Water + Ground chỉ có một điểm yếu: Grass, và đòn đó gây x4. Kháng 4 hệ và miễn nhiễm Electric.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Đã chọn đủ 2 hệ. Chạm một hệ đang chọn để đổi.')).toBeInTheDocument()
    expect(resultRow('x4')).toHaveTextContent(/^x4Grass$/)
  })

  it('keeps x1 cells empty on screen but readable as x1', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    renderRoute('/types')

    const table = await screen.findByRole('table')
    const neutralCell = within(table).getByTitle('Fire tấn công Normal: x1')

    expect(neutralCell).toHaveTextContent(/^x1$/)
    expect(within(neutralCell).getByText('x1')).toHaveClass('sr-only')
    expect(within(table).getByTitle('Fire tấn công Grass: x2')).toHaveTextContent(/^x2$/)
  })

  it('highlights an attacking row and summarises it in the aside', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    renderRoute('/types')
    const table = await screen.findByRole('table')

    expect(screen.getByRole('complementary', { name: 'Chưa chọn' })).toBeInTheDocument()
    const fireButton = within(within(table).getByRole('rowheader', { name: 'Fire' })).getByRole(
      'button',
    )
    expect(fireButton).toHaveAttribute('aria-pressed', 'false')

    await userEvent.click(fireButton)

    expect(fireButton).toHaveAttribute('aria-pressed', 'true')
    const aside = screen.getByRole('complementary', { name: 'Fire tấn công' })
    expect(within(aside).getByRole('list', { name: 'Gây x2 lên' })).toHaveTextContent(
      /^GrassIceBugSteel$/,
    )
    expect(within(aside).getByRole('list', { name: 'Bị giảm còn x½ khi đánh' })).toHaveTextContent(
      /^FireWaterRockDragon$/,
    )
    expect(within(aside).queryByRole('list', { name: 'Không tác dụng lên' })).toBeNull()
    expect(within(aside).getByText('Không có')).toBeInTheDocument()
    expect(within(table).getByTitle('Fire tấn công Grass: x2')).not.toHaveClass('opacity-20')
    expect(within(table).getByTitle('Water tấn công Fire: x2')).toHaveClass('opacity-20')

    await userEvent.click(within(aside).getByRole('button', { name: 'Bỏ chọn' }))

    expect(fireButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('complementary', { name: 'Chưa chọn' })).toBeInTheDocument()
    expect(within(table).getByTitle('Water tấn công Fire: x2')).not.toHaveClass('opacity-20')
  })

  it('highlights a defending column and toggles it off with a second press', async () => {
    stubFetch(jsonResponse(TYPE_MATRIX_FIXTURE))
    renderRoute('/types')
    const table = await screen.findByRole('table')
    const groundButton = within(
      within(table).getByRole('columnheader', { name: 'Ground' }),
    ).getByRole('button')

    await userEvent.click(groundButton)

    expect(groundButton).toHaveAttribute('aria-pressed', 'true')
    const aside = screen.getByRole('complementary', { name: 'Ground phòng thủ' })
    expect(within(aside).getByRole('list', { name: 'Yếu trước' })).toHaveTextContent(
      /^WaterGrassIce$/,
    )
    expect(within(aside).getByRole('list', { name: 'Miễn nhiễm' })).toHaveTextContent(/^Electric$/)
    expect(within(table).getByTitle('Water tấn công Ground: x2')).not.toHaveClass('opacity-20')
    expect(within(table).getByTitle('Ground tấn công Water: x1')).toHaveClass('opacity-20')

    await userEvent.click(groundButton)

    expect(groundButton).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('complementary', { name: 'Chưa chọn' })).toBeInTheDocument()
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
