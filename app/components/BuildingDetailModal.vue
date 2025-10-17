<template>
  <Transition name="modal">
    <div
      v-if="isOpen && buildingConfig"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      @click.self="close"
    >
      <div class="bg-gray-800 border-2 border-yellow-700/50 rounded-lg shadow-xl w-full max-w-lg p-6 font-serif text-white">
        <div class="flex justify-between items-center border-b-2 border-yellow-800/50 pb-3 mb-4">
          <div>
            <h3 class="text-3xl text-yellow-300">
              {{ buildingConfig.name }}
            </h3>
            <p class="text-gray-400">
              Cấp {{ currentLevel }}
            </p>
          </div>
          <button
            class="text-gray-400 hover:text-white text-2xl"
            @click="close"
          >
            &times;
          </button>
        </div>

        <div class="space-y-4">
          <p class="text-gray-300 text-base">
            {{ nextLevelInfo ? nextLevelInfo.description : buildingConfig.baseDescription }}
          </p>

          <div
            v-if="nextLevelInfo"
            class="grid grid-cols-2 gap-4 bg-black/20 p-4 rounded-md"
          >
            <div>
              <h4 class="text-lg text-yellow-400">
                Hiệu ứng Cấp {{ currentLevel }}
              </h4>
              <ul class="list-disc list-inside text-gray-300">
                <li
                  v-for="(value, key) in currentLevelEffects"
                  :key="key"
                >
                  {{ formatEffect(key, value) }}
                </li>
              </ul>
            </div>
            <div class="text-green-400">
              <h4 class="text-lg">
                Hiệu ứng Cấp {{ nextLevelInfo.level }}
              </h4>
              <ul class="list-disc list-inside">
                <li
                  v-for="(value, key) in nextLevelInfo.effects"
                  :key="key"
                >
                  {{ formatEffect(key, value) }}
                </li>
              </ul>
            </div>
          </div>
          <div
            v-else
            class="text-center py-4 text-amber-400"
          >
            Đã đạt cấp độ tối đa.
          </div>

          <div v-if="nextLevelInfo">
            <h4 class="text-lg text-yellow-400 mb-2">
              Yêu Cầu Nâng Cấp
            </h4>
            <div class="space-y-1 font-sans">
              <p
                v-for="(amount, resource) in nextLevelInfo.cost"
                :key="resource"
                class="flex justify-between"
                :class="hasEnoughResource(resource, amount) ? 'text-gray-300' : 'text-red-500'"
              >
                <span>{{ resource }}:</span>
                <span>{{ amount }}</span>
              </p>
              <p class="flex justify-between">
                <span>Thời gian:</span>
                <span>{{ formatBuildTime(nextLevelInfo.buildTime) }}</span>
              </p>
            </div>
          </div>
        </div>

        <div class="mt-6">
          <button
            :disabled="!canUpgrade || isLoading"
            class="w-full py-3 rounded-lg text-lg font-semibold transition-colors disabled:cursor-not-allowed"
            :class="canUpgrade ? 'bg-green-600 hover:bg-green-500 text-white' : 'bg-gray-700 text-gray-500'"
            @click="handleUpgrade"
          >
            {{ upgradeButtonText }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  isOpen: Boolean,
  buildingId: String
})

const emit = defineEmits(['close'])

const { territory } = useTerritoryStore()
const { performAction, isLoading } = useGameAction()

const buildingConfig = computed(() => props.buildingId ? BUILDINGS[props.buildingId] : null)
const currentBuilding = computed(() => territory.value?.buildings.find(b => b.id === props.buildingId) || { id: props.buildingId, level: 0 })
const currentLevel = computed(() => currentBuilding.value.level)

const nextLevelInfo = computed(() => {
  if (!buildingConfig.value) return null
  return buildingConfig.value.levels.find(l => l.level === currentLevel.value + 1)
})

const currentLevelEffects = computed(() => {
  if (currentLevel.value === 0 || !buildingConfig.value) return { None: 0 }
  return buildingConfig.value.levels[currentLevel.value - 1].effects
})

const canUpgrade = computed(() => {
  // ... logic kiểm tra điều kiện nâng cấp
  return true // Tạm thời để true
})

const upgradeButtonText = computed(() => {
  if (isLoading.value) return 'Đang Thao Tác...'
  if (!nextLevelInfo.value) return 'Cấp Tối Đa'
  return `Nâng Lên Cấp ${nextLevelInfo.value.level}`
})

function close() {
  emit('close')
}

async function handleUpgrade() {
  if (!canUpgrade.value || isLoading.value) return
  const result = await performAction('territory/upgradeBuilding', { buildingId: props.buildingId })
  if (result) {
    // Cập nhật lại store territory
    useTerritoryStore().setTerritory(result.territory)
    close()
  }
}

// Helper functions for display
function formatEffect(key, value) {
  return `${key.replace('_', ' ')}: ${value}`
}

function hasEnoughResource(resource, amount) {
  return territory.value && territory.value.resources[resource] >= amount
}

function formatBuildTime(seconds) {
  if (seconds < 60) return `${seconds} giây`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} phút ${seconds % 60} giây`
  return `${Math.floor(seconds / 3600)} giờ ${Math.floor((seconds % 3600) / 60)} phút`
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>
