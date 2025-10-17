export function processTerritoryUpdate(territory: InstanceType<typeof Territory>) {
  const now = new Date()
  const secondsPassed = Math.max(0, (now.getTime() - new Date(territory.lastUpdated).getTime()) / 1000)

  if (secondsPassed < 1) return

  const productions = { linhMoc: 0, hanNgoc: 0, linhCoc: 0 }
  const capacities = { linhMoc: 1000, hanNgoc: 1000, linhCoc: 500, population: 10 }

  territory.buildings.forEach((building) => {
    const buildingConfig = BUILDINGS[building.id]
    if (!buildingConfig || building.level === 0) return

    const levelConfig = buildingConfig.levels.find(l => l.level === building.level)
    if (!levelConfig) return

    productions.linhMoc += levelConfig.effects.production_linhMoc || 0
    productions.hanNgoc += levelConfig.effects.production_hanNgoc || 0

    capacities.linhMoc += levelConfig.effects.capacity_linhMoc || 0
    capacities.hanNgoc += levelConfig.effects.capacity_hanNgoc || 0
    capacities.linhCoc += levelConfig.effects.capacity_linhCoc || 0
    capacities.population += levelConfig.effects.capacity_population || 0
  })

  const currentUncollectedLinhMoc = territory.uncollectedResources.get('linhMoc') || 0
  const producedLinhMoc = (productions.linhMoc / 60) * secondsPassed
  territory.uncollectedResources.set('linhMoc', Math.min(productions.linhMoc, currentUncollectedLinhMoc + producedLinhMoc))

  const currentUncollectedHanNgoc = territory.uncollectedResources.get('hanNgoc') || 0
  const producedHanNgoc = (productions.hanNgoc / 60) * secondsPassed
  territory.uncollectedResources.set('hanNgoc', Math.min(productions.hanNgoc, currentUncollectedHanNgoc + producedHanNgoc))

  territory.population.capacity = capacities.population

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
