import type { TypeName } from '../../types/api'

const GLYPHS: Record<TypeName, string> = {
  normal: 'M12 3.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L12 16.8l-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z',
  fire: 'M12 3c1 3.2 5 5.4 5 10.2a5 5 0 0 1-10 0c0-2.6 1.4-4.2 2.6-5.2c0 2 .9 3.2 2.1 3.4c-.6-3 .1-5.8.3-8.4z',
  water: 'M12 3.5c3.2 4.6 6 7.6 6 11a6 6 0 0 1-12 0c0-3.4 2.8-6.4 6-11z',
  electric: 'M13.5 3L6 13.5h5.2L10.5 21L18 10.5h-5.2z',
  grass: 'M5 19C5 10.5 10.5 5 19 5c0 8.5-5.5 14-14 14z M5 19l8.5-8.5',
  ice: 'M12 3v18 M4.2 7.5l15.6 9 M4.2 16.5l15.6-9 M9.5 4.5L12 6.5l2.5-2 M9.5 19.5l2.5-2 2.5 2',
  fighting:
    'M12 3l2.1 5.3 5.4-1.6-2.4 5.1 4.4 3.4-5.6.6.6 5.6L12 18l-4.5 3.4.6-5.6-5.6-.6 4.4-3.4-2.4-5.1 5.4 1.6z',
  poison:
    'M9 10a4.5 4.5 0 1 0 0 9a4.5 4.5 0 1 0 0-9z M16 4a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M17.5 14a2 2 0 1 0 0 4a2 2 0 1 0 0-4z',
  ground: 'M3 19h18 M5.5 15h13 M8 11h8 M10.5 7h3',
  flying: 'M3 17c7 0 14.5-4 17.5-12c-5.5 1-9.5 4-11.5 8 M3 17c3-3.5 6.5-5.5 10-6',
  psychic:
    'M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  bug: 'M12 7a5 6.5 0 1 0 0 13a5 6.5 0 1 0 0-13z M12 7v13 M9.5 7.5L7 4 M14.5 7.5L17 4 M7 12H4 M17 12h3',
  rock: 'M7.5 4h9l4 7-4 9h-9l-4-9z M7.5 4l4.5 7 4.5-7 M3.5 11h17',
  ghost: 'M6 20V10a6 6 0 0 1 12 0v10l-2-1.6-2 1.6-2-1.6-2 1.6-2-1.6z M10 10v1.5 M14 10v1.5',
  dragon: 'M4 20c1.5-7.5 6-13.5 16-16c-1.5 5.5-4.5 8.5-8.5 10c2 .8 4 .8 6 0c-3 3.8-8 6-13.5 6z',
  dark: 'M15.5 3.5a8.5 8.5 0 1 0 5 12.5a7 7 0 0 1-5-12.5z',
  steel: 'M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
  fairy: 'M12 3l1.9 6.6L20.5 12l-6.6 2.4L12 21l-1.9-6.6L3.5 12l6.6-2.4z',
}

type TypeGlyphProps = {
  type: TypeName
  className?: string
  strokeWidth?: number
}

export function TypeGlyph({ type, className, strokeWidth = 1.6 }: TypeGlyphProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={GLYPHS[type]} />
    </svg>
  )
}
