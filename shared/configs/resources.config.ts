// server/configs/resources.config.ts

export interface Resource {
  id: string
  name: string
  icon: string
}

// Thêm các loại tài nguyên mới ở đây
export const RESOURCES: Record<string, Resource> = {
  linhMoc: { id: 'linhMoc', name: 'Linh Mộc', icon: '🪵', symbol: '木', color: '#86efac' },
  hanNgoc: { id: 'hanNgoc', name: 'Hàn Ngọc', icon: '💎', symbol: '玉', color: '#7dd3fc' },
  linhCoc: { id: 'linhCoc', name: 'Linh Cốc', icon: '🌾', symbol: '穀', color: '#fde047' }
  // Ví dụ tài nguyên sau này:
  // tienNgoc: { id: 'tienNgoc', name: 'Tiên Ngọc', icon: '✨' },
}
