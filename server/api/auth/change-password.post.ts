// server/api/auth/change-password.post.ts
import { z } from 'zod'
import { User } from '~~/server/models/User'

const bodySchema = z.object({
  email: z.string().email(),
  oldPassword: z.string().min(6),
  newPassword: z.string().min(6),
})

export default defineEventHandler(async (event) => {
  const { email, oldPassword, newPassword } = await readBody(
    event,
  )

  const user = await User.findOne({ email })
  if (!user) {
    throw createError({
      statusCode: 404,
      message: 'Không tìm thấy người dùng.',
    })
  }

  const isMatch = await verifyPassword(user.password, oldPassword)
  if (!isMatch) {
    throw createError({ statusCode: 401, message: 'Mật khẩu cũ không đúng.' })
  }

  user.password = await hashPassword(newPassword)
  await user.save()

  return { success: true, message: 'Đổi mật khẩu thành công.' }
})
