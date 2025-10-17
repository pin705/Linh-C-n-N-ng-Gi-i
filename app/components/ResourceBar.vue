<template>
  <div class="bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border-2 border-yellow-800/40 p-4 rounded-lg shadow-xl shadow-black/20">
    <h3 class="text-xl text-yellow-300 mb-3 border-b-2 border-yellow-800/30 pb-2 font-serif">
      Tài Nguyên
    </h3>
    <div v-if="character" class="space-y-3 text-white font-sans">
      <div
        v-for="resource in configuredResources"
        :key="resource.id"
        class="flex items-center justify-between group"
        :title="resource.name"
      >
        <span class="flex items-center gap-2">
          <span class="text-lg" :style="{ color: resource.color }">{{ resource.symbol }}</span>
          <span class="text-base text-gray-300">{{ resource.name }}</span>
        </span>
        <span class="font-semibold text-base text-gray-200 tracking-wider">
          {{ Math.floor(character.resources[resource.id] || 0).toLocaleString() }}
        </span>
      </div>

      <div class="flex items-center justify-between group pt-2 border-t border-gray-700/50" title="Thị Nhân trong Tiên Phủ">
        <span class="flex items-center gap-2">
          <span class="text-lg text-cyan-300">人</span>
          <span class="text-base text-gray-300">Thị Nhân</span>
        </span>
        <span v-if="territory" class="font-semibold text-base text-gray-200 tracking-wider">
          {{ territory.population.current }} / {{ territory.population.capacity }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCharacterStore } from '~/composables/useCharacterStore'
import { useTerritoryStore } from '~/composables/useTerritoryStore'
import { RESOURCES } from '~/server/configs/resources.config'

const { character } = useCharacterStore()
const { territory } = useTerritoryStore()

const configuredResources = computed(() => {
  return Object.values(RESOURCES).map((r) => {
    let symbol = '?'
    let color = '#FFFFFF'
    switch (r.id) {
      case 'linhMoc': symbol = '木'; color = '#86efac'; break
      case 'hanNgoc': symbol = '玉'; color = '#7dd3fc'; break
      case 'linhCoc': symbol = '穀'; color = '#fde047'; break
    }
    return { ...r, symbol, color }
  })
})
</script>
