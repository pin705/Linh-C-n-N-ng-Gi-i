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
      { level: 1, cost: { linhMoc: 150 }, buildTime: 30, prerequisites: [], effects: { build_queue_size: 1, construction_speed: 1 }, description: 'Mở khóa 1 hàng đợi xây dựng.' },
      { level: 2, cost: { linhMoc: 400, hanNgoc: 100 }, buildTime: 180, prerequisites: [], effects: { build_queue_size: 1, construction_speed: 1.1 }, description: 'Tăng tốc xây dựng 10%.' },
      { level: 3, cost: { linhMoc: 1000, hanNgoc: 350 }, buildTime: 600, prerequisites: [], effects: { build_queue_size: 1, construction_speed: 1.2 }, description: 'Tăng tốc xây dựng 20%.' },
      { level: 4, cost: { linhMoc: 2500, hanNgoc: 900 }, buildTime: 1800, prerequisites: [], effects: { build_queue_size: 2, construction_speed: 1.3 }, description: 'Mở khóa hàng đợi xây dựng thứ 2.' },
      { level: 5, cost: { linhMoc: 6000, hanNgoc: 2200 }, buildTime: 5400, prerequisites: [], effects: { build_queue_size: 2, construction_speed: 1.4 }, description: 'Tăng tốc xây dựng 40%.' },
    ]
  },
  wood_yard: {
    id: 'wood_yard', name: 'Linh Mộc Viên', type: 'resource',
    baseDescription: 'Trồng các loại Linh Mộc, tự động sản sinh Linh Mộc theo thời gian.',
    levels: [
      { level: 1, cost: { linhMoc: 50 }, buildTime: 20, prerequisites: [], effects: { production_linhMoc: 60, maxOfflineHours: 8 }, description: 'Sản lượng 60/phút. Tích lũy tối đa 8 giờ.' },
      { level: 2, cost: { linhMoc: 120 }, buildTime: 45, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { production_linhMoc: 108, maxOfflineHours: 8 }, description: 'Sản lượng 108/phút. Tích lũy tối đa 8 giờ.' },
      { level: 3, cost: { linhMoc: 280, hanNgoc: 50 }, buildTime: 120, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { production_linhMoc: 180, maxOfflineHours: 8 }, description: 'Sản lượng 180/phút. Tích lũy tối đa 8 giờ.' },
      { level: 4, cost: { linhMoc: 650, hanNgoc: 150 }, buildTime: 300, prerequisites: [{ buildingId: 'main_hall', level: 3 }], effects: { production_linhMoc: 290, maxOfflineHours: 8 }, description: 'Sản lượng 290/phút. Tích lũy tối đa 8 giờ.' },
      { level: 5, cost: { linhMoc: 1500, hanNgoc: 400 }, buildTime: 900, prerequisites: [{ buildingId: 'main_hall', level: 4 }], effects: { production_linhMoc: 450, maxOfflineHours: 8 }, description: 'Sản lượng 450/phút. Tích lũy tối đa 8 giờ.' },
    ]
  },
  stone_mine: {
    id: 'stone_mine', name: 'Hàn Ngọc Mạch', type: 'resource',
    baseDescription: 'Khai thác các mỏ Hàn Ngọc từ linh mạch dưới lòng đất.',
    levels: [
      { level: 1, cost: { linhMoc: 80 }, buildTime: 30, prerequisites: [], effects: { production_hanNgoc: 40, maxOfflineHours: 8 }, description: 'Sản lượng 40/phút. Tích lũy tối đa 8 giờ.' },
      { level: 2, cost: { linhMoc: 200 }, buildTime: 60, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { production_hanNgoc: 75, maxOfflineHours: 8 }, description: 'Sản lượng 75/phút. Tích lũy tối đa 8 giờ.' },
      { level: 3, cost: { linhMoc: 500, hanNgoc: 100 }, buildTime: 150, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { production_hanNgoc: 130, maxOfflineHours: 8 }, description: 'Sản lượng 130/phút. Tích lũy tối đa 8 giờ.' },
      { level: 4, cost: { linhMoc: 1200, hanNgoc: 300 }, buildTime: 400, prerequisites: [{ buildingId: 'main_hall', level: 3 }], effects: { production_hanNgoc: 220, maxOfflineHours: 8 }, description: 'Sản lượng 220/phút. Tích lũy tối đa 8 giờ.' },
      { level: 5, cost: { linhMoc: 2800, hanNgoc: 800 }, buildTime: 1200, prerequisites: [{ buildingId: 'main_hall', level: 4 }], effects: { production_hanNgoc: 360, maxOfflineHours: 8 }, description: 'Sản lượng 360/phút. Tích lũy tối đa 8 giờ.' },
    ]
  },
  alchemy_lab: {
    id: 'alchemy_lab', name: 'Luyện Đan Các', type: 'support',
    baseDescription: 'Nơi các đan sư luyện chế linh đan, dược dịch. Nâng cấp để mở khóa các loại đan dược cao cấp hơn.',
    levels: [
      { level: 1, cost: { linhMoc: 500, hanNgoc: 200 }, buildTime: 300, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { alchemy_level: 1 }, description: 'Cho phép luyện chế đan dược Phàm phẩm.' },
      { level: 2, cost: { linhMoc: 1200, hanNgoc: 500 }, buildTime: 900, prerequisites: [{ buildingId: 'main_hall', level: 3 }], effects: { alchemy_level: 2 }, description: 'Mở khóa công thức đan dược Linh phẩm.' },
    ]
  },
  research_pavilion: {
    id: 'research_pavilion', name: 'Tàng Kinh Các', type: 'support',
    baseDescription: 'Nơi nghiên cứu các loại công pháp, trận đồ. Nâng cấp để tăng tốc độ nghiên cứu và mở khóa các kỹ thuật mới.',
    levels: [
      { level: 1, cost: { linhMoc: 800, hanNgoc: 300 }, buildTime: 450, prerequisites: [{ buildingId: 'main_hall', level: 3 }], effects: { research_speed: 1 }, description: 'Mở khóa tính năng nghiên cứu cơ bản.' },
    ]
  },
  storage: {
    id: 'storage', name: 'Tàng Bảo Các', type: 'resource',
    baseDescription: 'Kho chứa, tăng giới hạn lưu trữ các loại tài nguyên.',
    levels: [
      { level: 1, cost: { linhMoc: 100 }, buildTime: 30, prerequisites: [], effects: { capacity_linhMoc: 5000, capacity_hanNgoc: 2000, capacity_linhCoc: 2000 }, description: 'Sức chứa: 5k Mộc, 2k Ngọc, 2k Cốc.' },
      { level: 2, cost: { linhMoc: 300, hanNgoc: 100 }, buildTime: 90, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { capacity_linhMoc: 12000, capacity_hanNgoc: 5000, capacity_linhCoc: 5000 }, description: 'Sức chứa: 12k Mộc, 5k Ngọc, 5k Cốc.' },
      { level: 3, cost: { linhMoc: 800, hanNgoc: 350 }, buildTime: 240, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { capacity_linhMoc: 30000, capacity_hanNgoc: 15000, capacity_linhCoc: 15000 }, description: 'Sức chứa được mở rộng đáng kể.' },
    ]
  },
  population_house: {
    id: 'population_house', name: 'Tụ Linh Các', type: 'support',
    baseDescription: 'Nơi ở cho Thị Nhân, tăng giới hạn dân số tối đa để làm việc.',
    levels: [
      { level: 1, cost: { linhMoc: 150, linhCoc: 100 }, buildTime: 40, prerequisites: [], effects: { capacity_population: 20 }, description: 'Sức chứa 20 Thị Nhân.' },
      { level: 2, cost: { linhMoc: 400, linhCoc: 250 }, buildTime: 120, prerequisites: [{ buildingId: 'main_hall', level: 1 }], effects: { capacity_population: 50 }, description: 'Sức chứa 50 Thị Nhân.' },
    ]
  },
  barracks: {
    id: 'barracks', name: 'Diễn Võ Trường', type: 'military',
    baseDescription: 'Nơi huấn luyện Đạo Binh cơ bản, dùng để chiến đấu và bảo vệ Tiên Phủ.',
    levels: [
      { level: 1, cost: { linhMoc: 200, hanNgoc: 50 }, buildTime: 120, prerequisites: [{ buildingId: 'main_hall', level: 2 }], effects: { recruit_speed: 1.0 }, description: 'Mở khóa huấn luyện Kiếm Vệ.' },
      { level: 2, cost: { linhMoc: 600, hanNgoc: 200 }, buildTime: 360, prerequisites: [{ buildingId: 'main_hall', level: 3 }], effects: { recruit_speed: 1.1 }, description: 'Tăng tốc độ huấn luyện 10%.' },
    ]
  }
};

// Định nghĩa cấu trúc cho mỗi lời chú giải
export interface EffectDisplay {
  name: string // Tên hiệu ứng chuẩn tu tiên
  unit: string // Đơn vị (ví dụ: /phút, %, điểm...)
  isPercentage: boolean // Dùng để xác định cách hiển thị (ví dụ: 1.1 sẽ hiển thị là +10%)
}

// "Thiên Thư" chứa đựng mọi lời chú giải
export const EFFECT_NAMES: Record<string, EffectDisplay> = {
  // --- Công năng Cốt Lõi ---
  build_queue_size: { name: 'Hàng đợi xây dựng', unit: ' ô', isPercentage: false },
  construction_speed: { name: 'Tốc độ xây dựng', unit: '%', isPercentage: true },

  // --- Công năng Sản Xuất Tài Nguyên ---
  production_linhMoc: { name: 'Sản lượng Linh Mộc', unit: '/phút', isPercentage: false },
  production_hanNgoc: { name: 'Sản lượng Hàn Ngọc', unit: '/phút', isPercentage: false },

  // --- Công năng Tàng Trữ ---
  capacity_linhMoc: { name: 'Kho chứa Linh Mộc', unit: ' điểm', isPercentage: false },
  capacity_hanNgoc: { name: 'Kho chứa Hàn Ngọc', unit: ' điểm', isPercentage: false },
  capacity_linhCoc: { name: 'Kho chứa Linh Cốc', unit: ' điểm', isPercentage: false },

  // --- Công năng Phụ Trợ ---
  capacity_population: { name: 'Dung nạp Thị Nhân', unit: ' người', isPercentage: false },

  // --- Công năng Quân Sự ---
  recruit_speed: { name: 'Tốc độ chiêu mộ', unit: '%', isPercentage: true }
}

export function formatBuildingEffect(key: string, value: number): string {
  const effectConfig = EFFECT_NAMES[key]

  // Nếu chưa có chú giải, hiển thị theo cách cũ để không bị lỗi
  if (!effectConfig) {
    return `${key.replace(/_/g, ' ')}: ${value.toLocaleString()}`
  }

  // Xử lý các giá trị dạng % (ví dụ: 1.1 -> +10%)
  if (effectConfig.isPercentage) {
    const displayValue = Math.round((value - 1) * 100)
    // Hiển thị dấu + cho các giá trị dương
    const sign = displayValue >= 0 ? '+' : ''
    return `${effectConfig.name}: ${sign}${displayValue}${effectConfig.unit}`
  }

  // Xử lý các giá trị số thông thường
  return `${effectConfig.name}: ${value.toLocaleString()}${effectConfig.unit}`
}
