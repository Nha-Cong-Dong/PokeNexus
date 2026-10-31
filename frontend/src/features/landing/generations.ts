export interface StarterInfo {
  id: number
  name: string
}

export interface GenerationInfo {
  generation: number
  region: string
  year: number
  barClassName: string
  starters: readonly StarterInfo[]
}

export const GENERATIONS: readonly GenerationInfo[] = [
  {
    generation: 1,
    region: 'Kanto',
    year: 1996,
    barClassName: 'bg-type-fighting',
    starters: [
      { id: 1, name: 'bulbasaur' },
      { id: 4, name: 'charmander' },
      { id: 7, name: 'squirtle' },
    ],
  },
  {
    generation: 2,
    region: 'Johto',
    year: 1999,
    barClassName: 'bg-type-electric',
    starters: [
      { id: 152, name: 'chikorita' },
      { id: 155, name: 'cyndaquil' },
      { id: 158, name: 'totodile' },
    ],
  },
  {
    generation: 3,
    region: 'Hoenn',
    year: 2002,
    barClassName: 'bg-type-water-deep',
    starters: [
      { id: 252, name: 'treecko' },
      { id: 255, name: 'torchic' },
      { id: 258, name: 'mudkip' },
    ],
  },
  {
    generation: 4,
    region: 'Sinnoh',
    year: 2006,
    barClassName: 'bg-type-flying-deep',
    starters: [
      { id: 387, name: 'turtwig' },
      { id: 390, name: 'chimchar' },
      { id: 393, name: 'piplup' },
    ],
  },
  {
    generation: 5,
    region: 'Unova',
    year: 2010,
    barClassName: 'bg-type-grass-deep',
    starters: [
      { id: 495, name: 'snivy' },
      { id: 498, name: 'tepig' },
      { id: 501, name: 'oshawott' },
    ],
  },
  {
    generation: 6,
    region: 'Kalos',
    year: 2013,
    barClassName: 'bg-type-fairy-deep',
    starters: [
      { id: 650, name: 'chespin' },
      { id: 653, name: 'fennekin' },
      { id: 656, name: 'froakie' },
    ],
  },
  {
    generation: 7,
    region: 'Alola',
    year: 2016,
    barClassName: 'bg-type-fire-deep',
    starters: [
      { id: 722, name: 'rowlet' },
      { id: 725, name: 'litten' },
      { id: 728, name: 'popplio' },
    ],
  },
  {
    generation: 8,
    region: 'Galar',
    year: 2019,
    barClassName: 'bg-type-ice-deep',
    starters: [
      { id: 810, name: 'grookey' },
      { id: 813, name: 'scorbunny' },
      { id: 816, name: 'sobble' },
    ],
  },
  {
    generation: 9,
    region: 'Paldea',
    year: 2022,
    barClassName: 'bg-type-dragon',
    starters: [
      { id: 906, name: 'sprigatito' },
      { id: 909, name: 'fuecoco' },
      { id: 912, name: 'quaxly' },
    ],
  },
]
