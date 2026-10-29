import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  analysisFor,
  bodiesSentTo,
  jsonResponse,
  problem,
  renderTeamRoute,
  routeFetch,
  SPEC_ROCK_ROW,
  SPEC_TEAM,
  TYRANITAR,
} from '../features/team-builder/testing'
import type { TeamResponse } from '../types/api'

vi.mock('../components/pokemon/PokemonSearchBox', () => ({
  PokemonSearchBox: () => null,
}))

vi.mock('../components/pokemon/StatRadar', () => ({
  StatRadar: () => null,
}))

const SHARED_TEAM: TeamResponse = {
  shareCode: 'a1B2c3D4',
  name: 'Đội Rồng Lửa',
  synergyScore: 41,
  createdAt: '2026-11-06T09:30:00Z',
  members: [TYRANITAR, ...SPEC_TEAM]
    .map((pokemon, index) => ({
      ...pokemon,
      slot: index === 0 ? 6 : index,
      nickname: index === 2 ? 'Gyara' : null,
    }))
    .reverse(),
}

afterEach(() => {
  vi.unstubAllGlobals()
})

function sharedTeamRoutes() {
  return routeFetch({
    'GET /teams/shared/a1B2c3D4': () => jsonResponse(SHARED_TEAM),
    'POST /synergy/analyze': () =>
      jsonResponse(
        analysisFor([...SPEC_TEAM, TYRANITAR], 41, {
          rock: { ...SPEC_ROCK_ROW, multipliers: [4, 2, 2, 4, 4, 1] },
          water: {
            multipliers: [2, 0.5, 0.5, 2, 2, 2],
            weakCount: 4,
            resistCount: 2,
            pressure: 2,
          },
        }),
      ),
  })
}

describe('SharedTeamPage', () => {
  it('shows the team name, six read-only members and the heatmap of all six', async () => {
    const fetchMock = sharedTeamRoutes()

    renderTeamRoute('/team/a1B2c3D4')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Đội Rồng Lửa' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const hero = within(screen.getByRole('region', { name: 'Đội Rồng Lửa' }))
    expect(hero.getByText('6 thành viên, điểm đội 41. Lưu ngày 06/11/2026.')).toBeInTheDocument()
    expect(hero.getByText('Đội được chia sẻ, chỉ xem')).toBeInTheDocument()
    expect(hero.getAllByText('Mã đội')).toHaveLength(2)
    expect(hero.getAllByText('a1B2c3D4')).toHaveLength(2)

    const members = within(screen.getByRole('region', { name: 'Thành viên' }))
    const links = members.getAllByRole('link')
    expect(links).toHaveLength(6)
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      '/pokemon/charizard',
      '/pokemon/gyarados',
      '/pokemon/dragonite',
      '/pokemon/talonflame',
      '/pokemon/volcarona',
      '/pokemon/tyranitar',
    ])
    expect(links[1]).toHaveTextContent('“Gyara”')
    expect(links[5]).toHaveTextContent('#0248Tyranitar')
    expect(links[5]).toHaveTextContent('Vách núi đá')
    expect(members.queryByRole('heading')).not.toBeInTheDocument()
    expect(members.queryByRole('button')).not.toBeInTheDocument()

    const heatmap = within(screen.getByRole('region', { name: 'Các hệ đội đang hở' }))
    expect(
      await heatmap.findByRole('row', { name: /^Rock.*Lỗ hổng nghiêm trọng/ }),
    ).toBeInTheDocument()
    expect(heatmap.getAllByRole('row')).toHaveLength(3)
    expect(heatmap.queryByRole('columnheader', { name: 'Yếu' })).not.toBeInTheDocument()
    expect(heatmap.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(heatmap.queryByRole('button', { name: /Xem đủ/ })).not.toBeInTheDocument()
    expect(screen.queryByText(/5 thành viên đầu/)).not.toBeInTheDocument()
    expect(bodiesSentTo(fetchMock, '/synergy/analyze')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637, 248] },
    ])
    const usePanel = within(screen.getByRole('region', { name: 'Dùng đội này' }))
    expect(usePanel.getByRole('link', { name: 'Mở trong Team Builder' })).toHaveAttribute(
      'href',
      '/team-builder?ids=6,130,149,663,637&six=248',
    )
    expect(usePanel.queryByText('41')).not.toBeInTheDocument()
    expect(usePanel.queryByText('HP')).not.toBeInTheDocument()
  })

  it('labels the copy button as copied once the share link is on the clipboard', async () => {
    sharedTeamRoutes()
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    renderTeamRoute('/team/a1B2c3D4')

    await user.click(await screen.findByRole('button', { name: 'Sao chép' }))

    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/team\/a1B2c3D4$/))
    expect(await screen.findByRole('button', { name: 'Đã sao chép' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('Đã sao chép link.')
  })

  it('keeps the default heading while the team is loading', () => {
    routeFetch({ 'GET /teams/shared/a1B2c3D4': () => new Promise<Response>(() => {}) })

    renderTeamRoute('/team/a1B2c3D4')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Đội được chia sẻ' })).toBeInTheDocument()
    expect(screen.queryByText('Đội được chia sẻ, chỉ xem')).not.toBeInTheDocument()
    expect(screen.queryByText('Mã đội')).not.toBeInTheDocument()
  })

  it('shows the not found panel when the API answers 404 TEAM_NOT_FOUND', async () => {
    routeFetch({ 'GET /teams/shared/Zz999999': () => problem(404, 'TEAM_NOT_FOUND') })

    renderTeamRoute('/team/Zz999999')

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Không tìm thấy đội' }),
    ).toBeInTheDocument()
    expect(screen.getByText(/Không tìm thấy đội với mã chia sẻ này/)).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Đội được chia sẻ' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Xây đội mới' })).toHaveAttribute(
      'href',
      '/team-builder',
    )
  })

  it('shows the not found panel for a malformed share code without calling the API', () => {
    const fetchMock = routeFetch({})

    renderTeamRoute('/team/abc')

    expect(
      screen.getByRole('heading', { level: 2, name: 'Không tìm thấy đội' }),
    ).toBeInTheDocument()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('offers a retry for server errors', async () => {
    routeFetch({ 'GET /teams/shared/a1B2c3D4': () => problem(500, 'INTERNAL_ERROR') })

    renderTeamRoute('/team/a1B2c3D4')

    expect(
      await screen.findByText('Máy chủ gặp lỗi không mong muốn.', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Thử lại' })).toBeInTheDocument()
  })
})
