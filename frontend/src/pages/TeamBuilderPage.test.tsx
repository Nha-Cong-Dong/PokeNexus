import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  analysisFor,
  bodiesSentTo,
  CHARIZARD,
  DRAGONITE,
  EMPOLEON,
  GYARADOS,
  jsonResponse,
  problem,
  recommendationsOf,
  renderTeamRoute,
  routeFetch,
  SPEC_ROCK_ROW,
  SPEC_TEAM,
  TALONFLAME,
  TYRANITAR,
} from '../features/team-builder/testing'
import type { AnalyzeRequest, CreateTeamRequest, PokemonRef, TeamResponse } from '../types/api'

vi.mock('../components/pokemon/PokemonSearchBox', () => ({
  PokemonSearchBox: (props: { label: string; onSelect: (pokemon: PokemonRef) => void }) => (
    <button
      type="button"
      onClick={() => props.onSelect({ id: 445, name: 'garchomp', types: ['dragon', 'ground'] })}
    >
      {props.label}: chọn Garchomp
    </button>
  ),
}))

vi.mock('../components/pokemon/StatRadar', () => ({
  StatRadar: (props: { title: string }) => <div role="img" aria-label={props.title} />,
}))

const SPEC_IDS = SPEC_TEAM.map((pokemon) => pokemon.id).join(',')

const SAVED_TEAM: TeamResponse = {
  shareCode: 'a1B2c3D4',
  name: 'Rain Team',
  synergyScore: 41,
  createdAt: '2026-11-06T09:30:00Z',
  members: [...SPEC_TEAM, TYRANITAR].map((pokemon, index) => ({
    ...pokemon,
    slot: index + 1,
    nickname: null,
  })),
}

function analyzeById(scores: Record<string, number>) {
  return (body: unknown) => {
    const ids = (body as AnalyzeRequest).pokemonIds
    const members = [...SPEC_TEAM, TYRANITAR, EMPOLEON].filter((pokemon) =>
      ids.includes(pokemon.id),
    )
    const ordered = ids.map((id) => members.find((pokemon) => pokemon.id === id)!)
    const rows = ids.length === 5 && ids.every((id, index) => id === SPEC_TEAM[index]?.id)
    return jsonResponse(
      analysisFor(ordered, scores[ids.join(',')] ?? 50, rows ? { rock: SPEC_ROCK_ROW } : {}),
    )
  }
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe('TeamBuilderPage', () => {
  it('flags the Rock row of the spec team as a critical hole and shows the team score', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 41 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf([TYRANITAR, 92])),
    })

    renderTeamRoute(`/team-builder?ids=${SPEC_IDS}`)

    const rockRow = await screen.findByRole('row', { name: /^Rock.*Lỗ hổng nghiêm trọng/ })
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1, name: 'Xây đội' })).toBeInTheDocument()
    expect(within(rockRow).getAllByText('x4')).toHaveLength(3)
    expect(within(rockRow).getAllByText('x2')).toHaveLength(2)
    expect(within(rockRow).getByText('Cao (8)')).toBeInTheDocument()
    expect(
      within(rockRow)
        .getAllByRole('cell')
        .map((cell) => cell.textContent),
    ).toEqual(['x4', 'x2', 'x2', 'x4', 'x4', '5', '0', 'Cao (8)'])
    expect(screen.getByRole('row', { name: /^Water/ })).not.toHaveTextContent('Lỗ hổng')
    expect(screen.getByText('41')).toBeInTheDocument()
    expect(screen.getByText('Điểm đội 41, có 1 lỗ hổng nghiêm trọng: Rock.')).toBeInTheDocument()
    expect(bodiesSentTo(fetchMock, '/synergy/analyze')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637] },
    ])
    expect(bodiesSentTo(fetchMock, '/synergy/recommendations')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637], limit: 3 },
    ])
  })

  it('adds recommendation number 1 to a 4-member team and shows the score increase', async () => {
    const four = [CHARIZARD, GYARADOS, DRAGONITE, TALONFLAME].map((pokemon) => pokemon.id)
    routeFetch({
      'POST /synergy/analyze': analyzeById({ [four.join(',')]: 40, '6,130,149,663,248': 52 }),
      'POST /synergy/recommendations': () =>
        jsonResponse(recommendationsOf([TYRANITAR, 92], [EMPOLEON, 84])),
    })
    const router = renderTeamRoute(`/team-builder?ids=${four.join(',')}`)

    await screen.findByText('40')
    const firstCard = screen.getByRole('article', { name: 'Tyranitar' })
    expect(
      within(firstCard).getByText('Chống chịu hệ Rock (đội đang hở mức 8)'),
    ).toBeInTheDocument()
    await userEvent.click(within(firstCard).getByRole('button', { name: /Thêm vào đội/ }))

    expect(await screen.findByText('52')).toBeInTheDocument()
    expect(screen.getByText('+12 so với lần trước')).toBeInTheDocument()
    expect(new URLSearchParams(router.state.location.search).get('ids')).toBe('6,130,149,663,248')
  })

  it('saves the draft plus a recommended sixth member and shows the share link', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 41 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf([TYRANITAR, 92])),
      'POST /teams': () => jsonResponse(SAVED_TEAM, 201),
    })
    renderTeamRoute(`/team-builder?ids=${SPEC_IDS}`)

    const card = await screen.findByRole('article', { name: 'Tyranitar' })
    await userEvent.click(within(card).getByRole('button', { name: /Thêm vào đội/ }))
    expect(screen.getByText('Slot 6 · đề xuất')).toBeInTheDocument()
    expect(screen.getByText('6 / 6')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Lưu đội' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Lưu đội' }))
    await userEvent.type(dialog.getByLabelText('Tên đội'), '  Rain Team ')
    await userEvent.click(dialog.getByRole('button', { name: 'Lưu đội' }))

    const saved = within(await screen.findByRole('dialog', { name: 'Đã lưu đội' }))
    expect((saved.getByLabelText('Link chia sẻ') as HTMLInputElement).value).toMatch(
      /\/team\/a1B2c3D4$/,
    )
    expect(saved.getByRole('link', { name: 'Mở trang đội' })).toHaveAttribute(
      'href',
      '/team/a1B2c3D4',
    )
    const [request] = bodiesSentTo(fetchMock, '/teams') as CreateTeamRequest[]
    expect(request).toEqual({
      name: 'Rain Team',
      members: [6, 130, 149, 663, 637, 248].map((pokemonId, index) => ({
        slot: index + 1,
        pokemonId,
        nickname: null,
      })),
    })
  })

  it('scores all six members once recommendation number 1 fills slot 6', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 20, [`${SPEC_IDS},248`]: 48 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf([TYRANITAR, 92])),
    })
    renderTeamRoute(`/team-builder?ids=${SPEC_IDS}`)

    await screen.findByText('20')
    const card = await screen.findByRole('article', { name: 'Tyranitar' })
    await userEvent.click(within(card).getByRole('button', { name: /Thêm vào đội/ }))

    expect(await screen.findByText('48')).toBeInTheDocument()
    expect(screen.getByText('+28 so với lần trước')).toBeInTheDocument()
    expect(screen.queryByText(/5 thành viên đầu/)).not.toBeInTheDocument()
    expect(bodiesSentTo(fetchMock, '/synergy/analyze')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637] },
      { pokemonIds: [6, 130, 149, 663, 637, 248] },
    ])
    expect(bodiesSentTo(fetchMock, '/synergy/recommendations')).toEqual([
      { pokemonIds: [6, 130, 149, 663, 637], limit: 3 },
    ])
  })

  it('restores the sixth member passed by a shared team link', async () => {
    routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 41 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf([EMPOLEON, 80])),
    })
    renderTeamRoute(`/team-builder?ids=${SPEC_IDS}&six=248`)

    expect(await screen.findByText('Slot 6 · đề xuất')).toBeInTheDocument()
    expect(screen.getByText('6 / 6')).toBeInTheDocument()
    const slots = screen.getByRole('region', { name: 'Đội của bạn' })
    expect(await within(slots).findByText('Tyranitar')).toBeInTheDocument()
  })

  it('keeps a recommended sixth member in the URL so a reload restores it', async () => {
    routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 20, [`${SPEC_IDS},248`]: 48 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf([TYRANITAR, 92])),
    })
    const router = renderTeamRoute(`/team-builder?ids=${SPEC_IDS}`)

    const card = await screen.findByRole('article', { name: 'Tyranitar' })
    await userEvent.click(within(card).getByRole('button', { name: /Thêm vào đội/ }))

    await waitFor(() =>
      expect(new URLSearchParams(router.state.location.search).get('six')).toBe('248'),
    )
    await userEvent.click(screen.getByRole('button', { name: 'Bỏ Charizard khỏi đội' }))
    await waitFor(() => {
      const params = new URLSearchParams(router.state.location.search)
      expect(params.get('ids')).toBe('130,149,663,637,248')
      expect(params.has('six')).toBe(false)
    })
  })

  it('copies the share link with the Clipboard API', async () => {
    routeFetch({
      'POST /synergy/analyze': analyzeById({}),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
      'POST /teams': () => jsonResponse(SAVED_TEAM, 201),
    })
    const user = userEvent.setup()
    const writeText = vi.spyOn(navigator.clipboard, 'writeText').mockResolvedValue()
    renderTeamRoute('/team-builder?ids=6')

    await screen.findByText('50')
    await user.click(screen.getByRole('button', { name: 'Lưu đội' }))
    await user.type(screen.getByLabelText('Tên đội'), 'Solo')
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Lưu đội' }))
    await user.click(await screen.findByRole('button', { name: 'Sao chép' }))

    expect(writeText).toHaveBeenCalledWith(expect.stringMatching(/\/team\/a1B2c3D4$/))
    expect(await screen.findByText('Đã sao chép link.')).toBeInTheDocument()
  })

  it('shows the Vietnamese rate limit message when saving returns 429', async () => {
    routeFetch({
      'POST /synergy/analyze': analyzeById({}),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
      'POST /teams': () => problem(429, 'RATE_LIMITED'),
    })
    renderTeamRoute('/team-builder?ids=6')

    await screen.findByText('50')
    await userEvent.click(screen.getByRole('button', { name: 'Lưu đội' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Lưu đội' }))
    await userEvent.type(dialog.getByLabelText('Tên đội'), 'Rain Team')
    await userEvent.click(dialog.getByRole('button', { name: 'Lưu đội' }))

    expect(await dialog.findByRole('alert')).toHaveTextContent(
      'Bạn lưu đội quá nhanh. Hãy đợi một phút rồi thử lại.',
    )
    expect(screen.queryByText('developer detail')).not.toBeInTheDocument()
  })

  it('tells how many seconds to wait when the server sends Retry-After', async () => {
    routeFetch({
      'POST /synergy/analyze': analyzeById({}),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
      'POST /teams': () =>
        new Response(JSON.stringify({ status: 429, code: 'RATE_LIMITED' }), {
          status: 429,
          headers: { 'Content-Type': 'application/problem+json', 'Retry-After': '42' },
        }),
    })
    renderTeamRoute('/team-builder?ids=6')

    await screen.findByText('50')
    await userEvent.click(screen.getByRole('button', { name: 'Lưu đội' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Lưu đội' }))
    await userEvent.type(dialog.getByLabelText('Tên đội'), 'Rain Team')
    await userEvent.click(dialog.getByRole('button', { name: 'Lưu đội' }))

    expect(await dialog.findByRole('alert')).toHaveTextContent(
      'Bạn lưu đội quá nhanh. Hãy thử lại sau 42 giây.',
    )
  })

  it('rejects a blank team name without calling the API', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': analyzeById({}),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
    })
    renderTeamRoute('/team-builder?ids=6')

    await screen.findByText('50')
    await userEvent.click(screen.getByRole('button', { name: 'Lưu đội' }))
    const dialog = within(screen.getByRole('dialog', { name: 'Lưu đội' }))
    await userEvent.type(dialog.getByLabelText('Tên đội'), '   ')
    await userEvent.click(dialog.getByRole('button', { name: 'Lưu đội' }))

    expect(dialog.getByText('Hãy đặt tên cho đội.')).toBeInTheDocument()
    expect(dialog.getByLabelText('Tên đội')).toHaveAttribute('aria-invalid', 'true')
    expect(bodiesSentTo(fetchMock, '/teams')).toEqual([])
  })

  it('starts empty without calling the API and can load the sample team', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': analyzeById({ [SPEC_IDS]: 41 }),
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
    })
    const router = renderTeamRoute('/team-builder')

    expect(screen.getByText('Đội đang trống')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Lưu đội' })).toBeDisabled()
    expect(fetchMock).not.toHaveBeenCalled()

    await userEvent.click(screen.getByRole('button', { name: 'Dùng đội mẫu' }))

    expect(
      await screen.findByRole('row', { name: /^Rock.*Lỗ hổng nghiêm trọng/ }),
    ).toBeInTheDocument()
    expect(new URLSearchParams(router.state.location.search).get('ids')).toBe(SPEC_IDS)
  })

  it('adds a Pokémon picked in the search box and removes it again', async () => {
    const fetchMock = routeFetch({
      'POST /synergy/analyze': (body) => {
        const ids = (body as AnalyzeRequest).pokemonIds
        return jsonResponse(
          analysisFor(
            ids.map((id) =>
              id === 445 ? { id, name: 'garchomp', types: ['dragon', 'ground'] } : CHARIZARD,
            ),
            70,
          ),
        )
      },
      'POST /synergy/recommendations': () => jsonResponse(recommendationsOf()),
    })
    renderTeamRoute('/team-builder')

    await userEvent.click(screen.getByRole('button', { name: 'Thêm Pokémon: chọn Garchomp' }))

    await waitFor(() =>
      expect(bodiesSentTo(fetchMock, '/synergy/analyze')).toEqual([{ pokemonIds: [445] }]),
    )
    await userEvent.click(await screen.findByRole('button', { name: 'Bỏ Garchomp khỏi đội' }))
    expect(await screen.findByText('Đội đang trống')).toBeInTheDocument()
  })

  it('shows the API error message when the analysis fails', async () => {
    routeFetch({
      'POST /synergy/analyze': () => problem(400, 'UNKNOWN_POKEMON'),
      'POST /synergy/recommendations': () => problem(400, 'UNKNOWN_POKEMON'),
    })
    renderTeamRoute('/team-builder?ids=99999')

    expect(
      (await screen.findAllByText('Có Pokémon trong đội không còn tồn tại.')).length,
    ).toBeGreaterThan(0)
    expect(screen.getAllByRole('button', { name: 'Thử lại' }).length).toBeGreaterThan(0)
    expect(screen.getByText('Chưa tải được')).toBeInTheDocument()
    expect(screen.queryByText('Đang tải…')).not.toBeInTheDocument()
  })
})
