import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router'

import { buttonClassName } from '../../../components/ui/buttonStyles'
import { errorMessageFor } from '../../../lib/errorMessages'
import { ApiError } from '../../../lib/http'
import type { TeamMemberRequest } from '../../../types/api'
import { sharePath, TEAM_NAME_MAX_LENGTH } from '../api'
import { useSaveTeam } from '../hooks'
import { teamNameError } from '../teamAnalysis'
import { ShareLinkField } from './ShareLinkField'

type SaveTeamDialogProps = {
  open: boolean
  onClose: () => void
  members: readonly TeamMemberRequest[]
  memberNames: readonly string[]
}

export function SaveTeamDialog({ open, onClose, members, memberNames }: SaveTeamDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

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
      {open && (
        <SaveTeamContent
          titleId={titleId}
          members={members}
          memberNames={memberNames}
          onClose={onClose}
        />
      )}
    </dialog>
  )
}

type SaveTeamContentProps = {
  titleId: string
  members: readonly TeamMemberRequest[]
  memberNames: readonly string[]
  onClose: () => void
}

function SaveTeamContent({ titleId, members, memberNames, onClose }: SaveTeamContentProps) {
  const save = useSaveTeam()
  const [name, setName] = useState('')
  const [touched, setTouched] = useState(false)
  const inputId = useId()
  const messageId = useId()
  const nameError = touched ? teamNameError(name) : null

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched(true)
    if (teamNameError(name) !== null || save.isPending) return
    save.mutate({ name: name.trim(), members: [...members] })
  }

  if (save.data) {
    const team = save.data
    return (
      <div className="flex flex-col gap-4 px-6 pt-7 pb-6 md:px-7">
        <h2 id={titleId} className="text-xl font-extrabold">
          Đã lưu đội
        </h2>
        <p className="text-ink-muted">
          Đội <span className="font-bold text-ink">{team.name}</span> có {team.members.length} thành
          viên. Gửi link dưới đây để người khác xem đội.
        </p>
        <ShareLinkField shareCode={team.shareCode} />
        <div className="flex flex-wrap justify-end gap-2">
          <Link to={sharePath(team.shareCode)} className={buttonClassName('secondary')}>
            Mở trang đội
          </Link>
          <button type="button" onClick={onClose} className={buttonClassName('primary')}>
            Đóng
          </button>
        </div>
      </div>
    )
  }

  const errorCode = save.error instanceof ApiError ? save.error.code : undefined

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 px-6 pt-7 pb-6 md:px-7">
      <h2 id={titleId} className="text-xl font-extrabold">
        Lưu đội
      </h2>
      <p className="text-sm text-ink-muted">
        {members.length} thành viên: {memberNames.join(', ')}.
      </p>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-bold">
          Tên đội
        </label>
        <input
          id={inputId}
          type="text"
          value={name}
          maxLength={TEAM_NAME_MAX_LENGTH}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => setTouched(true)}
          aria-invalid={nameError !== null}
          aria-describedby={messageId}
          placeholder="Ví dụ: Đội Rồng Lửa"
          className="h-11 rounded-[10px] border-2 border-border-strong bg-surface px-3 text-ink aria-[invalid=true]:border-danger"
        />
        <p
          id={messageId}
          className={`text-sm ${nameError ? 'font-bold text-danger' : 'text-ink-muted'}`}
        >
          {nameError ?? `Từ 1 đến ${TEAM_NAME_MAX_LENGTH} ký tự.`}
        </p>
      </div>
      {save.isError && (
        <p
          role="alert"
          className="rounded-[10px] border-2 border-danger px-3 py-2 text-sm font-bold text-danger"
        >
          {errorMessageFor(errorCode)}
        </p>
      )}
      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" onClick={onClose} className={buttonClassName('secondary')}>
          Hủy
        </button>
        <button
          type="submit"
          disabled={save.isPending}
          aria-busy={save.isPending}
          className={buttonClassName('primary')}
        >
          {save.isPending ? 'Đang lưu…' : 'Lưu đội'}
        </button>
      </div>
    </form>
  )
}
