// server/actions/farm/plantSeed.ts
import { z } from 'zod'

// Định nghĩa payload mà action này cần
const payloadSchema = z.object({
  plotId: z.number(),
  seedId: z.string()
})

// Mỗi handler là một hàm async nhận context và trả về kết quả
export default async function (context: ActionContext) {
  const { character, payload } = context
  const { plotId, seedId } = payloadSchema.parse(payload)

  // 1. Kiểm tra xem người chơi có hạt giống không
  const seedInInventory = character.inventory.find(item => item.itemId === seedId && item.quantity > 0)
  if (!seedInInventory) {
    throw new Error(`Không có hạt giống '${seedId}' trong túi đồ.`)
  }

  // 2. Lấy thông tin nông trại
  const farm = await Farm.findOne({ characterId: character._id })
  if (!farm) throw new Error('Không tìm thấy linh điền.')

  // 3. Tìm ô đất
  const plot = farm.plots.find(p => p.plotId === plotId)
  if (!plot) throw new Error('Ô đất không tồn tại.')
  if (plot.status !== 'empty') throw new Error('Ô đất này đã được gieo trồng.')

  // 4. Thực hiện hành động
  // Trừ hạt giống
  seedInInventory.quantity -= 1
  // Nếu hết, xóa khỏi túi đồ
  if (seedInInventory.quantity === 0) {
    character.inventory = character.inventory.filter(item => item.itemId !== seedId)
  }

  // Cập nhật trạng thái ô đất
  plot.status = 'growing'
  plot.seedId = seedId
  plot.plantedAt = new Date()

  await farm.save()

  // 5. Trả về kết quả cho client
  return {
    success: true,
    message: `Gieo trồng '${seedId}' tại ô đất số ${plotId} thành công!`,
    // Có thể trả về dữ liệu mới để client cập nhật
    farm,
    inventory: character.inventory
  }
}
