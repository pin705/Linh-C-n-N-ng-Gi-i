import { z } from 'zod'

const payloadSchema = z.object({
  buildingId: z.string()
})

export default async function (context: ActionContext) {
  const { character, payload } = context
  const { buildingId } = payloadSchema.parse(payload)

  const territory = await Territory.findOne({ characterId: character._id })
  if (!territory) {
    throw new Error('Không tìm thấy Tiên Phủ Lãnh Địa.')
  }

  // 1. Cập nhật trạng thái Tiên Phủ (tài nguyên offline, hàng đợi) trước khi thực hiện
  processTerritoryUpdate(territory)

  const buildingConfig = BUILDINGS[buildingId]
  if (!buildingConfig) {
    throw new Error('Công trình không tồn tại trong Thiên Thư.')
  }

  const currentBuilding = territory.buildings.find(b => b.id === buildingId)
  const currentLevel = currentBuilding ? currentBuilding.level : 0
  const targetLevel = currentLevel + 1

  const levelConfig = buildingConfig.levels.find(l => l.level === targetLevel)
  if (!levelConfig) {
    throw new Error('Công trình đã đạt cấp độ tối đa.')
  }

  // 2. Kiểm tra hàng đợi xây dựng (Đã sửa lỗi)
  const mainHall = territory.buildings.find(b => b.id === 'main_hall')
  const queueSize = (mainHall && mainHall.level > 0)
    ? (BUILDINGS.main_hall.levels.find(l => l.level === mainHall.level)?.effects.build_queue_size || 1)
    : 1 // Mặc định có 1 hàng đợi khi Tiên Cung cấp 0 để nâng cấp chính nó

  if (territory.upgradeQueue.length >= queueSize) {
    throw new Error('Hàng đợi xây dựng đã đầy.')
  }
  if (territory.upgradeQueue.some(q => q.buildingId === buildingId)) {
    throw new Error('Công trình này đã có trong hàng đợi nâng cấp.')
  }

  // 3. Kiểm tra các điều kiện công trình tiên quyết
  for (const prereq of levelConfig.prerequisites) {
    const requiredBuilding = territory.buildings.find(b => b.id === prereq.buildingId)
    if (!requiredBuilding || requiredBuilding.level < prereq.level) {
      throw new Error(`Yêu cầu công trình ${BUILDINGS[prereq.buildingId].name} phải đạt cấp ${prereq.level}.`)
    }
  }

  // 4. Kiểm tra và trừ tài nguyên từ Character (Logic mới)
  const cost = levelConfig.cost
  // Pháp quyết này sẽ tự động kiểm tra và trừ tài nguyên, hoặc báo lỗi nếu không đủ
  spendResources(character, cost)

  // 5. Nếu mọi thứ hợp lệ, thêm vào hàng đợi
  const startTime = new Date()
  const completionTime = new Date(startTime.getTime() + levelConfig.buildTime * 1000)
  territory.upgradeQueue.push({
    buildingId,
    targetLevel,
    startTime,
    completionTime
  })

  // Nếu đây là lần đầu xây dựng (cấp 0 -> 1), thêm công trình vào danh sách
  if (!currentBuilding) {
    territory.buildings.push({ id: buildingId, level: 0 })
  }

  // 6. Lưu lại tất cả thay đổi
  await territory.save()
  await character.save() // Quan trọng: Lưu lại tài nguyên đã bị trừ trên character

  // Chạy lại process một lần nữa để cập nhật lastUpdated cho chính xác sau khi hành động
  processTerritoryUpdate(territory)
  await territory.save()

  // 7. Trả về kết quả thành công cho client
  return {
    success: true,
    message: `Bắt đầu nâng cấp '${buildingConfig.name}' lên cấp ${targetLevel}.`,
    territory: territory.toObject(), // Trả về territory mới nhất
    resources: Object.fromEntries(character.resources) // Trả về tài nguyên mới nhất của character
  }
}
