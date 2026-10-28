import { SCENES, typesForScene, type SceneId } from '../../lib/scenes'
import type { TypeName } from '../../types/api'
import type { Badge } from '../trainer/progress'

export const TERRAIN_IDS = [
  'grassland',
  'forest',
  'sea',
  'volcano',
  'power-plant',
  'snowfield',
  'mountain',
  'desert',
  'swamp',
  'sky',
  'ruins',
  'haunted',
  'flower-garden',
] as const satisfies readonly SceneId[]

export type TerrainId = (typeof TERRAIN_IDS)[number]

export const DEFAULT_TERRAIN: TerrainId = 'grassland'

export const TERRAIN_DESCRIPTIONS: Record<TerrainId, string> = {
  grassland:
    'Đồng cỏ rộng, nắng nhiều, là nơi nhiều Trainer gặp Pokémon đầu tiên. Pokémon hệ Normal thích nghi với mọi nơi nên xuất hiện dày đặc ở đây.',
  forest: 'Tán cây dày giữ ẩm và che nắng. Pokémon hệ Grass và Bug sống nhờ lá, hoa và gỗ mục.',
  sea: 'Biển khơi và bờ cát nối liền các vùng đất. Pokémon hệ Water bơi, lặn và di chuyển theo dòng nước.',
  volcano:
    'Đá nóng, dung nham và tro bụi. Pokémon hệ Fire chịu được nhiệt độ mà Pokémon khác không sống nổi.',
  'power-plant':
    'Nhà máy, dây điện và máy móc. Pokémon hệ Electric và Steel tìm đến nguồn năng lượng và kim loại.',
  snowfield:
    'Gió lạnh và băng tuyết quanh năm. Pokémon hệ Ice có lớp lông dày hoặc cơ thể bằng băng để chịu rét.',
  mountain:
    'Vách đá dựng đứng và hang động. Pokémon hệ Rock và Fighting rèn sức bền ở địa hình hiểm trở.',
  desert:
    'Cát nóng ban ngày, lạnh về đêm, rất ít nước. Pokémon hệ Ground đào hang dưới cát để tránh nắng.',
  swamp: 'Nước tù, bùn lầy và khí độc. Pokémon hệ Poison sinh sôi ở nơi loài khác tránh xa.',
  sky: 'Tầng mây cao và gió mạnh. Pokémon hệ Flying và Dragon làm chủ bầu trời.',
  ruins: 'Đền đài cổ và di tích bí ẩn. Pokémon hệ Psychic gắn với những truyền thuyết lâu đời.',
  haunted: 'Rừng đêm và nhà hoang. Pokémon hệ Ghost và Dark hoạt động mạnh nhất khi trời tối.',
  'flower-garden':
    'Vườn hoa rực rỡ, không khí trong lành. Pokémon hệ Fairy thích những nơi đẹp và yên bình.',
}

export function isTerrainId(value: string | undefined): value is TerrainId {
  return value !== undefined && (TERRAIN_IDS as readonly string[]).includes(value)
}

export function terrainTypes(terrain: TerrainId): TypeName[] {
  return typesForScene(terrain)
}

export function terrainBadgeId(terrain: TerrainId): string {
  return `terrain:${terrain}`
}

export const TERRAIN_BADGES: readonly Badge[] = TERRAIN_IDS.map((terrain) => ({
  id: terrainBadgeId(terrain),
  label: SCENES[terrain].name,
}))
