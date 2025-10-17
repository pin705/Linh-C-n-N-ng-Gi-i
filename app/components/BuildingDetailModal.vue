<template>
  <BaseModal
    :is-open="isOpen"
    @close="close"
  >
    <div
      v-if="buildingConfig"
      class="bg-gradient-to-br from-gray-900 to-black border-2 border-yellow-700/50 rounded-lg shadow-2xl shadow-black w-full max-w-lg font-serif text-white transition-all duration-300 transform scale-95 opacity-0 animate-scale-in"
    >
      <div class="relative p-6">
        <div class="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-yellow-900/20 to-transparent" />
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-3xl text-yellow-300 [text-shadow:0_0_8px_rgba(251,191,36,0.5)]">
              {{ buildingConfig.name }}
            </h3>
            <p class="text-yellow-500">
              Cấp Hiện tại: {{ currentLevel }}
            </p>
          </div>
          <button
            class="text-gray-500 hover:text-white text-3xl transition-colors z-10"
            @click="close"
          >
            &times;
          </button>
        </div>
      </div>

      <div class="px-6 pb-6 space-y-4 max-h-[60vh] overflow-y-auto">
        <p class="text-gray-400 text-base italic border-l-4 border-yellow-800 pl-4">
          {{ nextLevelInfo ? nextLevelInfo.description : buildingConfig.baseDescription }}
        </p>

        <div
          v-if="nextLevelInfo"
          class="grid grid-cols-2 gap-4 bg-black/30 p-4 rounded-md border border-gray-700"
        >
          <div>
            <h4 class="text-lg text-gray-400">
              Hiện tại
            </h4>
            <ul class="list-disc list-inside text-gray-300 text-sm space-y-1 mt-1">
              <li
                v-for="(value, key) in currentLevelEffects"
                :key="key"
              >
                {{ formatBuildingEffect(key, value) }}
              </li>
            </ul>
          </div>
          <div>
            <h4 class="text-lg text-green-400">
              Nâng cấp
            </h4>
            <ul class="list-disc list-inside text-green-300 text-sm space-y-1 mt-1">
              <li
                v-for="(value, key) in nextLevelInfo.effects"
                :key="key"
              >
                {{ formatBuildingEffect(key, value) }}
              </li>
            </ul>
          </div>
        </div>
        <div
          v-else
          class="text-center py-4 text-amber-400 border border-dashed border-amber-800 rounded-md"
        >
          Đã đạt cảnh giới tối đa.
        </div>

        <div v-if="nextLevelInfo">
          <h4 class="text-xl text-yellow-400 mb-2">
            Tiêu Hao & Điều Kiện
          </h4>
          <div class="space-y-2 font-sans bg-black/30 p-4 rounded-md border border-gray-700">
            <div
              v-for="(amount, resource) in nextLevelInfo.cost"
              :key="resource"
              class="flex justify-between items-center text-sm"
              :class="hasEnoughResource(resource, amount) ? 'text-gray-300' : 'text-red-400'"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">{{ RESOURCES[resource]?.symbol }}</span>
                <span>{{ RESOURCES[resource]?.name }}</span>
              </span>
              <span class="font-semibold">{{ Math.floor(character.resources[resource] || 0) }} / {{ amount }}</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-300">
              <span class="flex items-center gap-2">
                <span class="text-lg">⏳</span>
                <span>Thời Gian</span>
              </span>
              <span class="font-semibold">{{ formatBuildTime(nextLevelInfo.buildTime) }}</span>
            </div>
            <div
              v-for="prereq in nextLevelInfo.prerequisites"
              :key="prereq.buildingId"
              class="flex justify-between items-center text-sm"
              :class="hasPrerequisite(prereq) ? 'text-gray-300' : 'text-red-400'"
            >
              <span class="flex items-center gap-2">
                <span class="text-lg">📜</span>
                <span>Yêu Cầu</span>
              </span>
              <span class="font-semibold">{{ BUILDINGS[prereq.buildingId].name }} - Cấp {{ prereq.level }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6 bg-black/20 border-t-2 border-yellow-800/30">
        <button
          :disabled="!canUpgrade || isLoading"
          class="w-full py-3 rounded-lg text-xl font-semibold transition-all duration-300 disabled:cursor-not-allowed group relative overflow-hidden"
          :class="canUpgrade ? 'bg-green-700 hover:bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-gray-700 text-gray-500'"
          @click="handleUpgrade"
        >
          <span class="relative z-10">{{ upgradeButtonText }}</span>
          <div
            v-if="canUpgrade"
            class="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-125 transition-all duration-500 rounded-full"
          />
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  buildingId: String
})

const emit = defineEmits(['close'])

const { territory, setTerritory } = useTerritoryStore()
const { performAction, isLoading } = useGameAction()
const { character } = useCharacterStore()

const buildingConfig = computed(() => props.buildingId ? BUILDINGS[props.buildingId] : null)
const currentBuilding = computed(() => territory.value?.buildings.find(b => b.id === props.buildingId) || { id: props.buildingId, level: 0 })
const currentLevel = computed(() => currentBuilding.value.level)

const nextLevelInfo = computed(() => {
  if (!buildingConfig.value) return null
  return buildingConfig.value.levels.find(l => l.level === currentLevel.value + 1)
})

const currentLevelEffects = computed(() => {
  if (currentLevel.value === 0 || !buildingConfig.value) return { 'Không có': '' }
  const levelConf = buildingConfig.value.levels.find(l => l.level === currentLevel.value)
  return levelConf ? levelConf.effects : { 'Không có': '' }
})

const prerequisitesMet = computed(() => {
  if (!nextLevelInfo.value) return false
  return nextLevelInfo.value.prerequisites.every(hasPrerequisite)
})

const resourcesMet = computed(() => {
  if (!nextLevelInfo.value) return false
  return Object.entries(nextLevelInfo.value.cost).every(([resource, amount]) => hasEnoughResource(resource, amount))
})

const queueSize = computed(() => {
  const mainHall = territory.value?.buildings.find(b => b.id === 'main_hall')
  if (!mainHall || mainHall.level === 0) return 1 // Mặc định có 1 slot khi Tiên Cung cấp 0
  const levelConf = BUILDINGS.main_hall.levels.find(l => l.level === mainHall.level)
  return levelConf?.effects.build_queue_size || 1
})

const canUpgrade = computed(() => {
  if (!nextLevelInfo.value || isLoading.value) return false
  return prerequisitesMet.value
    && resourcesMet.value
    && (territory.value?.upgradeQueue.length || 0) < queueSize.value
})

const upgradeButtonText = computed(() => {
  if (isLoading.value) return 'Đang Thao Tác...'
  if (!nextLevelInfo.value) return 'Cấp Tối Đa'
  if ((territory.value?.upgradeQueue.length || 0) >= queueSize.value) return 'Hàng Đợi Đầy'
  if (!prerequisitesMet.value) return 'Thiếu Điều Kiện'
  if (!resourcesMet.value) return 'Thiếu Tài Nguyên'
  return `Nâng Lên Cấp ${nextLevelInfo.value.level}`
})

const upgradeButtonClass = computed(() => {
  return canUpgrade.value ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500'
})

function close() { emit('close') }

async function handleUpgrade() {
  if (!canUpgrade.value) return
  const result = await performAction('territory/upgradeBuilding', { buildingId: props.buildingId })
  if (result && result.territory) {
    setTerritory(result.territory) // Cập nhật store với dữ liệu mới nhất
    close()
  }
}

function hasEnoughResource(resource, amount) {
  return character.value && (character.value.resources[resource] || 0) >= amount
}
function hasPrerequisite(prereq) {
  const b = territory.value?.buildings.find(b => b.id === prereq.buildingId)
  return b && b.level >= prereq.level
}
function formatBuildTime(seconds) {
  if (seconds < 60) return `${seconds} giây`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`
  return `${Math.floor(seconds / 3600)} giờ ${Math.floor((seconds % 3600) / 60)} phút`
}
</script>

<style scoped>
@keyframes scale-in {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scale-in {
  animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
