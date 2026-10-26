export interface GenerationInfo {
  generation: number
  region: string
  year: number
  barClassName: string
}

export const GENERATIONS: readonly GenerationInfo[] = [
  { generation: 1, region: 'Kanto', year: 1996, barClassName: 'bg-type-fighting' },
  { generation: 2, region: 'Johto', year: 1999, barClassName: 'bg-type-electric' },
  { generation: 3, region: 'Hoenn', year: 2002, barClassName: 'bg-type-water-deep' },
  { generation: 4, region: 'Sinnoh', year: 2006, barClassName: 'bg-type-flying-deep' },
  { generation: 5, region: 'Unova', year: 2010, barClassName: 'bg-type-grass-deep' },
  { generation: 6, region: 'Kalos', year: 2013, barClassName: 'bg-type-fairy-deep' },
  { generation: 7, region: 'Alola', year: 2016, barClassName: 'bg-type-fire-deep' },
  { generation: 8, region: 'Galar', year: 2019, barClassName: 'bg-type-ice-deep' },
  { generation: 9, region: 'Paldea', year: 2022, barClassName: 'bg-type-dragon' },
]
