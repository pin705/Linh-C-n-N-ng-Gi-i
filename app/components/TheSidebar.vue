<template>
  <div class="w-64 bg-gray-900/80 backdrop-blur-md border-r-2 border-yellow-800/50 p-6 flex flex-col font-serif">
    <h1 class="text-3xl font-bold text-yellow-300 text-center mb-10">
      Linh Căn Nông Giới
    </h1>
    <nav class="space-y-4">
      <button
        v-for="view in views"
        :key="view.id"
        class="w-full text-left text-lg p-3 rounded-lg transition-colors"
        :class="currentView === view.id ? 'bg-yellow-800/50 text-yellow-200' : 'text-gray-300 hover:bg-gray-700/50'"
        @click="setView(view.id)"
      >
        {{ view.name }}
      </button>
    </nav>
    <div class="mt-auto text-center">
      <button
        class="text-gray-400 hover:text-red-500 transition-colors"
        @click="clear"
      >
        Đăng Xuất
      </button>
    </div>
  </div>
</template>

<script setup>
const { currentView, setView } = useGameView()
const { clear } = useUserSession()

const views = [
  { id: 'DASHBOARD', name: 'Bảng Điều Khiển' },
  { id: 'FARM', name: 'Linh Điền' },
  { id: 'TERRITORY', name: 'Tiên Phủ Lãnh Địa' }
]
</script>
