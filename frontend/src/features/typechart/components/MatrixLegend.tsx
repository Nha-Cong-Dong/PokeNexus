import { MultiplierCell } from '../../../components/pokemon/MultiplierCell'
import { NeutralMark } from '../../../components/pokemon/NeutralMark'

const LEGEND_ITEMS = [
  { multiplier: 2, label: 'Hiệu quả' },
  { multiplier: 0.5, label: 'Bị giảm' },
  { multiplier: 0, label: 'Không tác dụng' },
]

export function MatrixLegend() {
  return (
    <ul
      aria-label="Chú giải"
      className="flex flex-wrap gap-x-3 gap-y-2 text-sm font-bold text-ink-muted"
    >
      {LEGEND_ITEMS.map((item) => (
        <li key={item.multiplier} className="flex items-center gap-1.5">
          <MultiplierCell multiplier={item.multiplier} className="h-7" />
          {item.label}
        </li>
      ))}
      <li className="flex items-center gap-1.5">
        <span
          aria-hidden="true"
          className="flex h-7 min-w-10 items-center justify-center rounded-md border border-dashed border-border"
        >
          <NeutralMark />
        </span>
        x1 Trung tính
      </li>
    </ul>
  )
}
