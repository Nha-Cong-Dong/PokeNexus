import { useId, useRef, useState } from 'react'

import { buttonClassName } from '../../../components/ui/buttonStyles'
import { sharePath } from '../api'

type ShareLinkFieldProps = {
  shareCode: string
}

type CopyStatus = { kind: 'idle' } | { kind: 'copied' } | { kind: 'manual' }

function shareUrl(shareCode: string): string {
  return new URL(sharePath(shareCode), window.location.origin).href
}

async function writeClipboard(text: string): Promise<boolean> {
  const clipboard = typeof navigator === 'undefined' ? undefined : navigator.clipboard
  if (!clipboard || typeof clipboard.writeText !== 'function') return false
  try {
    await clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function ShareLinkField({ shareCode }: ShareLinkFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<CopyStatus>({ kind: 'idle' })
  const url = shareUrl(shareCode)

  const copy = async () => {
    if (await writeClipboard(url)) {
      setStatus({ kind: 'copied' })
      return
    }
    inputRef.current?.focus()
    inputRef.current?.select()
    setStatus({ kind: 'manual' })
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-bold">
        Link chia sẻ
      </label>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          readOnly
          value={url}
          onFocus={(event) => event.currentTarget.select()}
          className="h-11 min-w-0 flex-1 rounded-[10px] border-2 border-border-strong bg-surface-muted px-3 text-sm text-ink"
        />
        <button
          type="button"
          onClick={() => void copy()}
          className={`flex-none whitespace-nowrap ${buttonClassName('secondary')}`}
        >
          {status.kind === 'copied' ? 'Đã sao chép' : 'Sao chép'}
        </button>
      </div>
      <p
        role="status"
        className={`min-h-5 text-sm font-bold ${status.kind === 'copied' ? 'text-success' : 'text-ink-muted'}`}
      >
        {status.kind === 'copied' && 'Đã sao chép link.'}
        {status.kind === 'manual' &&
          'Trình duyệt chưa cho sao chép tự động. Link đã được chọn, nhấn Ctrl+C để sao chép.'}
      </p>
    </div>
  )
}
