export type BallKind = 'poke' | 'great' | 'ultra' | 'master'

export const BALL_KINDS: readonly BallKind[] = ['poke', 'great', 'ultra', 'master']

export const BALL_LABELS: Record<BallKind, string> = {
  poke: 'Poké Ball',
  great: 'Great Ball',
  ultra: 'Ultra Ball',
  master: 'Master Ball',
}

export interface TrainerProgress {
  points: number
  bestStreak: number
  badges: string[]
  balls: Record<BallKind, number>
}

export interface Rank {
  title: string
  minPoints: number
}

export interface RankStatus {
  current: Rank
  next: Rank | undefined
}

export interface Badge {
  id: string
  label: string
}

export const EMPTY_PROGRESS: TrainerProgress = {
  points: 0,
  bestStreak: 0,
  badges: [],
  balls: { poke: 0, great: 0, ultra: 0, master: 0 },
}

export const RANKS: readonly Rank[] = [
  { title: 'Tân binh', minPoints: 0 },
  { title: 'Trainer', minPoints: 100 },
  { title: 'Trainer ưu tú', minPoints: 300 },
  { title: 'Thủ lĩnh Gym', minPoints: 600 },
  { title: 'Tứ Thiên Vương', minPoints: 1000 },
  { title: 'Nhà vô địch', minPoints: 1500 },
]

export const POINTS_PER_CORRECT = 10
export const STREAK_BONUS = 5
export const STREAK_BONUS_FROM = 3

export function pointsForAnswer(
  correct: boolean,
  streak: number,
  base: number = POINTS_PER_CORRECT,
): number {
  if (!correct) return 0
  return base + (streak >= STREAK_BONUS_FROM ? STREAK_BONUS : 0)
}

export function rankFor(points: number): RankStatus {
  let index = 0
  RANKS.forEach((rank, position) => {
    if (points >= rank.minPoints) index = position
  })
  return { current: RANKS[index]!, next: RANKS[index + 1] }
}

export function prizeFor(correct: number, total: number): BallKind | undefined {
  if (total <= 0 || correct <= 0) return undefined
  if (correct >= total) return 'master'
  if (correct >= total - 1) return 'ultra'
  if (correct >= total - 2) return 'great'
  return 'poke'
}

export function recordAnswer(
  progress: TrainerProgress,
  gained: number,
  streak: number,
): TrainerProgress {
  return {
    ...progress,
    points: progress.points + gained,
    bestStreak: Math.max(progress.bestStreak, streak),
  }
}

export function awardBadge(progress: TrainerProgress, badgeId: string): TrainerProgress {
  if (progress.badges.includes(badgeId)) return progress
  return { ...progress, badges: [...progress.badges, badgeId] }
}

export function awardBall(progress: TrainerProgress, kind: BallKind): TrainerProgress {
  return { ...progress, balls: { ...progress.balls, [kind]: progress.balls[kind] + 1 } }
}

function countOf(value: unknown): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : 0
}

export function parseProgress(raw: string | null): TrainerProgress {
  if (!raw) return EMPTY_PROGRESS
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return EMPTY_PROGRESS
  }
  if (typeof data !== 'object' || data === null) return EMPTY_PROGRESS
  const record = data as Record<string, unknown>
  const balls = (
    typeof record.balls === 'object' && record.balls !== null ? record.balls : {}
  ) as Record<string, unknown>
  const badges = Array.isArray(record.badges)
    ? [...new Set(record.badges.filter((badge): badge is string => typeof badge === 'string'))]
    : []
  return {
    points: countOf(record.points),
    bestStreak: countOf(record.bestStreak),
    badges,
    balls: {
      poke: countOf(balls.poke),
      great: countOf(balls.great),
      ultra: countOf(balls.ultra),
      master: countOf(balls.master),
    },
  }
}
