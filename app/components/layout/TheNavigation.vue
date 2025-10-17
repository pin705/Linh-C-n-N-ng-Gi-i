<template>
  <div class="flex flex-col items-center h-full space-y-4 py-8">
    <button
      v-for="view in views"
      :key="view.id"
      class="w-20 h-20 rounded-full border-2 transition-all duration-300 flex flex-col items-center justify-center font-serif"
      :class="currentView === view.id ? 'bg-yellow-900/40 border-yellow-500 text-yellow-200' : 'bg-black/30 border-gray-700 text-gray-400 hover:border-yellow-700/50 hover:text-white'"
      :title="view.name"
      @click="setView(view.id)"
    >
      <span class="text-3xl">{{ view.icon }}</span>
      <span class="text-xs mt-1">{{ view.name }}</span>
    </button>
  </div>
</template>

<script setup>
const { currentView, setView } = useGameView()
const views = [
  { id: 'DASHBOARD', name: 'Tổng Quan', icon: '觀' },
  { id: 'TERRITORY', name: 'Tiên Phủ', icon: '府' }
]
</script>
