import { screen, within } from '@testing-library/react'
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

describe('SharedTeamPage', () => {
  it('shows the team name, six read-only members and the heatmap of the first five', async () => {
    const fetchMock = routeFetch({
      'GET /teams/shared/a1B2c3D4': () => jsonResponse(SHARED_TEAM),
      'POST /synergy/analyze': () =>
        jsonResponse(analysisFor(SPEC_TEAM, 41, { rock: SPEC_ROCK_ROW })),
    })

    renderTeamRoute('/team/a1B2c3D4')

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Đội Rồng Lửa' }),
    ).toBeInTheDocument()
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(
      screen.getByText(/6 thành viên · điểm đội 41 · lưu ngày 06\/11\/2026/),
    ).toBeInTheDocument()

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
    expect(links[5]).toHaveTextContent('Slot 6')
    expect(members.queryByRole('button')).not.toBeInTheDocument()

    expect(
      await screen.findByRole('row', { name: /^Rock.*Lỗ hổng nghiêm trọng/ }),
    ).toBeInTheDocument()
    expect(bodiesSentTo(fetchMock, '/synergy/analyze')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637] },
    ])
    expect(screen.getByRole('link', { name: 'Mở trong Team Builder' })).toHaveAttribute(
      'href',
      '/team-builder?ids=6,130,149,663,637&six=248',
    )
  })

  it('keeps the default heading while the team is loading', () => {
    routeFetch({ 'GET /teams/shared/a1B2c3D4': () => new Promise<Response>(() => {}) })

    renderTeamRoute('/team/a1B2c3D4')

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Đội được chia sẻ' })).toBeInTheDocument()
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
