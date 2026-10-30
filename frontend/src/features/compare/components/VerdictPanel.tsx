import { GameDialog } from '../../../components/ui/GameDialog'
import { staggerDelay } from '../../../lib/motion'
import type { CompareResponse } from '../../../types/api'

type VerdictPanelProps = {
  result: CompareResponse
}

const VERDICT_TITLE_ID = 'compare-verdict-title'

export function VerdictPanel({ result }: VerdictPanelProps) {
  const { summary } = result.verdict

  return (
    <GameDialog
      role="region"
      aria-labelledby={VERDICT_TITLE_ID}
      className="mt-4 min-w-0 shadow-block-lg md:mt-3.5"
    >
      <h2
        id={VERDICT_TITLE_ID}
        className="absolute -top-4 left-5 rounded-full bg-ink px-3.5 py-1 text-sm font-extrabold text-surface"
      >
        Kết luận
      </h2>
      {summary.length > 0 ? (
        <ol className="flex flex-col gap-3.5">
          {summary.map((sentence, index) => (
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
      ) : (
        <p className="text-[17px] leading-7 text-ink-muted">Chưa có kết luận cho cặp này.</p>
      )}
    </GameDialog>
  )
}
