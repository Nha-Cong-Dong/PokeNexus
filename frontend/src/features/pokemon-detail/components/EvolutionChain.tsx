import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { DexNumber } from '../../../components/pokemon/DexNumber'
import { PokemonSprite } from '../../../components/pokemon/PokemonSprite'
import { TypeBadge } from '../../../components/pokemon/TypeBadge'
import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import { staggerDelay } from '../../../lib/motion'
import { typeScopeClassName } from '../../../lib/pokemonTypes'
import type { PokemonDetail } from '../../../types/api'
import {
  buildEvolutionTree,
  evolutionMethod,
  evolutionStepLabel,
  stageLabel,
  treeSummary,
  type EvolutionMethod,
  type EvolutionNode,
} from '../evolution'
import { useEvolution } from '../hooks'

type EvolutionChainProps = {
  detail: PokemonDetail
}

const TITLE_ID = 'evolution-title'

const BRANCH_ITEM =
  'relative pl-6 before:absolute before:-top-3 before:left-0 before:h-[calc(100%+0.75rem)] before:w-0.5 before:rounded-full before:bg-ink/25 last:before:h-12 after:absolute after:top-9 after:left-0 after:h-0.5 after:w-5 after:rounded-full after:bg-ink/25'

const METHOD_ICONS: Record<EvolutionMethod, ReactNode> = {
  level: <path d="M12 19V5M6 11l6-6 6 6" />,
  item: <path d="M12 3l7 7-7 11-7-11z M5 10h14" />,
  trade: <path d="M4 8h14l-3-3M20 16H6l3 3" />,
  special: <path d="M12 3c.7 5 2.9 7.3 8 8-5.1.7-7.3 3-8 8-.7-5-2.9-7.3-8-8 5.1-.7 7.3-3 8-8z" />,
}

export function EvolutionChain({ detail }: EvolutionChainProps) {
  const { data } = useEvolution(detail.id)
  if (!data) return null

  const roots = buildEvolutionTree(data.stages)
  const order = new Map<number, number>()
  const number = (node: EvolutionNode) => {
    order.set(node.stage.speciesId, order.size)
    node.children.forEach(number)
  }
  roots.forEach(number)

  return (
    <Panel aria-labelledby={TITLE_ID} className="min-w-0 flex-[1_1_32rem]">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 id={TITLE_ID} className="text-2xl font-extrabold">
          Tiến hóa
        </h2>
        {data.stages.length > 1 && (
          <p className="text-sm font-bold text-ink-muted">{treeSummary(roots)}</p>
        )}
      </div>
      {data.stages.length <= 1 ? (
        <p className="text-ink-muted">{formatPokemonName(detail.name)} không tiến hóa.</p>
      ) : (
        <ol className="flex flex-col gap-3">
          {roots.map((node) => (
            <EvolutionBranch
              key={node.stage.speciesId}
              node={node}
              detail={detail}
              order={order}
              root
            />
          ))}
        </ol>
      )}
    </Panel>
  )
}

type EvolutionBranchProps = {
  node: EvolutionNode
  detail: PokemonDetail
  order: ReadonlyMap<number, number>
  root?: boolean
}

function EvolutionBranch({ node, detail, order, root = false }: EvolutionBranchProps) {
  return (
    <li
      className={`motion-safe:animate-fade-up ${root ? '' : BRANCH_ITEM}`}
      style={staggerDelay(order.get(node.stage.speciesId) ?? 0, 70, 120)}
    >
      <EvolutionCard node={node} detail={detail} />
      {node.children.length > 0 && (
        <ol className="mt-3 ml-7 flex flex-col gap-3">
          {node.children.map((child) => (
            <EvolutionBranch
              key={child.stage.speciesId}
              node={child}
              detail={detail}
              order={order}
            />
          ))}
        </ol>
      )}
    </li>
  )
}

type EvolutionCardProps = {
  node: EvolutionNode
  detail: PokemonDetail
}

function EvolutionCard({ node, detail }: EvolutionCardProps) {
  const { stage, depth } = node
  const name = formatPokemonName(stage.name)
  const step = evolutionStepLabel(stage)
  const isCurrentSpecies = stage.speciesId === detail.speciesId

  return (
    <Link
      to={`/pokemon/${stage.pokemonId}`}
      aria-current={stage.pokemonId === detail.id ? 'page' : undefined}
      className={`flex min-h-18 items-center gap-3 rounded-2xl border-2 py-1.5 pr-3 pl-1.5 text-ink transition-[translate,border-color] duration-150 ease-out hover:-translate-y-0.5 ${isCurrentSpecies ? 'type-tint border-ink shadow-block' : 'border-border bg-surface hover:border-border-strong'} ${typeScopeClassName(stage.types[0] ?? 'normal')}`}
    >
      <span
        className={`flex size-14 flex-none items-center justify-center rounded-full ${isCurrentSpecies ? 'bg-surface' : 'type-tint'}`}
      >
        <PokemonSprite id={stage.pokemonId} alt={name} size={48} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
          <span className="text-xs font-bold text-ink-muted">
            <DexNumber id={stage.speciesId} /> · {stageLabel(depth)}
          </span>
          {step && (
            <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2 py-0.5 text-xs font-extrabold text-ink">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="size-3.5 flex-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {METHOD_ICONS[evolutionMethod(stage)]}
              </svg>
              {step}
            </span>
          )}
        </span>
        <span className="truncate font-extrabold">{name}</span>
        <span className="flex flex-wrap gap-1">
          {stage.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </span>
      </span>
    </Link>
  )
}
