import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from 'react'

import { buttonClassName } from '../../../components/ui/buttonStyles'
import { writeClipboard } from '../../../lib/clipboard'
import { errorMessageFor } from '../../../lib/errorMessages'
import { formatPokemonName } from '../../../lib/formatters'
import { ApiError } from '../../../lib/http'
import { fetchPokemonDetail } from '../../pokemon-detail/api'
import { usePokemonDetails } from '../../pokemon-detail/hooks'
import { searchAllForms } from '../api'
import {
  formatShowdownTeam,
  parseShowdown,
  planImport,
  resolveShowdownName,
  SHOWDOWN_TEAM_SIZE,
  toShowdownName,
  type ImportPlan,
  type ShowdownLookup,
} from '../showdown'

const LOOKUP: ShowdownLookup = {
  getPokemon: async (name) => {
    const { id, name: found, types } = await fetchPokemonDetail(name)
    return { id, name: found, types }
  },
  searchPokemon: (query) => searchAllForms(query),
}

const PLACEHOLDER = [
  'Chompy (Garchomp) @ Choice Scarf',
  'Ability: Rough Skin',
  '- Earthquake',
  '',
  'Indeedee-F @ Psychic Seed',
].join('\n')

const PANEL_CLASS = 'flex flex-col gap-4 px-6 pt-7 pb-6 md:px-7'
const TEXTAREA_CLASS =
  'min-h-44 w-full rounded-[10px] border-2 border-border-strong px-3 py-2 text-sm/6 text-ink'

type DialogShellProps = {
  open: boolean
  onClose: () => void
  titleId: string
  children: ReactNode
}

function DialogShell({ open, onClose, titleId, children }: DialogShellProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl border-3 border-ink bg-surface p-0 text-ink shadow-xl outline-2 -outline-offset-8 outline-border backdrop:bg-scrim/55"
    >
      {open && children}
    </dialog>
  )
}

type ShowdownImportDialogProps = {
  open: boolean
  onClose: () => void
  onImport: (plan: ImportPlan) => void
}

export function ShowdownImportDialog({ open, onClose, onImport }: ShowdownImportDialogProps) {
  const titleId = useId()
  return (
    <DialogShell open={open} onClose={onClose} titleId={titleId}>
      <ImportContent titleId={titleId} onClose={onClose} onImport={onImport} />
    </DialogShell>
  )
}

type ImportState =
  | { kind: 'idle' }
  | { kind: 'pending' }
  | { kind: 'error'; message: string }
  | { kind: 'done'; plan: ImportPlan; ignoredDetails: boolean }

type ImportContentProps = {
  titleId: string
  onClose: () => void
  onImport: (plan: ImportPlan) => void
}

function ImportContent({ titleId, onClose, onImport }: ImportContentProps) {
  const [text, setText] = useState('')
  const [state, setState] = useState<ImportState>({ kind: 'idle' })
  const inputId = useId()
  const pending = state.kind === 'pending'

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const parsed = parseShowdown(text)
    if (parsed.entries.length === 0) {
      setState({ kind: 'error', message: 'Chưa có tên Pokémon nào trong văn bản.' })
      return
    }
    setState({ kind: 'pending' })
    try {
      const refs = await Promise.all(
        parsed.entries.map((entry) => resolveShowdownName(entry.species, LOOKUP)),
      )
      const plan = planImport(parsed.entries, refs)
      if (plan.members.length === 0) {
        const names = parsed.entries.map((entry) => entry.species).join(', ')
        setState({ kind: 'error', message: `Không nhận ra Pokémon nào: ${names}.` })
        return
      }
      onImport(plan)
      setState({ kind: 'done', plan, ignoredDetails: parsed.ignoredDetails })
    } catch (error) {
      setState({
        kind: 'error',
        message: errorMessageFor(error instanceof ApiError ? error.code : undefined),
      })
    }
  }

  if (state.kind === 'done') {
    return (
      <ImportSummary
        titleId={titleId}
        plan={state.plan}
        ignoredDetails={state.ignoredDetails}
        onClose={onClose}
      />
    )
  }

  return (
    <form onSubmit={(event) => void submit(event)} noValidate className={PANEL_CLASS}>
      <h2 id={titleId} className="text-xl font-extrabold">
        Nhập đội từ Showdown
      </h2>
      <p className="text-sm text-ink-muted">
        Dán đội đã xuất từ Pokémon Showdown. PokeNexus chỉ đọc tên Pokémon ở dòng đầu mỗi khối và
        thay đội hiện tại bằng tối đa {SHOWDOWN_TEAM_SIZE} Pokémon đầu tiên.
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-bold">
          Văn bản đội
        </label>
        <textarea
          id={inputId}
          rows={8}
          value={text}
          spellCheck={false}
          onChange={(event) => setText(event.target.value)}
          placeholder={PLACEHOLDER}
          className={`${TEXTAREA_CLASS} bg-surface`}
        />
      </div>
      {state.kind === 'error' && (
        <p
          role="alert"
          className="rounded-[10px] border-2 border-danger px-3 py-2 text-sm font-bold text-danger"
        >
          {state.message}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose} className={buttonClassName('secondary')}>
          Hủy
        </button>
        <button
          type="submit"
          disabled={pending}
          aria-busy={pending}
          className={buttonClassName('primary')}
        >
          {pending ? 'Đang tra tên…' : 'Nhập đội'}
        </button>
      </div>
    </form>
  )
}

type ImportSummaryProps = {
  titleId: string
  plan: ImportPlan
  ignoredDetails: boolean
  onClose: () => void
}

function ImportSummary({ titleId, plan, ignoredDetails, onClose }: ImportSummaryProps) {
  const names = plan.members.map((member) => formatPokemonName(member.name)).join(', ')
  const notes = [
    ...plan.unmatched.map(
      (entry) => `Dòng ${entry.line}: ${entry.species} không có trong dữ liệu.`,
    ),
    ...(plan.duplicates > 0 ? [`Bỏ ${plan.duplicates} Pokémon bị trùng.`] : []),
    ...(plan.overflow > 0
      ? [`Bỏ ${plan.overflow} Pokémon vượt quá ${SHOWDOWN_TEAM_SIZE} slot.`]
      : []),
    ...(ignoredDetails ? ['Chiêu thức, vật phẩm, Ability, EV và tính cách đã được bỏ qua.'] : []),
  ]

  return (
    <div className={PANEL_CLASS}>
      <h2 id={titleId} className="text-xl font-extrabold">
        Đã nhập đội
      </h2>
      <p>{`Đã thêm ${plan.members.length} Pokémon: ${names}.`}</p>
      {plan.sixth !== null && (
        <p className="text-sm text-ink-muted">Pokémon thứ 6 được đặt vào slot 6.</p>
      )}
      {notes.length > 0 && (
        <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-ink-muted">
          {notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
      <div className="flex justify-end">
        <button type="button" onClick={onClose} className={buttonClassName('primary')}>
          Đóng
        </button>
      </div>
    </div>
  )
}

type ShowdownExportDialogProps = {
  open: boolean
  onClose: () => void
  ids: readonly number[]
}

export function ShowdownExportDialog({ open, onClose, ids }: ShowdownExportDialogProps) {
  const titleId = useId()
  return (
    <DialogShell open={open} onClose={onClose} titleId={titleId}>
      <ExportContent titleId={titleId} ids={ids} onClose={onClose} />
    </DialogShell>
  )
}

type CopyStatus = 'idle' | 'copied' | 'manual'

const COPY_MESSAGES: Record<CopyStatus, string> = {
  idle: '',
  copied: 'Đã sao chép. Dán vào Import from text trong Showdown.',
  manual: 'Trình duyệt không cho sao chép tự động. Văn bản đã được chọn, nhấn Ctrl+C để sao chép.',
}

function ExportContent({
  titleId,
  ids,
  onClose,
}: {
  titleId: string
  ids: readonly number[]
  onClose: () => void
}) {
  const details = usePokemonDetails(ids)
  const [status, setStatus] = useState<CopyStatus>('idle')
  const textRef = useRef<HTMLTextAreaElement>(null)
  const textId = useId()
  const failed = details.some((query) => query.isError)
  const loaded = details.flatMap((query) => (query.data ? [query.data] : []))
  const ready = !failed && loaded.length === ids.length
  const text = ready ? formatShowdownTeam(loaded.map((detail) => toShowdownName(detail))) : ''

  const copy = async () => {
    if (await writeClipboard(text)) {
      setStatus('copied')
      return
    }
    textRef.current?.focus()
    textRef.current?.select()
    setStatus('manual')
  }

  return (
    <div className={PANEL_CLASS}>
      <h2 id={titleId} className="text-xl font-extrabold">
        Xuất đội sang Showdown
      </h2>
      <p className="text-sm text-ink-muted">
        Văn bản chỉ có tên Pokémon. Sau khi dán vào Showdown, bạn tự thêm chiêu thức, vật phẩm và
        EV.
      </p>
      {failed ? (
        <p
          role="alert"
          className="rounded-[10px] border-2 border-danger px-3 py-2 text-sm font-bold text-danger"
        >
          Chưa tải được thông tin đội để xuất.
        </p>
      ) : ready ? (
        <div className="flex flex-col gap-1.5">
          <label htmlFor={textId} className="text-sm font-bold">
            Văn bản Showdown
          </label>
          <textarea
            ref={textRef}
            id={textId}
            readOnly
            rows={Math.min(ids.length * 2, 12)}
            value={text}
            onFocus={(event) => event.currentTarget.select()}
            className={`${TEXTAREA_CLASS} bg-surface-muted`}
          />
        </div>
      ) : (
        <div aria-hidden="true" className="h-44 animate-pulse rounded-[10px] bg-surface-muted" />
      )}
      <p aria-live="polite" className="min-h-5 text-sm font-bold text-ink-muted">
        {COPY_MESSAGES[status]}
      </p>
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose} className={buttonClassName('secondary')}>
          Đóng
        </button>
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!ready}
          className={buttonClassName('primary')}
        >
          Sao chép
        </button>
      </div>
    </div>
  )
}
