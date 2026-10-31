import { Link } from 'react-router'

import { Panel } from '../../../components/ui/Panel'
import { formatPokemonName } from '../../../lib/formatters'
import type { PokemonForm } from '../../../types/api'
import { FORM_LABELS } from '../labels'

type FormSwitcherProps = {
  forms: PokemonForm[]
  currentId: number
}

const TITLE_ID = 'forms-title'

export function FormSwitcher({ forms, currentId }: FormSwitcherProps) {
  return (
    <Panel aria-labelledby={TITLE_ID} className="min-w-0">
      <h2 id={TITLE_ID} className="mb-3.5 text-2xl font-extrabold">
        Các dạng
      </h2>
      <ul className="flex flex-col">
        {forms.map((form) => {
          const current = form.id === currentId
          return (
            <li key={form.id} className="border-t border-surface-muted first:border-t-0">
              <Link
                to={`/pokemon/${form.name}`}
                aria-current={current ? 'page' : undefined}
                className={`my-1 flex min-h-11 items-center justify-between gap-3 rounded-[10px] px-2.5 py-2 ${current ? 'bg-bg' : 'hover:bg-surface-muted'}`}
              >
                <span className={`font-extrabold ${current ? '' : 'text-primary'}`}>
                  {formatPokemonName(form.name)}
                </span>
                <span className="text-sm font-bold text-ink-muted">
                  {current ? 'Đang xem' : FORM_LABELS[form.formCategory]}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </Panel>
  )
}
