// server/configs/seeds.config.ts
import type { Quality } from './quality.config'

export interface Seed {
  id: string
  name: string
  quality: Quality
  growthTime: number // in seconds
  baseExp: number
  herbId: string // ID của linh thảo sẽ thu hoạch được
}

export const SEEDS: Record<string, Seed> = {
  hat_giong_linh_coc: {
    id: 'hat_giong_linh_coc',
    name: 'Hạt Giống Linh Cốc',
    quality: 'common',
    growthTime: 60, // 1 phút
    baseExp: 10,
    herbId: 'linh_coc'
  },
  hat_giong_huyet_tinh_thao: {
    id: 'hat_giong_huyet_tinh_thao',
    name: 'Hạt Giống Huyết Tinh Thảo',
    quality: 'spiritual',
    growthTime: 300, // 5 phút
    baseExp: 35,
    herbId: 'huyet_tinh_thao'
  }
}
