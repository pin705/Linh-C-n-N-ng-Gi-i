// server/models/territory.model.ts
import { defineMongooseModel } from '#nuxt/mongoose'
import type { Schema } from 'mongoose'

const buildingSchema = {
  id: { type: String, required: true },
  level: { type: Number, default: 0 }
}

const upgradeQueueItemSchema = {
  buildingId: { type: String, required: true },
  targetLevel: { type: Number, required: true },
  startTime: { type: Date, required: true },
  completionTime: { type: Date, required: true },
}

export const Territory = defineMongooseModel('Territory', {
  characterId: { type: 'ObjectId' as unknown as Schema.Types.ObjectId, ref: 'Character', required: true, unique: true },

  buildings: {
    type: [buildingSchema],
    default: [{ id: 'main_hall', level: 0 }]
  },

  uncollectedResources: {
    type: Map,
    of: Number,
    default: {}
  },

  population: {
    current: { type: Number, default: 10 },
    capacity: { type: Number, default: 10 }
  },

  resourceCaps: {
    linhMoc: { type: Number, default: 1000 },
    hanNgoc: { type: Number, default: 500 },
    linhCoc: { type: Number, default: 1000 }
  },

  upgradeQueue: { type: [upgradeQueueItemSchema], default: [] },
  lastUpdated: { type: Date, default: () => new Date() }
}, {
  timestamps: true
})
