import { describe, expect, it } from 'vitest'

import {
  awardBadge,
  awardBall,
  EMPTY_PROGRESS,
  parseProgress,
  pointsForAnswer,
  prizeFor,
  rankFor,
  recordAnswer,
} from './progress'

describe('trainer progress', () => {
  it('gives base points for a correct answer and a bonus from a streak of three', () => {
    expect(pointsForAnswer(true, 1)).toBe(10)
    expect(pointsForAnswer(true, 2)).toBe(10)
    expect(pointsForAnswer(true, 3)).toBe(15)
    expect(pointsForAnswer(true, 4, 5)).toBe(10)
    expect(pointsForAnswer(false, 7)).toBe(0)
  })

  it('maps points to a rank and the next rank to reach', () => {
    expect(rankFor(0)).toEqual({
      current: { title: 'Tân binh', minPoints: 0 },
      next: { title: 'Trainer', minPoints: 100 },
    })
    expect(rankFor(100).current.title).toBe('Trainer')
    expect(rankFor(999).current.title).toBe('Thủ lĩnh Gym')
    expect(rankFor(5000)).toEqual({
      current: { title: 'Nhà vô địch', minPoints: 1500 },
      next: undefined,
    })
  })

  it('awards a better ball for a better score and nothing for zero correct', () => {
    expect(prizeFor(6, 6)).toBe('master')
    expect(prizeFor(5, 6)).toBe('ultra')
    expect(prizeFor(4, 6)).toBe('great')
    expect(prizeFor(1, 6)).toBe('poke')
    expect(prizeFor(0, 6)).toBeUndefined()
    expect(prizeFor(0, 0)).toBeUndefined()
  })

  it('records points, keeps the best streak and never duplicates a badge', () => {
    const afterAnswers = recordAnswer(recordAnswer(EMPTY_PROGRESS, 15, 4), 10, 1)
    expect(afterAnswers.points).toBe(25)
    expect(afterAnswers.bestStreak).toBe(4)

    const withBadge = awardBadge(awardBadge(afterAnswers, 'quiz:damage'), 'quiz:damage')
    expect(withBadge.badges).toEqual(['quiz:damage'])
    expect(awardBall(awardBall(withBadge, 'ultra'), 'ultra').balls).toEqual({
      poke: 0,
      great: 0,
      ultra: 2,
      master: 0,
    })
  })

  it('reads stored progress defensively', () => {
    expect(parseProgress(null)).toEqual(EMPTY_PROGRESS)
    expect(parseProgress('not json')).toEqual(EMPTY_PROGRESS)
    expect(parseProgress('[1,2]').points).toBe(0)
    expect(
      parseProgress(
        JSON.stringify({
          points: 120,
          bestStreak: -3,
          badges: ['quiz:stats', 7, 'quiz:stats'],
          balls: { poke: 2, master: 'many' },
        }),
      ),
    ).toEqual({
      points: 120,
      bestStreak: 0,
      badges: ['quiz:stats'],
      balls: { poke: 2, great: 0, ultra: 0, master: 0 },
    })
  })
})
