// server/actions/territory/upgradeBuilding.ts
import { z } from 'zod'
import { Territory } from '~~/server/models/territory.model'
import { BUILDINGS } from '~~/shared'

const payloadSchema = z.object({
  buildingId: z.string()
})

export default async function (context: ActionContext) {
  const { character, payload } = context
  const { buildingId } = payloadSchema.parse(payload)

  const territory = await Territory.findOne({ characterId: character._id })
  if (!territory) throw new Error('Không tìm thấy Tiên Phủ Lãnh Địa.')

  // Cập nhật tài nguyên và hàng đợi trước khi thực hiện
  processTerritoryUpdate(territory)

  const buildingConfig = BUILDINGS[buildingId]
  if (!buildingConfig) throw new Error('Công trình không tồn tại.')

  const currentBuilding = territory.buildings.find(b => b.id === buildingId)
  const currentLevel = currentBuilding ? currentBuilding.level : 0
  const targetLevel = currentLevel + 1

  const levelConfig = buildingConfig.levels.find(l => l.level === targetLevel)
  if (!levelConfig) throw new Error('Đã đạt cấp độ tối đa.')

  // 1. Kiểm tra hàng đợi xây dựng
  const mainHall = territory.buildings.find(b => b.id === 'main_hall')
  const queueSize = mainHall && mainHall.level > 0 ? BUILDINGS.main_hall.levels[mainHall.level - 1].effects.build_queue_size || 1 : 0
  if (territory.upgradeQueue.length >= queueSize) {
    throw new Error('Hàng đợi xây dựng đã đầy.')
  }
  if (territory.upgradeQueue.some(q => q.buildingId === buildingId)) {
    throw new Error('Công trình này đã có trong hàng đợi.')
  }

  // 2. Kiểm tra điều kiện công trình khác
  for (const prereq of levelConfig.prerequisites) {
    const requiredBuilding = territory.buildings.find(b => b.id === prereq.buildingId)
    if (!requiredBuilding || requiredBuilding.level < prereq.level) {
      throw new Error(`Yêu cầu ${BUILDINGS[prereq.buildingId].name} cấp ${prereq.level}.`)
    }
  }

  // 3. Kiểm tra tài nguyên
  for (const [resource, amount] of Object.entries(levelConfig.cost)) {
    if (territory.resources[resource] < amount) {
      throw new Error(`Không đủ ${resource}.`)
    }
  }

  // 4. Trừ tài nguyên và thêm vào hàng đợi
  for (const [resource, amount] of Object.entries(levelConfig.cost)) {
    territory.resources[resource] -= amount
  }

  const startTime = new Date()
  const completionTime = new Date(startTime.getTime() + levelConfig.buildTime * 1000)
  territory.upgradeQueue.push({
    buildingId,
    targetLevel,
    startTime,
    completionTime
  })

  // Nếu công trình chưa tồn tại (level 0), thêm nó vào danh sách
  if (!currentBuilding) {
    territory.buildings.push({ id: buildingId, level: 0 })
  }

  await territory.save()

  return {
    success: true,
    message: `Bắt đầu xây dựng '${buildingConfig.name}' cấp ${targetLevel}.`,
    territory
  }
}
