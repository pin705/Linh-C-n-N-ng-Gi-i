<template>
  <div class="p-4 sm:p-8 min-h-screen font-serif bg-[url('/bg/territory-bg.png')] bg-cover bg-center">
    <div
      v-if="!territory"
      class="text-center py-16 text-xl animate-pulse"
    >
      Đang triệu hồi Tiên Phủ...
    </div>
    <div
      v-else
      class="space-y-12"
    >
    <ResourceBar />
      <div
        v-for="section in sections"
        :key="section.title"
      >
        <div class="relative text-center mb-6">
          <hr class="absolute top-1/2 -translate-y-1/2 w-full border-t-2 border-dashed border-gray-700/50">
          <h2
            class="relative inline-block bg-gray-900 px-4 text-2xl"
            :class="section.color"
          >
            {{ section.title }}
          </h2>
        </div>
        <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <BuildingSlot
            v-for="buildingId in section.buildings"
            :key="buildingId"
            :building-id="buildingId"
            :territory="territory"
            @select="openBuildingModal(buildingId)"
            @collect="handleCollectResource(buildingId)"
          />
        </div>
      </div>
    </div>

    <BuildingDetailModal
      :is-open="isModalOpen"
      :building-id="selectedBuildingId"
      @close="isModalOpen = false"
    />
  </div>
</template>

<script setup>
const { territory } = useTerritoryStore()
const { performAction, isLoading } = useGameAction()
const { setTerritory } = useTerritoryStore()

const sections = [
  {
    title: 'Công Trình Cốt Lõi & Tài Nguyên',
    color: 'text-green-400',
    buildings: ['main_hall', 'storage', 'wood_yard', 'stone_mine']
  },
  {
    title: 'Công Trình Phụ Trợ & Quân Sự',
    color: 'text-cyan-400',
    buildings: ['population_house', 'barracks']
  }
]

async function handleCollectResource(buildingId) {
  if (isLoading.value) return
  const result = await performAction('territory/collectResources', { buildingId })
  if (result && result.territory) {
    setTerritory(result.territory)
  }
}

// Logic cho Modal
const isModalOpen = ref(false)
const selectedBuildingId = ref(null)

function openBuildingModal(buildingId) {
  selectedBuildingId.value = buildingId
  isModalOpen.value = true
}
</script>
