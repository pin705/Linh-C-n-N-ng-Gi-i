<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-900 text-white">
    <div class="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-yellow-400">Nhập Thế</h1>
      <p class="text-center text-gray-400">
        Thiên địa sơ khai, vạn vật hỗn mang. Đạo hữu hãy lưu lại danh tính để bắt đầu con đường trường sinh.
      </p>
      <form @submit.prevent="createCharacter">
        <div>
          <label for="characterName" class="block mb-2 text-sm font-medium text-gray-300">Nhập Tiên Danh</label>
          <input
            v-model="name"
            type="text"
            name="characterName"
            id="characterName"
            class="w-full px-3 py-2 text-white bg-gray-700 border border-gray-600 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
            placeholder="Ví dụ: Hàn Lập"
            required
            :disabled="isLoading"
          >
        </div>
        <div class="mt-6">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full px-5 py-2.5 text-center text-base font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300/50 disabled:bg-gray-600 disabled:cursor-not-allowed"
          >
            {{ isLoading ? 'Đang khai mở linh căn...' : 'Bắt Đầu Tu Luyện' }}
          </button>
        </div>
        <p v-if="error" class="mt-2 text-sm text-center text-red-500">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
const name = ref('')
const isLoading = ref(false)
const error = ref('')
const { fetch } = useUserSession()

async function createCharacter() {
  if (!name.value.trim() || isLoading.value) return
  isLoading.value = true
  error.value = ''

  try {
    await $fetch('/api/character/create', {
      method: 'POST',
      body: { name: name.value }
    })

    // Tạo nhân vật thành công, cập nhật lại session và chuyển hướng
    await fetch()
  } catch (e) {
    error.value = e.data?.message || 'Tiên danh này đã có người sử dụng.'
  } finally {
    isLoading.value = false
  }
}
</script>
