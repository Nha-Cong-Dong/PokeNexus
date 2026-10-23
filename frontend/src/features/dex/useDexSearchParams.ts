import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router'

import { isTypeName } from '../../lib/pokemonTypes'
import type { FormCategory, TypeName } from '../../types/api'

export const FORM_CATEGORIES: readonly FormCategory[] = [
  'DEFAULT',
  'REGIONAL',
  'MEGA',
  'GMAX',
  'OTHER',
]
export const SORT_OPTIONS = ['id,asc', 'name,asc', 'baseStatTotal,desc', 'speed,desc'] as const
export const MAX_GENERATION = 9

export type DexSort = (typeof SORT_OPTIONS)[number]

export interface DexFilter {
  types: TypeName[]
  gen?: number
  forms: FormCategory[]
  sort: DexSort
  page: number
}

export type DexFilterChange = Partial<Omit<DexFilter, 'page'>>

function isFormCategory(value: string): value is FormCategory {
  return (FORM_CATEGORIES as readonly string[]).includes(value)
}

function isSort(value: string | null): value is DexSort {
  return value !== null && (SORT_OPTIONS as readonly string[]).includes(value)
}

function toPositiveInt(value: string | null): number | undefined {
  if (value === null || !/^\d+$/.test(value)) return undefined
  return Number(value)
}

export function parseDexFilter(params: URLSearchParams): DexFilter {
  const types = [...new Set(params.getAll('type').filter(isTypeName))].slice(0, 2)
  const gen = toPositiveInt(params.get('gen'))
  const sort = params.get('sort')
  const page = toPositiveInt(params.get('page'))
  return {
    types,
    gen: gen !== undefined && gen >= 1 && gen <= MAX_GENERATION ? gen : undefined,
    forms: [...new Set(params.getAll('form').filter(isFormCategory))],
    sort: isSort(sort) ? sort : 'id,asc',
    page: page !== undefined && page > 0 ? page - 1 : 0,
  }
}

export function toSearchParams(filter: DexFilter): URLSearchParams {
  const params = new URLSearchParams()
  filter.types.forEach((type) => params.append('type', type))
  if (filter.gen !== undefined) params.set('gen', String(filter.gen))
  filter.forms.forEach((form) => params.append('form', form))
  if (filter.sort !== 'id,asc') params.set('sort', filter.sort)
  if (filter.page > 0) params.set('page', String(filter.page + 1))
  return params
}

export function useDexSearchParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filter = useMemo(() => parseDexFilter(searchParams), [searchParams])

  const updateFilter = useCallback(
    (change: DexFilterChange) => setSearchParams(toSearchParams({ ...filter, ...change, page: 0 })),
    [filter, setSearchParams],
  )
  const setPage = useCallback(
    (page: number) => setSearchParams(toSearchParams({ ...filter, page })),
    [filter, setSearchParams],
  )
  const clearFilter = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams])

  const activeCount =
    filter.types.length + (filter.gen !== undefined ? 1 : 0) + (filter.forms.length > 0 ? 1 : 0)

  return { filter, updateFilter, setPage, clearFilter, activeCount }
}
