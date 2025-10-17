<template>
  <div class="p-4 sm:p-8 bg-gray-900 min-h-screen text-white font-serif">
    <div class="sticky top-0 bg-gray-900/80 backdrop-blur-sm z-10 py-4 mb-6">
      <h1 class="text-4xl text-yellow-300 tracking-wider">
        Tiên Phủ Lãnh Địa
      </h1>
      <ResourceBar class="mt-4" />
    </div>

    <div
      v-if="pending || !territory"
      class="text-center py-16"
    >
      Đang tải Tiên Phủ...
    </div>
    <div
      v-else
      class="space-y-8"
    >
      <div>
        <h2 class="text-2xl text-green-400 mb-4">
          Công Trình Cốt Lõi & Tài Nguyên
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <BuildingSlot
            v-for="buildingId in ['main_hall', 'storage', 'wood_yard', 'stone_mine']"
            :key="buildingId"
            :building-id="buildingId"
            :territory="territory"
            @select="openBuildingModal(buildingId)"
          />
        </div>
      </div>
      <div>
        <h2 class="text-2xl text-cyan-400 mb-4">
          Công Trình Phụ Trợ & Quân Sự
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <BuildingSlot
            v-for="buildingId in ['population_house', 'barracks']"
            :key="buildingId"
            :building-id="buildingId"
            :territory="territory"
            @select="openBuildingModal(buildingId)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { territory, fetchTerritory } = useTerritoryStore()
const { pending } = await useAsyncData('init-territory-store', () => fetchTerritory())

// Logic cho Modal
const isModalOpen = ref(false)
const selectedBuildingId = ref(null)

function openBuildingModal(buildingId) {
  selectedBuildingId.value = buildingId
  isModalOpen.value = true
  console.log('Mở modal cho:', buildingId)
  // Trong bước tiếp theo, chúng ta sẽ tạo component BuildingDetailModal và hiển thị nó ở đây.
}
</script>
