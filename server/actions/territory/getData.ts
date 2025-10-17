// server/actions/territory/getData.ts
import { Territory } from '~~/server/models/territory.model'

// Action này không cần payload
export default async function (context: ActionContext) {
  const { character } = context

  const territory = await Territory.findOne({ characterId: character._id })
  if (!territory) {
    throw new Error('Không tìm thấy Tiên Phủ Lãnh Địa.')
  }

  // Luôn xử lý tài nguyên và hàng đợi trước khi gửi dữ liệu
  processTerritoryUpdate(territory)
  await territory.save()

  // Trả về dữ liệu đã được cập nhật
  return territory.toObject()
}
