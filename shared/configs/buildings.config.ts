// server/configs/buildings.config.ts

export type ResourceType = 'linhMoc' | 'hanNgoc' | 'linhCoc'
export type BuildingType = 'core' | 'resource' | 'support' | 'military'

export interface BuildingLevel {
  level: number
  cost: Partial<Record<ResourceType, number>>
  buildTime: number // seconds
  prerequisites: { buildingId: string, level: number }[]
  effects: Partial<Record<string, number>>
  description: string
}

export interface Building {
  id: string
  name: string
  type: BuildingType
  baseDescription: string
  levels: BuildingLevel[]
}

export const BUILDINGS: Record<string, Building> = {
  main_hall: {
    id: 'main_hall', name: 'Tử Phủ Tiên Cung', type: 'core',
    baseDescription: 'Trung tâm của Tiên Phủ, cấp độ của nó giới hạn cấp độ các công trình khác và tốc độ xây dựng.',
    levels: [
      { level: 1, cost: { linhMoc: 200 }, buildTime: 60, prerequisites: [], effects: { build_queue_size: 1, construction_speed: 1 }, description: 'Mở khóa hàng đợi xây dựng.' },
      { level: 2, cost: { linhMoc: 500, hanNgoc: 100 }, buildTime: 180, prerequisites: [], effects: { build_queue_size: 1, construction_speed: 1.1 }, description: 'Tăng tốc độ xây dựng 10%.' }
    ]
  },
  wood_yard: {
    id: 'wood_yard', name: 'Linh Mộc Viên', type: 'resource',
    baseDescription: 'Trồng các loại Linh Mộc, tự động sản sinh Linh Mộc theo thời gian.',
    levels: [
      { level: 1, cost: { linhMoc: 50 }, buildTime: 20, prerequisites: [], effects: { production_linhMoc: 100 }, description: 'Sản lượng 100 Linh Mộc/giờ.' },
      { level: 2, cost: { linhMoc: 120 }, buildTime: 45, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { production_linhMoc: 180 }, description: 'Sản lượng 180 Linh Mộc/giờ.' }
    ]
  },
  stone_mine: {
    id: 'stone_mine', name: 'Hàn Ngọc Mạch', type: 'resource',
    baseDescription: 'Khai thác các mỏ Hàn Ngọc từ linh mạch dưới lòng đất.',
    levels: [
      { level: 1, cost: { linhMoc: 80 }, buildTime: 30, prerequisites: [], effects: { production_hanNgoc: 80 }, description: 'Sản lượng 80 Hàn Ngọc/giờ.' },
      { level: 2, cost: { linhMoc: 200 }, buildTime: 60, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { production_hanNgoc: 150 }, description: 'Sản lượng 150 Hàn Ngọc/giờ.' }
    ]
  },
  storage: {
    id: 'storage', name: 'Tàng Bảo Các', type: 'resource',
    baseDescription: 'Kho chứa, tăng giới hạn lưu trữ các loại tài nguyên.',
    levels: [
      { level: 1, cost: { linhMoc: 100 }, buildTime: 30, prerequisites: [], effects: { capacity_linhMoc: 5000, capacity_hanNgoc: 5000, capacity_linhCoc: 2000 }, description: 'Tăng sức chứa cơ bản.' }
    ]
  },
  population_house: {
    id: 'population_house', name: 'Tụ Linh Các', type: 'support',
    baseDescription: 'Nơi ở cho Thị Nhân, tăng giới hạn dân số tối đa để làm việc.',
    levels: [
      { level: 1, cost: { linhMoc: 150, linhCoc: 100 }, buildTime: 40, prerequisites: [], effects: { capacity_population: 20 }, description: 'Sức chứa 20 Thị Nhân.' }
    ]
  },
  barracks: {
    id: 'barracks', name: 'Diễn Võ Trường', type: 'military',
    baseDescription: 'Nơi huấn luyện Đạo Binh cơ bản, dùng để chiến đấu và bảo vệ Tiên Phủ.',
    levels: [
      { level: 1, cost: { linhMoc: 200, hanNgoc: 50 }, buildTime: 120, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { recruit_speed: 1.0 }, description: 'Mở khóa huấn luyện Kiếm Vệ.' }
    ]
  }
}
