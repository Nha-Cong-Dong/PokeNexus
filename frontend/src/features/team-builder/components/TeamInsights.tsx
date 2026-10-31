import type { InsightTone, TeamInsight } from '../../../types/api'

type TeamInsightsProps = {
  insights: readonly TeamInsight[]
}

const GROUPS: readonly { tone: InsightTone; title: string; empty: string }[] = [
  { tone: 'STRENGTH', title: 'Điểm mạnh', empty: 'Chưa có điểm mạnh nổi bật.' },
  { tone: 'WEAKNESS', title: 'Điểm yếu', empty: 'Chưa thấy điểm yếu đáng kể.' },
]

export function TeamInsights({ insights }: TeamInsightsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {GROUPS.map((group) => {
        const items = insights.filter((insight) => insight.tone === group.tone)
        return (
          <section
            key={group.tone}
            aria-label={group.title}
            className="flex min-w-0 flex-col gap-2"
          >
            <h3
              className={`text-sm font-extrabold ${group.tone === 'STRENGTH' ? 'text-success' : 'text-danger'}`}
            >
              {group.title}
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-ink-muted">{group.empty}</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {items.map((insight) => (
                  <li key={insight.text} className="flex gap-2 text-sm leading-5">
                    {group.tone === 'STRENGTH' ? STRENGTH_ICON : WEAKNESS_ICON}
                    <span className="min-w-0">{insight.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )
      })}
    </div>
  )
}

const STRENGTH_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="mt-px size-4.5 flex-none text-success"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
)

const WEAKNESS_ICON = (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="mt-px size-4.5 flex-none text-danger"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4l9 16H3z" />
    <path d="M12 10v4.5M12 17.5v.01" />
  </svg>
)
