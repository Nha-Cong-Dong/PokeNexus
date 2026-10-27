import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'

import { Header } from './Header'

function renderHeader(path = '/') {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Header />
    </MemoryRouter>,
  )
}

describe('Header', () => {
  it('marks only the current section as active', () => {
    renderHeader('/types')

    const nav = screen.getByRole('navigation', { name: 'Điều hướng chính' })
    expect(within(nav).getByRole('link', { name: 'Tương khắc' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(nav).getByRole('link', { name: 'Pokédex' })).not.toHaveAttribute('aria-current')
  })

  it('keeps the mobile menu closed until the menu button is pressed', async () => {
    renderHeader()
    const menuButton = screen.getByRole('button', { name: 'Menu' })

    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.queryByRole('navigation', { name: 'Điều hướng di động' })).not.toBeInTheDocument()

    await userEvent.click(menuButton)

    expect(menuButton).toHaveAttribute('aria-expanded', 'true')
    const mobileNav = screen.getByRole('navigation', { name: 'Điều hướng di động' })
    expect(within(mobileNav).getAllByRole('link')).toHaveLength(4)
  })

  it('closes the mobile menu after choosing a destination', async () => {
    renderHeader()
    await userEvent.click(screen.getByRole('button', { name: 'Menu' }))

    const mobileNav = screen.getByRole('navigation', { name: 'Điều hướng di động' })
    await userEvent.click(within(mobileNav).getByRole('link', { name: 'Xây đội' }))

    expect(screen.queryByRole('navigation', { name: 'Điều hướng di động' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile menu with Escape and returns focus to the menu button', async () => {
    renderHeader()
    const menuButton = screen.getByRole('button', { name: 'Menu' })
    await userEvent.click(menuButton)

    const mobileNav = screen.getByRole('navigation', { name: 'Điều hướng di động' })
    within(mobileNav).getByRole('link', { name: 'Pokédex' }).focus()
    await userEvent.keyboard('{Escape}')

    expect(screen.queryByRole('navigation', { name: 'Điều hướng di động' })).not.toBeInTheDocument()
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveFocus()
  })
})
