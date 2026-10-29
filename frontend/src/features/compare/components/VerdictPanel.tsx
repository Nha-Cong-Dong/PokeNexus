import type { ReactNode } from 'react'

import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { GameDialog } from '../../../components/ui/GameDialog'
import { formatMultiplier, formatNumber, formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeLabel } from '../../../lib/pokemonTypes'
import type { CompareResponse, PokemonDetail, Winner } from '../../../types/api'

type VerdictPanelProps = {
  result: CompareResponse
}

const VERDICT_TITLE_ID = 'compare-verdict-title'

const WINNER_CLASSES: Record<Winner, string> = {
  LEFT: 'bg-primary text-on-primary',
  RIGHT: 'bg-accent text-on-primary',
  TIE: 'bg-surface-muted text-ink',
}

function stabMultipliers(attacker: PokemonDetail, defender: PokemonDetail) {
  return attacker.types.map((type) => ({
    type,
    multiplier: defender.defense.find((entry) => entry.attackingType === type)?.multiplier ?? 1,
  }))
}

export function VerdictPanel({ result }: VerdictPanelProps) {
  const { left, right, verdict } = result
  const leftName = formatPokemonName(left.name)
  const rightName = formatPokemonName(right.name)
  const winnerName = (winner: Winner) =>
    winner === 'LEFT' ? leftName : winner === 'RIGHT' ? rightName : 'Ngang nhau'

  return (
    <GameDialog role="region" aria-labelledby={VERDICT_TITLE_ID} className="mt-4">
      <h2
        id={VERDICT_TITLE_ID}
        className="absolute -top-4 left-5 rounded-full bg-ink px-3.5 py-1 text-sm font-extrabold text-surface"
      >
        Kết luận
      </h2>
      {verdict.summary.length > 0 && (
        <ol className="flex flex-col gap-3.5">
          {verdict.summary.map((sentence, index) => (
            <li
              key={sentence}
              className="flex animate-fade-up items-start gap-3"
              style={staggerDelay(index, 150, 700)}
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-3.5 flex-none rotate-45 rounded-[4px] border-2 border-ink bg-dex-yellow"
              />
              <span className="text-[17px] leading-7">{sentence}</span>
            </li>
          ))}
        </ol>
      )}
      <dl className="mt-5 grid gap-4 border-t-2 border-border pt-4 md:grid-cols-3">
        <VerdictFact
          term="Lợi thế hệ"
          winner={verdict.typeAdvantage.winner}
          winnerName={winnerName(verdict.typeAdvantage.winner)}
        >
          <p>
            Đòn cùng hệ tốt nhất: {leftName}{' '}
            {formatMultiplier(verdict.typeAdvantage.leftBestMultiplier)}, {rightName}{' '}
            {formatMultiplier(verdict.typeAdvantage.rightBestMultiplier)}.
          </p>
          <StabLine attackerName={leftName} items={stabMultipliers(left, right)} />
          <StabLine attackerName={rightName} items={stabMultipliers(right, left)} />
        </VerdictFact>
        <VerdictFact
          term="Tổng chỉ số"
          winner={verdict.statTotal.winner}
          winnerName={winnerName(verdict.statTotal.winner)}
        >
          <p>
            {leftName} {formatNumber(left.baseStatTotal)}, {rightName}{' '}
            {formatNumber(right.baseStatTotal)}; chênh{' '}
            {formatNumber(Math.abs(verdict.statTotal.difference))} điểm.
          </p>
        </VerdictFact>
        <VerdictFact
          term="Tốc độ"
          winner={verdict.speed.winner}
          winnerName={winnerName(verdict.speed.winner)}
        >
          <p>
            {leftName} {left.stats.speed}, {rightName} {right.stats.speed}; chênh{' '}
            {Math.abs(verdict.speed.difference)} điểm.
          </p>
        </VerdictFact>
      </dl>
    </GameDialog>
  )
}

type VerdictFactProps = {
  term: string
  winner: Winner
  winnerName: string
  children: ReactNode
}

function VerdictFact({ term, winner, winnerName, children }: VerdictFactProps) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5">
      <dt className="text-sm font-extrabold text-ink-muted">{term}</dt>
      <dd className="flex flex-col items-start gap-1.5 text-sm text-ink">
        <span
          className={`inline-flex h-7 items-center rounded-full px-3 text-sm font-extrabold ${WINNER_CLASSES[winner]}`}
        >
          {winner === 'TIE' ? winnerName : `${winnerName} thắng`}
        </span>
        {children}
      </dd>
    </div>
  )
}

type StabLineProps = {
  attackerName: string
  items: { type: PokemonDetail['types'][number]; multiplier: number }[]
}

function StabLine({ attackerName, items }: StabLineProps) {
  return (
    <span className="flex flex-wrap items-center gap-1.5">
      <span className="font-bold">{attackerName}:</span>
      {items.map((item) => (
        <span
          key={item.type}
          title={`Đòn ${typeLabel(item.type)} gây ${formatMultiplier(item.multiplier)}`}
          className="inline-flex items-center gap-1"
        >
          <TypeBadge type={item.type} />
          <MultiplierCell multiplier={item.multiplier} className="h-6" />
        </span>
      ))}
    </span>
  )
}
