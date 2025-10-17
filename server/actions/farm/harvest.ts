// server/actions/farm/harvest.ts
import { z } from 'zod'
import { Farm } from '~~/server/models/farm.model'
import { QUALITIES, REALMS, SEEDS } from '~~/shared'

const payloadSchema = z.object({
  plotId: z.number()
})

export default async function (context: ActionContext) {
  const { character, payload } = context
  const { plotId } = payloadSchema.parse(payload)

  // 1. Lấy thông tin nông trại và ô đất
  const farm = await Farm.findOne({ characterId: character._id })
  if (!farm) throw new Error('Không tìm thấy linh điền.')

  const plot = farm.plots.find(p => p.plotId === plotId)
  if (!plot || plot.status !== 'growing' || !plot.seedId) {
    throw new Error('Ô đất không hợp lệ hoặc chưa có gì để thu hoạch.')
  }

  // 2. Kiểm tra xem cây đã lớn chưa
  const seedInfo = SEEDS[plot.seedId]
  if (!seedInfo) throw new Error('Dữ liệu hạt giống không tồn tại.')

  const growthTimeMs = seedInfo.growthTime * 1000
  const timePlanted = new Date(plot.plantedAt!).getTime()
  if (Date.now() < timePlanted + growthTimeMs) {
    throw new Error('Linh dược chưa trưởng thành!')
  }

  // 3. Tính toán phần thưởng
  const qualityInfo = QUALITIES[seedInfo.quality]
  const expGained = Math.floor(seedInfo.baseExp * qualityInfo.expMultiplier)

  // 4. Thực hiện hành động
  // Cộng tu vi cho nhân vật
  character.cultivationExp += expGained

  // Cập nhật cảnh giới nếu đủ tu vi
  const currentRealm = REALMS.find(r => r.name === character.realm) || REALMS[0]
  const nextRealm = REALMS.find(r => r.expRequired > currentRealm.expRequired && character.cultivationExp >= r.expRequired)
  if (nextRealm) {
    character.realm = nextRealm.name
  }

  // Thêm linh thảo vào túi đồ
  const herbId = seedInfo.herbId
  const existingHerb = character.inventory.find(item => item.itemId === herbId && item.quality === seedInfo.quality)
  if (existingHerb) {
    existingHerb.quantity += 1
  } else {
    character.inventory.push({
      itemId: herbId,
      quantity: 1,
      quality: seedInfo.quality
    })
  }

  // Reset ô đất
  plot.status = 'empty'
  plot.seedId = null
  plot.plantedAt = null
  await farm.save()

  // 5. Trả về kết quả
  let realmUpMessage = ''
  if (nextRealm) {
    realmUpMessage = `Linh khí quán thể, đạo hữu đã đột phá đến 【${nextRealm.name}】!`
  }

  return {
    success: true,
    message: `Thu hoạch '${seedInfo.name}' thành công, nhận được ${expGained} tu vi! ${realmUpMessage}`,
    farm,
    inventory: character.inventory,
    cultivationExp: character.cultivationExp,
    realm: character.realm
  }
}
