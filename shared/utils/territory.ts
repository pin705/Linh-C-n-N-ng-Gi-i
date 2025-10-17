export function processTerritoryUpdate(territory: InstanceType<typeof Territory>) {
  const now = new Date()
  const secondsPassed = Math.max(0, (now.getTime() - new Date(territory.lastUpdated).getTime()) / 1000)

  if (secondsPassed < 1 && territory.resourceCaps) return // Không cần cập nhật nếu đã có sẵn và thời gian quá ngắn

  const productions = { linhMoc: 0, hanNgoc: 0, linhCoc: 0 }
  // *** THIẾT LẬP SỨC CHỨA CƠ BẢN ***
  const capacities = { linhMoc: 1000, hanNgoc: 500, linhCoc: 1000, population: 10 }

  territory.buildings.forEach((building) => {
    const buildingConfig = BUILDINGS[building.id]
    if (!buildingConfig || building.level === 0) return

    const levelConfig = buildingConfig.levels.find(l => l.level === building.level)
    if (!levelConfig) return

    // Tính tổng sản lượng mỗi phút
    productions.linhMoc += levelConfig.effects.production_linhMoc || 0
    productions.hanNgoc += levelConfig.effects.production_hanNgoc || 0

    // *** TÍNH TỔNG SỨC CHỨA TỪ CÁC CÔNG TRÌNH ***
    capacities.linhMoc += levelConfig.effects.capacity_linhMoc || 0
    capacities.hanNgoc += levelConfig.effects.capacity_hanNgoc || 0
    capacities.linhCoc += levelConfig.effects.capacity_linhCoc || 0
    capacities.population += levelConfig.effects.capacity_population || 0
  })

  // Cộng tài nguyên vào kho tạm (uncollected)
  const currentUncollectedLinhMoc = territory.uncollectedResources.get('linhMoc') || 0
  const producedLinhMoc = (productions.linhMoc / 60) * secondsPassed
  territory.uncollectedResources.set('linhMoc', Math.min(productions.linhMoc, currentUncollectedLinhMoc + producedLinhMoc))

  const currentUncollectedHanNgoc = territory.uncollectedResources.get('hanNgoc') || 0
  const producedHanNgoc = (productions.hanNgoc / 60) * secondsPassed
  territory.uncollectedResources.set('hanNgoc', Math.min(productions.hanNgoc, currentUncollectedHanNgoc + producedHanNgoc))

  // Cập nhật sức chứa dân số
  territory.population.capacity = capacities.population

  // *** THÊM TRƯỜNG MỚI VÀO TERRITORY TRƯỚC KHI GỬI ĐI ***
  // Gán tổng sức chứa tài nguyên vào một trường mới để client sử dụng
  territory.resourceCaps = {
    linhMoc: capacities.linhMoc,
    hanNgoc: capacities.hanNgoc,
    linhCoc: capacities.linhCoc
  }

  // Xử lý hàng đợi xây dựng
  const completedUpgrades = []
  territory.upgradeQueue = territory.upgradeQueue.filter((queueItem) => {
    if (new Date(queueItem.completionTime) <= now) {
      completedUpgrades.push(queueItem)
      return false
    }
    return true
  })

  completedUpgrades.forEach((item) => {
    const building = territory.buildings.find(b => b.id === item.buildingId)
    if (building) {
      building.level = item.targetLevel
    }
  })

  territory.lastUpdated = now
}
