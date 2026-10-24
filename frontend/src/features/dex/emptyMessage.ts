import { typeLabel } from '../../lib/pokemonTypes'
import type { DexFilter } from './useDexSearchParams'

function bstPart(minBst?: number, maxBst?: number): string | undefined {
  if (minBst !== undefined && maxBst !== undefined) return `có BST từ ${minBst} đến ${maxBst}`
  if (minBst !== undefined) return `có BST từ ${minBst} trở lên`
  if (maxBst !== undefined) return `có BST không quá ${maxBst}`
  return undefined
}

export function emptyResultMessage(filter: DexFilter): string {
  const parts = [
    filter.types.length > 0 ? `hệ ${filter.types.map(typeLabel).join(' + ')}` : undefined,
    filter.gen !== undefined ? `thuộc Thế hệ ${filter.gen}` : undefined,
    bstPart(filter.minBst, filter.maxBst),
    filter.minSpeed !== undefined ? `có Tốc độ từ ${filter.minSpeed} trở lên` : undefined,
  ].filter((part): part is string => part !== undefined)

  const hint =
    filter.minBst !== undefined || filter.maxBst !== undefined
      ? 'Thử bỏ bớt một điều kiện hoặc nới khoảng BST.'
      : 'Thử bỏ bớt một điều kiện.'

  return parts.length > 0 ? `Chưa có Pokémon nào ${parts.join(', ')}. ${hint}` : hint
}
