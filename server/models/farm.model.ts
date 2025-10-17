// server/models/farm.model.ts

import { defineMongooseModel } from '#nuxt/mongoose'
import type { Schema } from 'mongoose'

// Định nghĩa cấu trúc cho một ô đất
const plotSchema = {
  plotId: { type: Number, required: true },
  status: { type: String, enum: ['empty', 'growing', 'ready'], default: 'empty' },
  seedId: { type: String, default: null }, // ID của hạt giống đã gieo
  plantedAt: { type: Date, default: null }, // Thời điểm gieo trồng
}

export const Farm = defineMongooseModel('Farm', {
  // Liên kết với model Character
  characterId: { type: 'ObjectId' as unknown as Schema.Types.ObjectId, ref: 'Character', required: true, unique: true },

  // Mảng các ô đất
  plots: {
    type: [plotSchema],
    // Mặc định tạo cho người chơi 4 ô đất trống khi khởi tạo
    default: () => Array.from({ length: 4 }, (_, i) => ({ plotId: i + 1, status: 'empty' }))
  }
}, {
  timestamps: true,
})
