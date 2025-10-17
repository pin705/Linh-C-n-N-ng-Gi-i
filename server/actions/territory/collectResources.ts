// server/actions/territory/collectResources.ts
import { z } from 'zod'
// Action này không cần payload
export default async function (context: ActionContext) {
  const { character } = context

  const territory = await Territory.findOne({ characterId: character._id })
  if (!territory) throw new Error('Không tìm thấy Tiên Phủ.')

  processTerritoryUpdate(territory)

  const collectedAmounts: Partial<Record<ResourceType, number>> = {}
  let totalCollected = 0

  for (const [resource, amount] of territory.uncollectedResources.entries()) {
    const amountToCollect = Math.floor(amount)
    if (amountToCollect > 0) {
      collectedAmounts[resource as ResourceType] = amountToCollect
      territory.uncollectedResources.set(resource, amount - amountToCollect)
      totalCollected += amountToCollect
    }
  }

  if (totalCollected < 1) {
    throw new Error('Chưa có tài nguyên để thu hoạch.')
  }

  addResources(character, collectedAmounts)

  territory.lastUpdated = new Date()

  await territory.save()
  await character.save()

  return {
    success: true,
    message: `Thu hoạch thành công!`,
    territory: territory.toObject(),
    resources: Object.fromEntries(character.resources),
  }
}
