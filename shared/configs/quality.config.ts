// server/configs/quality.config.ts

export type Quality = 'common' | 'spiritual' | 'mystic' | 'immortal' | 'divine' | 'primordial'

export const QUALITIES: Record<Quality, { label: string, color: string, expMultiplier: number }> = {
  common: { label: 'Phàm phẩm', color: '#999999', expMultiplier: 1 },
  spiritual: { label: 'Linh phẩm', color: '#66ccff', expMultiplier: 2.5 },
  mystic: { label: 'Huyền phẩm', color: '#9966ff', expMultiplier: 5 },
  immortal: { label: 'Tiên phẩm', color: '#ffd700', expMultiplier: 12 },
  divine: { label: 'Thần phẩm', color: '#ff4444', expMultiplier: 30 },
  primordial: { label: 'Hồng mông', color: '#ff66ff', expMultiplier: 100 }
}
