import type { CSSProperties, ReactNode } from 'react'

const CLOUD_PATH =
  'M30 60 a24 24 0 0 1 6-46 a30 30 0 0 1 56-6 a26 26 0 0 1 46 14 a22 22 0 0 1 32 38 z'

const SPARK_PATH =
  'M12 2c.8 6.5 3.5 9.2 10 10c-6.5.8-9.2 3.5-10 10c-.8-6.5-3.5-9.2-10-10c6.5-.8 9.2-3.5 10-10z'

const WAVE_PATHS = {
  ridge: 'M0 80 V44 C 180 8, 360 6, 560 34 S 960 78, 1160 40 S 1360 12, 1440 26 V80 Z',
  valley: 'M0 80 V30 C 220 70, 420 74, 640 44 S 1060 2, 1260 30 S 1400 52, 1440 40 V80 Z',
  shore: 'M0 80 V40 C 200 10, 420 8, 640 36 S 1060 76, 1260 44 S 1400 22, 1440 30 V80 Z',
} as const

type DecorProps = {
  className?: string
  style?: CSSProperties
}

export function Aura({ children }: { children: ReactNode }) {
  return (
    <div
      aria-hidden="true"
      className="aura-mask pointer-events-none absolute inset-0 overflow-hidden [--aura-fade:90px] md:[--aura-fade:150px]"
    >
      {children}
    </div>
  )
}

type BlobProps = DecorProps & {
  drift?: 'a' | 'b'
}

export function Blob({ className = '', style, drift = 'a' }: BlobProps) {
  const motion = drift === 'a' ? 'motion-safe:animate-drift-a' : 'motion-safe:animate-drift-b'
  return (
    <span
      className={`absolute rounded-full bg-radial to-transparent to-62% ${motion} ${className}`}
      style={style}
    />
  )
}

export function Cloud({ className = '', style }: DecorProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 70"
      className={`pointer-events-none absolute left-0 h-auto fill-white motion-safe:animate-cloud motion-reduce:hidden ${className}`}
      style={style}
    >
      <path d={CLOUD_PATH} />
    </svg>
  )
}

type SparkProps = DecorProps & {
  outlined?: boolean
}

export function Spark({ className = '', style, outlined = true }: SparkProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute h-auto motion-safe:animate-twinkle ${outlined ? 'stroke-ink' : ''} ${className}`}
      style={style}
      strokeWidth={outlined ? 1.2 : 0}
      strokeLinejoin="round"
    >
      <path d={SPARK_PATH} />
    </svg>
  )
}

type WaveProps = {
  variant: keyof typeof WAVE_PATHS
  className: string
}

export function Wave({ variant, className }: WaveProps) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 80"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute -bottom-px left-0 block h-11 w-full md:h-20 ${className}`}
    >
      <path d={WAVE_PATHS[variant]} />
    </svg>
  )
}
