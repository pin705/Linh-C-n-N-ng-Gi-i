export function useGameAction() {
  const { addLog } = useGameLog()
  // Lấy pháp quyết từ Linh Đài
  const { updateCharacter } = useCharacterStore()
  const isLoading = ref(false)

  const performAction = async <T extends { message?: string }>(action: string, payload?: any): Promise<T | null> => {
    isLoading.value = true
    try {
      const result = await $fetch<T>('/api/action', {
        method: 'POST',
        body: { action, payload }
      })

      if (result && result.message) {
        addLog(result.message, 'success')
      }

      // --- LOGIC MỚI: CẬP NHẬT LINH ĐÀI ---
      if (result) {
        const { farm, ...characterUpdates } = result as any

        // Nếu kết quả trả về có dữ liệu nhân vật, gọi pháp quyết "Tẩy Tủy"
        if (Object.keys(characterUpdates).length > 1) { // >1 để bỏ qua message
          updateCharacter(characterUpdates)
        }

        // Nếu có dữ liệu nông trại, vẫn cần refresh riêng cho nó
        if (farm) {
          refreshNuxtData('my-farm')
        }
      }

      return result
    } catch (e: any) {
      addLog(e.data?.message || 'Hành động thất bại.', 'error')
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    performAction,
    isLoading
  }
}
