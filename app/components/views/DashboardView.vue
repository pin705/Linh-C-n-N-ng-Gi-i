<template>
  <div class="p-4 sm:p-8 bg-gray-900 min-h-screen text-white">
    <h1 class="text-3xl sm:text-4xl text-yellow-400 mb-6 font-semibold tracking-wider">
      Bảng Điều Khiển
    </h1>

    <CharacterProfile />

    <FarmPlot />
  </div>
</template>

<script setup>
const { fetchCharacter } = useCharacterStore()

// Dùng useAsyncData để đảm bảo dữ liệu được tải về trước khi trang hiển thị
const { pending } = await useAsyncData('init-character-store', () => fetchCharacter())
</script>
