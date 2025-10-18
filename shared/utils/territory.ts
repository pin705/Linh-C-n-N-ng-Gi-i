export function processTerritoryUpdate(territory: InstanceType<typeof Territory>) {
  const now = new Date()
  const secondsPassed = Math.max(0, (now.getTime() - new Date(territory.lastUpdated).getTime()) / 1000)

  if (secondsPassed < 1 && territory.resourceCaps) return

  const capacities = { linhMoc: 1000, hanNgoc: 500, linhCoc: 1000, population: 10 }

  territory.buildings.forEach((building) => {
    const buildingConfig = BUILDINGS[building.id]
    if (!buildingConfig || building.level === 0) return

    const levelConfig = buildingConfig.levels.find(l => l.level === building.level)
    if (!levelConfig) return

    // --- LOGIC CỘNG DỒN TÀI NGUYÊN MỚI ---
    Object.keys(levelConfig.effects).forEach((effectKey) => {
      if (effectKey.startsWith('production_')) {
        const resourceId = effectKey.replace('production_', '')
        const ratePerMinute = levelConfig.effects[effectKey] || 0
        const maxOfflineHours = levelConfig.effects.maxOfflineHours || 8
        const maxAccumulationAmount = ratePerMinute * 60 * maxOfflineHours

        const producedAmount = (ratePerMinute / 60) * secondsPassed
        const currentUncollected = territory.uncollectedResources.get(resourceId) || 0

        territory.uncollectedResources.set(resourceId, Math.min(maxAccumulationAmount, currentUncollected + producedAmount))
      }
    })

    // Tính tổng sức chứa kho
    capacities.linhMoc += levelConfig.effects.capacity_linhMoc || 0
    capacities.hanNgoc += levelConfig.effects.capacity_hanNgoc || 0
    capacities.linhCoc += levelConfig.effects.capacity_linhCoc || 0
    capacities.population += levelConfig.effects.capacity_population || 0
  })

  territory.population.capacity = capacities.population
  territory.resourceCaps = {
    linhMoc: capacities.linhMoc,
    hanNgoc: capacities.hanNgoc,
    linhCoc: capacities.linhCoc
  }

  // Xử lý hàng đợi xây dựng
  const completedUpgrades: any[] = []
  territory.upgradeQueue = territory.upgradeQueue.filter((queueItem) => {
    if (new Date(queueItem.completionTime) <= now) {
      completedUpgrades.push(queueItem)
      return false
    }
    return true
  })
  completedUpgrades.forEach((item) => {
    const building = territory.buildings.find(b => b.id === item.buildingId)
    if (building) { building.level = item.targetLevel }
  })

  if (completedUpgrades.length > 0) {
    territory.lastUpdated = now
  }
}
