<template>
  <div class="">
    <h3 class="text-xl text-yellow-300 mb-3 border-b-2 border-yellow-800/30 pb-2 font-serif">
      Tài Nguyên Tiên Phủ
    </h3>
    <div
      v-if="character && territory"
      class="space-y-3 text-white"
    >
      <div class="flex flex-wrap gap-4">
        <div
          v-for="resource in RESOURCES"
          :key="resource.id"
          class="group"
          :title="`${resource.name} (${Math.floor(character.resources[resource.id] || 0).toLocaleString()} / ${getCapacity(resource.id).toLocaleString()})`"
        >
          <div class="flex items-center justify-between text-sm mb-1">
            <span class="flex items-center gap-2">
              <span
                class="text-lg"
                :style="{ color: resource.color }"
              >{{ resource.symbol }}</span>
              <span class="text-base text-gray-300 mr-1">{{ resource.name }} </span>
            </span>
            <span class="font-semibold text-xs text-gray-400 tracking-wider">
              {{ Math.floor(character.resources[resource.id] || 0).toLocaleString() }} / {{ getCapacity(resource.id).toLocaleString() }}
            </span>
          </div>
          <div class="w-full bg-black/50 rounded-full h-1.5">
            <div
              class="h-full rounded-full transition-all duration-500"
              :style="{ width: getResourcePercentage(resource.id) + '%', backgroundColor: resource.color }"
            />
          </div>
        </div>
      </div>

      <div class="pt-2 border-t border-gray-700/50">
        <div class="flex items-center text-sm">
          <span class="flex items-center gap-2">
            <span class="text-lg text-cyan-300">人</span>
            <span class="text-base text-gray-300 font-serif mr-1">Thị Nhân </span>
          </span>
          <span
            v-if="territory"
            class="font-semibold text-base text-gray-200 tracking-wider"
          >
            {{ territory.population.current }} / {{ territory.population.capacity }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { character } = useCharacterStore()
const { territory } = useTerritoryStore()
// --- PHÁP QUYẾT MỚI ---
/**
 * Lấy sức chứa tối đa cho một loại tài nguyên từ store
 */
function getCapacity(resourceId) {
  return territory.value?.resourceCaps?.[resourceId] || 0
}

/**
 * Tính toán phần trăm tài nguyên hiện có so với sức chứa
 */
function getResourcePercentage(resourceId) {
  const current = character.value?.resources?.[resourceId] || 0
  const capacity = getCapacity(resourceId)
  if (capacity === 0) return 0
  return Math.min(100, (current / capacity) * 100)
}
</script>
