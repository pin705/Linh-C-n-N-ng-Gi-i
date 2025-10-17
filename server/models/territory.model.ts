// server/models/territory.model.ts
import { defineMongooseModel } from '#nuxt/mongoose'
import type { Schema } from 'mongoose'

// Cấu trúc cho một công trình trong Tiên Phủ
const buildingSchema = {
  id: { type: String, required: true }, // 'main_hall', 'wood_yard', etc.
  level: { type: Number, default: 0 }
}

// Cấu trúc cho một hàng đợi nâng cấp/xây dựng
const upgradeQueueItemSchema = {
  buildingId: { type: String, required: true },
  targetLevel: { type: Number, required: true },
  startTime: { type: Date, required: true },
  completionTime: { type: Date, required: true }
}

export const Territory = defineMongooseModel('Territory', {
  characterId: { type: 'ObjectId' as unknown as Schema.Types.ObjectId, ref: 'Character', required: true, unique: true },

  // Danh sách các công trình người chơi đã xây
  buildings: { type: [buildingSchema], default: [] },

  // Tài nguyên hiện có
  resources: {
    linhMoc: { type: Number, default: 500 },
    hanNgoc: { type: Number, default: 500 },
    linhCoc: { type: Number, default: 200 }
  },

  // Dân số
  population: {
    current: { type: Number, default: 10 },
    capacity: { type: Number, default: 10 } // Sẽ tăng khi nâng cấp nhà dân
  },

  // Hàng đợi xây dựng (ban đầu chỉ có 1 slot)
  upgradeQueue: { type: [upgradeQueueItemSchema], default: [] },

  // Dùng để tính toán tài nguyên offline
  lastUpdated: { type: Date, default: () => new Date() }
}, {
  timestamps: true
})
