import { EnrichedInventoryItem } from './../shared/utils/inventory';
// Định nghĩa cấu trúc dữ liệu cho Nhân vật ở phía Client
export interface Character {
  _id: string
  userId: string
  name: string
  cultivationExp: number
  realm: string
  inventory: EnrichedInventoryItem[]
  createdAt: string
  updatedAt: string
}
