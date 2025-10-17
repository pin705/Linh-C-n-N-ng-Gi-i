// server/models/character.model.ts

import { defineMongooseModel } from '#nuxt/mongoose'
import type { Schema } from 'mongoose'
import { REALMS } from '~~/shared'

// Túi đồ giờ đây sẽ có cấu trúc chi tiết hơn
const inventoryItemSchema = {
  itemId: { type: String, required: true }, // ID của vật phẩm (hạt giống, linh thảo...)
  quantity: { type: Number, required: true },
  quality: { type: String, default: 'common' } // Phẩm chất của vật phẩm
}

export const Character = defineMongooseModel('Character', {
  userId: { type: 'ObjectId' as unknown as Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, required: true, unique: true },

  // -- THAY ĐỔI Ở ĐÂY --
  // Bỏ 'cultivation', thay bằng 'cultivationExp' để rõ nghĩa hơn
  cultivationExp: { type: Number, default: 0 }, // Tu vi kinh nghiệm
  // Cảnh giới sẽ được tính toán dựa trên tu vi
  realm: { type: String, default: REALMS[0].name },

  inventory: [inventoryItemSchema]
}, {
  timestamps: true
})
