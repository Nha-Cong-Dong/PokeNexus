import type { PlayStyle } from '../../../types/api'

type PlayStyleOption = {
  value: PlayStyle
  label: string
  description: string
}

const PLAY_STYLE_OPTIONS: readonly PlayStyleOption[] = [
  { value: 'BALANCE', label: 'Cân bằng', description: 'Bù chỗ đội đang thiếu' },
  { value: 'HYPER_OFFENSE', label: 'Tấn công nhanh', description: 'Tốc độ gốc từ 80' },
  { value: 'BULKY', label: 'Trâu bò', description: 'HP và phòng thủ cao' },
  { value: 'TRICK_ROOM', label: 'Trick Room', description: 'Tốc độ gốc tối đa 60' },
]

type PlayStylePickerProps = {
  value: PlayStyle
  onChange: (value: PlayStyle) => void
}

export function PlayStylePicker({ value, onChange }: PlayStylePickerProps) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-extrabold text-ink-muted">Lối chơi</legend>
      <div className="grid grid-cols-2 gap-2">
        {PLAY_STYLE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex min-h-14 cursor-pointer flex-col justify-center rounded-2xl border-2 border-border bg-surface px-3 py-2 transition-colors duration-150 ease-out has-checked:border-ink has-checked:bg-dex-yellow has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-focus-ring hover:border-border-strong"
          >
            <input
              type="radio"
              name="play-style"
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />
            <span className="font-extrabold">{option.label}</span>
            <span className="text-xs font-bold text-ink-muted">{option.description}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
