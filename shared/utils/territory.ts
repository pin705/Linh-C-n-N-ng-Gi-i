// server/utils/territory.ts
import type { Territory } from '~~/server/models/territory.model'
import { BUILDINGS } from '..'

// Hàm này sẽ là trái tim của việc cập nhật tài nguyên
export function processTerritoryUpdate(territory: InstanceType<typeof Territory>) {
  const now = new Date()
  const secondsPassed = Math.max(0, (now.getTime() - new Date(territory.lastUpdated).getTime()) / 1000)

  if (secondsPassed < 1) return // Không cần cập nhật nếu thời gian quá ngắn

  const productions = { linhMoc: 0, hanNgoc: 0, linhCoc: 0 }
  const capacities = { linhMoc: 1000, hanNgoc: 1000, linhCoc: 500, population: 10 } // Sức chứa cơ bản

  territory.buildings.forEach((building) => {
    const buildingConfig = BUILDINGS[building.id]
    if (!buildingConfig || building.level === 0) return

    const levelConfig = buildingConfig.levels.find(l => l.level === building.level)
    if (!levelConfig) return

    // Tính tổng sản lượng mỗi giờ
    productions.linhMoc += levelConfig.effects.production_linhMoc || 0
    productions.hanNgoc += levelConfig.effects.production_hanNgoc || 0

    // Tính tổng sức chứa
    capacities.linhMoc += levelConfig.effects.capacity_linhMoc || 0
    capacities.hanNgoc += levelConfig.effects.capacity_hanNgoc || 0
    capacities.linhCoc += levelConfig.effects.capacity_linhCoc || 0
    capacities.population += levelConfig.effects.capacity_population || 0
  })

  // Cộng tài nguyên được sản xuất, đảm bảo không vượt quá sức chứa
  territory.resources.linhMoc = Math.min(
    capacities.linhMoc,
    territory.resources.linhMoc + (productions.linhMoc / 3600) * secondsPassed
  )
  territory.resources.hanNgoc = Math.min(
    capacities.hanNgoc,
    territory.resources.hanNgoc + (productions.hanNgoc / 3600) * secondsPassed
  )

  // Cập nhật sức chứa dân số
  territory.population.capacity = capacities.population

  // Xử lý hàng đợi xây dựng
  const completedUpgrades = []
  territory.upgradeQueue = territory.upgradeQueue.filter((queueItem) => {
    if (new Date(queueItem.completionTime) <= now) {
      completedUpgrades.push(queueItem)
      return false // Xóa khỏi hàng đợi
    }
    return true
  })

  // Cập nhật cấp độ cho các công trình đã hoàn thành
  completedUpgrades.forEach((item) => {
    const building = territory.buildings.find(b => b.id === item.buildingId)
    if (building) {
      building.level = item.targetLevel
    }
  })

  territory.lastUpdated = now
}
