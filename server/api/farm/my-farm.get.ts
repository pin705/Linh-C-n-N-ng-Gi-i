import { Farm } from '~~/server/models/farm.model'
import { Character } from '~~/server/models/character.model'

export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user?.userId) {
    return createError({ statusCode: 401, statusMessage: 'Chưa đăng nhập' })
  }

  const character = await Character.findOne({ userId: session.user.userId }, '_id').lean()
  if (!character) {
    return createError({ statusCode: 404, statusMessage: 'Không tìm thấy nhân vật' })
  }

  const farm = await Farm.findOne({ characterId: character._id }).lean()
  if (!farm) {
    return createError({ statusCode: 404, statusMessage: 'Không tìm thấy linh điền' })
  }

  return farm
})
