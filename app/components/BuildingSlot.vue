<template>
  <div
    class="bg-gray-800/50 border-2 rounded-lg p-4 flex flex-col items-center justify-between aspect-square transition-all duration-300 cursor-pointer"
    :class="state.borderColor"
    @click="$emit('select')"
  >
    <div class="text-center">
      <h3 class="text-lg font-semibold font-serif" :class="state.textColor">{{ buildingConfig.name }}</h3>
      <p v-if="building.level > 0" class="text-sm text-gray-400">Cấp {{ building.level }}</p>
    </div>

    <div class="text-5xl my-2">{{ state.icon }}</div>

    <div class="h-10 text-center">
      <div v-if="state.status === 'upgrading'" class="font-sans">
        <p class="text-amber-400">Đang nâng cấp...</p>
        <p class="text-sm font-semibold tracking-wider">{{ countdown }}</p>
      </div>
      <div v-else class="px-4 py-1.5 rounded-full text-sm font-sans font-semibold" :class="state.buttonClass">
        {{ state.buttonText }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BUILDINGS } from '~~/shared'

const props = defineProps({
  buildingId: { type: String, required: true },
  territory: { type: Object, required: true },
})

defineEmits(['select'])

const buildingConfig = BUILDINGS[props.buildingId]
const building = computed(() => props.territory.buildings.find(b => b.id === props.buildingId) || { id: props.buildingId, level: 0 })

const upgradeQueueItem = computed(() => props.territory.upgradeQueue.find(q => q.buildingId === props.buildingId))

const countdown = ref('')
let timerInterval = null

function updateCountdown() {
  if (!upgradeQueueItem.value) {
    countdown.value = ''
    return
  }
  const now = new Date().getTime()
  const completionTime = new Date(upgradeQueueItem.value.completionTime).getTime()
  const diff = Math.max(0, completionTime - now)
  const hours = Math.floor(diff / (1000 * 60 * 60)).toString().padStart(2, '0')
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0')
  const seconds = Math.floor((diff % (1000 * 60)) / 1000).toString().padStart(2, '0')
  countdown.value = `${hours}:${minutes}:${seconds}`
}

onMounted(() => {
  updateCountdown()
  timerInterval = setInterval(updateCountdown, 1000)
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

const state = computed(() => {
  if (upgradeQueueItem.value) {
    return { status: 'upgrading', icon: '⏳', buttonText: 'Đang Bận', textColor: 'text-amber-400', borderColor: 'border-amber-600/50', buttonClass: 'bg-amber-900 text-amber-400' }
  }
  if (building.value.level > 0) {
    return { status: 'idle', icon: '✅', buttonText: 'Nâng Cấp', textColor: 'text-green-400', borderColor: 'border-green-600/50 hover:border-green-500', buttonClass: 'bg-green-800 hover:bg-green-700 text-white' }
  }
  // Logic kiểm tra có thể xây được không (đơn giản hóa)
  const canBuild = buildingConfig.levels[0].prerequisites.every(prereq => {
      const b = props.territory.buildings.find(b => b.id === prereq.buildingId);
      return b && b.level >= prereq.level;
  });
  if (canBuild) {
     return { status: 'can_build', icon: '➕', buttonText: 'Xây Dựng', textColor: 'text-cyan-400', borderColor: 'border-cyan-600/50 hover:border-cyan-500', buttonClass: 'bg-cyan-800 hover:bg-cyan-700 text-white' }
  }
  return { status: 'locked', icon: '🔒', buttonText: 'Chưa Mở', textColor: 'text-gray-500', borderColor: 'border-gray-600/50', buttonClass: 'bg-gray-800 text-gray-500' }
})
</script>
