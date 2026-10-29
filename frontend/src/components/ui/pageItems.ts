export type PageItem = number | 'gap'

const MAX_ITEMS_WITHOUT_GAP = 7

export function pageItems(page: number, totalPages: number): PageItem[] {
  if (totalPages <= 0) return []
  if (totalPages <= MAX_ITEMS_WITHOUT_GAP) {
    return Array.from({ length: totalPages }, (_, index) => index)
  }
  const last = totalPages - 1
  const edgeNeighbour = page === 0 ? 2 : page === last ? last - 2 : page
  const visible = [...new Set([0, page - 1, page, page + 1, edgeNeighbour, last])]
    .filter((index) => index >= 0 && index <= last)
    .sort((a, b) => a - b)
  return visible.flatMap((index, position): PageItem[] => {
    const previous = visible[position - 1]
    return previous !== undefined && index - previous > 1 ? ['gap', index] : [index]
  })
}
