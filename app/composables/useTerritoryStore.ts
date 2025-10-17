// composables/useTerritoryStore.ts
import { useState, readonly } from '#imports'

// Có thể tạo file type riêng cho Territory sau
export const useTerritoryStore = () => {
  const territoryState = useState<any | null>('territory-state', () => null)

  const setTerritory = (newTerritoryData: any | null) => {
    territoryState.value = newTerritoryData
  }

  const fetchTerritory = async () => {
    if (territoryState.value) return // Không fetch lại nếu đã có

    const { performAction } = useGameAction()
    // Dùng action để lấy dữ liệu
    const data = await performAction('territory/getData')
    if (data) {
      setTerritory(data)
    }
  }

  return {
    territory: readonly(territoryState),
    setTerritory,
    fetchTerritory
  }
}
