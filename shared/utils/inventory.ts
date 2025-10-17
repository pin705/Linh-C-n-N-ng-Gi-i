import { HERBS } from '../configs/herbs.config'
import { QUALITIES, type Quality } from '../configs/quality.config'
import { SEEDS } from '../configs/seeds.config'

// Vật phẩm thô từ Database
interface RawInventoryItem {
  itemId: string
  quantity: number
  quality: Quality
}

// Vật phẩm đã được "chú giải", gửi về cho client
export interface EnrichedInventoryItem extends RawInventoryItem {
  name: string
  description: string
  type: 'seed' | 'herb' | 'item'
  color: string
}

export function enrichInventory(inventory: RawInventoryItem[]): EnrichedInventoryItem[] {
  if (!inventory) return []
  return inventory.map((item) => {
    const seedInfo = SEEDS[item.itemId]
    const herbInfo = HERBS[item.itemId]
    const qualityInfo = QUALITIES[item.quality] || QUALITIES.common

    let name = 'Vật phẩm không xác định'
    let description = 'Không có mô tả.'
    let type: 'seed' | 'herb' | 'item' = 'item'

    if (seedInfo) {
      name = seedInfo.name
      description = `Hạt giống ${QUALITIES[seedInfo.quality]?.label || ''}. Thu hoạch được ${HERBS[seedInfo.herbId]?.name || ''}.`
      type = 'seed'
    } else if (herbInfo) {
      name = herbInfo.name
      description = herbInfo.description
      type = 'herb'
    }

    return {
      ...item,
      name,
      description,
      type,
      color: qualityInfo.color
    }
  })
}
