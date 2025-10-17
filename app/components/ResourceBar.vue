<template>
  <div
    v-if="territory"
    class="bg-black/30 backdrop-blur-sm p-3 rounded-lg flex flex-wrap gap-4 md:gap-6 text-white font-sans items-center"
  >
    <div
      class="flex items-center gap-2"
      title="Linh Mộc"
    >
      <span class="text-xl">🪵</span>
      <span class="font-semibold">{{ Math.floor(territory.resources.linhMoc) }}</span>
    </div>
    <div
      class="flex items-center gap-2"
      title="Hàn Ngọc"
    >
      <span class="text-xl">💎</span>
      <span class="font-semibold">{{ Math.floor(territory.resources.hanNgoc) }}</span>
    </div>
    <div
      class="flex items-center gap-2"
      title="Linh Cốc"
    >
      <span class="text-xl">🌾</span>
      <span class="font-semibold">{{ Math.floor(territory.resources.linhCoc) }}</span>
    </div>
    <div
      class="flex items-center gap-2"
      title="Thị Nhân"
    >
      <span class="text-xl">👥</span>
      <span class="font-semibold">{{ territory.population.current }} / {{ territory.population.capacity }}</span>
    </div>
  </div>
</template>

<script setup>
const { territory } = useTerritoryStore()
</script>
