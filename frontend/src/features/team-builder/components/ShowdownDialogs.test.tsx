import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import type { PokemonDetail } from '../../../types/api'
import type { ImportPlan } from '../showdown'
import { jsonResponse, problem } from '../testing'
import { ShowdownExportDialog, ShowdownImportDialog } from './ShowdownDialogs'

function detailOf(
  id: number,
  name: string,
  speciesName: string,
  formCategory: PokemonDetail['formCategory'],
): PokemonDetail {
  return {
    id,
    name,
    types: ['normal'],
    speciesId: id,
    speciesName,
    generation: 8,
    formCategory,
    isLegendary: false,
    isMythical: false,
    isFullyEvolved: true,
    stats: { hp: 80, attack: 80, defense: 80, specialAttack: 80, specialDefense: 80, speed: 80 },
    baseStatTotal: 480,
    heightDm: 10,
    weightHg: 100,
    defense: [],
    forms: [],
  }
}

const DETAILS: Record<string, PokemonDetail> = {
  garchomp: detailOf(445, 'garchomp', 'garchomp', 'DEFAULT'),
  '445': detailOf(445, 'garchomp', 'garchomp', 'DEFAULT'),
  'indeedee-female': detailOf(10186, 'indeedee-female', 'indeedee', 'OTHER'),
  '10186': detailOf(10186, 'indeedee-female', 'indeedee', 'OTHER'),
  '645': detailOf(645, 'landorus-incarnate', 'landorus', 'DEFAULT'),
}

function stubApi() {
  const fetchMock = vi.fn<typeof fetch>(async (input) => {
    const url = new URL(String(input))
    if (url.pathname.endsWith('/pokemon/search')) return jsonResponse([])
    const key = url.pathname.replace('/api/v1/pokemon/', '')
    const detail = DETAILS[key]
    return detail ? jsonResponse(detail) : problem(404, 'POKEMON_NOT_FOUND')
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

function renderWithClient(node: ReactNode) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(<QueryClientProvider client={queryClient}>{node}</QueryClientProvider>)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ShowdownImportDialog', () => {
  it('imports the recognised Pokémon and lists the lines it skipped', async () => {
    stubApi()
    const onImport = vi.fn<(plan: ImportPlan) => void>()
    const user = userEvent.setup()
    renderWithClient(<ShowdownImportDialog open onClose={() => {}} onImport={onImport} />)

    await user.click(screen.getByLabelText('Văn bản đội'))
    await user.paste('Chompy (Garchomp) @ Choice Scarf\n- Earthquake\n\nFakemon\n\nIndeedee-F')
    await user.click(screen.getByRole('button', { name: 'Nhập đội' }))

    expect(await screen.findByRole('heading', { name: 'Đã nhập đội' })).toBeInTheDocument()
    expect(onImport).toHaveBeenCalledTimes(1)
    expect(onImport.mock.calls[0]?.[0]).toMatchObject({ ids: [445, 10186], sixth: null })
    expect(screen.getByText('Đã thêm 2 Pokémon: Garchomp, Indeedee Female.')).toBeInTheDocument()
    expect(screen.getByText('Dòng 4: Fakemon không có trong dữ liệu.')).toBeInTheDocument()
    expect(
      screen.getByText('Chiêu thức, vật phẩm, Ability, EV và tính cách đã được bỏ qua.'),
    ).toBeInTheDocument()
  })

  it('keeps the current team when no line is recognised', async () => {
    stubApi()
    const onImport = vi.fn()
    const user = userEvent.setup()
    renderWithClient(<ShowdownImportDialog open onClose={() => {}} onImport={onImport} />)

    await user.click(screen.getByLabelText('Văn bản đội'))
    await user.paste('Fakemon\n\nNotamon')
    await user.click(screen.getByRole('button', { name: 'Nhập đội' }))

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Không nhận ra Pokémon nào: Fakemon, Notamon.',
    )
    expect(onImport).not.toHaveBeenCalled()
  })

  it('asks for text before importing', async () => {
    stubApi()
    const user = userEvent.setup()
    renderWithClient(<ShowdownImportDialog open onClose={() => {}} onImport={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Nhập đội' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Chưa có tên Pokémon nào trong văn bản.')
  })
})

describe('ShowdownExportDialog', () => {
  it('writes Showdown names and copies them', async () => {
    stubApi()
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText')
    renderWithClient(<ShowdownExportDialog open onClose={() => {}} ids={[645, 10186, 445]} />)

    const text = await screen.findByDisplayValue(/Landorus/)
    expect(text).toHaveValue('Landorus\n\nIndeedee-F\n\nGarchomp\n')

    await user.click(screen.getByRole('button', { name: 'Sao chép' }))

    expect(writeText).toHaveBeenCalledWith('Landorus\n\nIndeedee-F\n\nGarchomp\n')
    expect(
      screen.getByText('Đã sao chép. Dán vào Import from text trong Showdown.'),
    ).toBeInTheDocument()
  })
})
