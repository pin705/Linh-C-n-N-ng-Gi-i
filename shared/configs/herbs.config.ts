// server/configs/herbs.config.ts

export interface Herb {
  id: string
  name: string
  description: string
}

export const HERBS: Record<string, Herb> = {
  linh_coc: {
    id: 'linh_coc',
    name: 'Linh Cốc',
    description: 'Loại ngũ cốc cơ bản chứa đựng một tia linh khí, dùng làm thức ăn.'
  },
  huyet_tinh_thao: {
    id: 'huyet_tinh_thao',
    name: 'Huyết Tinh Thảo',
    description: 'Ngọn cỏ có màu đỏ như máu, ẩn chứa linh khí huyết hệ dồi dào.'
  }
}
