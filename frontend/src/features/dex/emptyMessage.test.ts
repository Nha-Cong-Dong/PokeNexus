import { describe, expect, it } from 'vitest'

import { emptyResultMessage } from './emptyMessage'
import { parseDexFilter } from './useDexSearchParams'

function messageFor(query: string): string {
  return emptyResultMessage(parseDexFilter(new URLSearchParams(query)))
}

describe('emptyResultMessage', () => {
  it('describes every active condition in one sentence', () => {
    expect(messageFor('type=ice&gen=1&minBst=600')).toBe(
      'Chưa có Pokémon nào hệ Ice, thuộc Thế hệ 1, có BST từ 600 trở lên. Thử bỏ bớt một điều kiện hoặc nới khoảng BST.',
    )
  })

  it('joins two types and a closed BST range', () => {
    expect(messageFor('type=fairy&type=steel&minBst=200&maxBst=300')).toBe(
      'Chưa có Pokémon nào hệ Fairy + Steel, có BST từ 200 đến 300. Thử bỏ bớt một điều kiện hoặc nới khoảng BST.',
    )
  })

  it('mentions speed without suggesting a wider BST range', () => {
    expect(messageFor('gen=1&minSpeed=200')).toBe(
      'Chưa có Pokémon nào thuộc Thế hệ 1, có Tốc độ từ 200 trở lên. Thử bỏ bớt một điều kiện.',
    )
  })

  it('falls back to a short hint when only forms are filtered', () => {
    expect(messageFor('form=GMAX')).toBe('Thử bỏ bớt một điều kiện.')
  })
})
