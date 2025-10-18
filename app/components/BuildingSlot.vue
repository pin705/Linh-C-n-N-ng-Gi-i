<template>
  <div
    class="relative rounded-lg p-2 sm:p-4 flex flex-col items-center justify-between transition-all duration-300 cursor-pointer group overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-black"
    :class="state.borderColor"
    @click="handleClick"
  >
    <div class="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
    <div
      class="absolute -inset-1 group-hover:inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300"
      :class="state.glowColor"
    />

    <div class="text-center z-10">
      <h3
        class="text-sm md:text-base font-semibold font-serif transition-colors"
        :class="state.textColor"
      >
        {{ buildingConfig.name }}
      </h3>
      <p
        v-if="building.level > 0"
        class="text-xs text-gray-400"
      >
        Cấp {{ building.level }}
      </p>
    </div>

    <div
      class="relative text-4xl sm:text-5xl my-1 sm:my-2 z-10 transition-all duration-500 group-hover:scale-110"
      :class="state.iconColor"
    >
      <div class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
        <span class="font-bold text-3xl sm:text-4xl leading-none">{{ state.icon }}</span>
      </div>
      <Transition name="resource-pop">
        <div
          v-if="showResourcePop"
          class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full flex items-center gap-1 text-sm sm:text-base font-sans font-bold"
          :style="{ color: resourcePop.color }"
        >
          <span>{{ resourcePop.symbol }}</span>
          <span>+{{ resourcePop.amount }}</span>
        </div>
      </Transition>
    </div>

    <div class="h-14 w-full text-center z-10 flex flex-col justify-end">
      <div
        v-if="state.status === 'upgrading'"
        class="font-sans w-full"
      >
        <p class="text-xs sm:text-sm text-amber-400">
          {{ upgradeCountdown }}
        </p>
        <div class="w-full bg-black/50 rounded-full h-1.5 mt-1 border border-gray-700">
          <div
            class="bg-amber-500 h-full rounded-full"
            :style="{ width: upgradeProgress + '%' }"
          />
        </div>
      </div>
      <div
        v-else-if="state.status === 'producing' && building.level > 0"
        class="font-sans w-full"
      >
        <button
          class="w-full h-8 flex items-center justify-center rounded-md transition-colors disabled:cursor-default"
          :disabled="currentProduction < 1"
          :class="isProductionFull ? 'bg-green-600/80 hover:bg-green-600 text-white animate-pulse' : 'bg-transparent'"
          @click.stop="handleCollect"
        >
          <div
            v-if="currentProduction > 0"
            class="flex items-center gap-1 sm:gap-2"
          >
            <span
              class="text-base sm:text-xl"
              :style="{ color: productionResource.color }"
            >{{ productionResource.symbol }}</span>
            <span class="font-semibold text-sm sm:text-base">{{ Math.floor(currentProduction) }}</span>
          </div>
        </button>
        <div class="relative w-full h-5 flex flex-col items-center justify-start">
          <div class="w-full bg-black/50 rounded-full h-1.5 mt-1 border border-gray-700">
            <div
              class="bg-green-500 h-full rounded-full"
              :style="{ width: productionProgress + '%' }"
            />
          </div>
          <p class="text-xs text-gray-500 tracking-wider mt-1">
            {{ productionCountdown }}
          </p>
        </div>
      </div>
      <div
        v-else
        class="px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs sm:text-sm font-sans font-semibold border"
        :class="state.buttonClass"
      >
        {{ state.buttonText }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  buildingId: { type: String, required: true },
  territory: { type: Object, required: true }
})

const emit = defineEmits(['select', 'collect'])

const buildingConfig = BUILDINGS[props.buildingId]
const building = computed(() => props.territory.buildings.find(b => b.id === props.buildingId) || { id: props.buildingId, level: 0 })
const upgradeQueueItem = computed(() => props.territory.upgradeQueue.find(q => q.buildingId === props.buildingId))
const showResourcePop = ref(false)
const resourcePop = ref({ symbol: '', amount: 0, color: '#FFFFFF' })

const currentTime = ref(Date.now())
let timerInterval = null

// --- LOGIC SẢN XUẤT ĐÃ SỬA LỖI HOÀN TOÀN ---
const productionInfo = computed(() => {
  if (building.value.level === 0) return null
  const levelConfig = buildingConfig.levels.find(l => l.level === building.value.level)
  if (!levelConfig) return null
  const prodKey = Object.keys(levelConfig.effects).find(k => k.startsWith('production_'))
  if (!prodKey) return null

  const resourceId = prodKey.replace('production_', '')
  const ratePerMinute = levelConfig.effects[prodKey]
  const maxOfflineHours = levelConfig.effects.maxOfflineHours || 8
  const maxAccumulation = ratePerMinute * 60 * maxOfflineHours

  return { resourceId, ratePerMinute, maxAccumulation }
})

const currentProduction = computed(() => {
  if (!productionInfo.value) return 0
  const secondsPassed = (currentTime.value - new Date(props.territory.lastUpdated).getTime()) / 1000
  const producedNow = (productionInfo.value.ratePerMinute / 60) * secondsPassed
  const alreadyUncollected = props.territory.uncollectedResources[productionInfo.value.resourceId] || 0
  return Math.min(productionInfo.value.maxAccumulation, alreadyUncollected + producedNow)
})

const isProductionFull = computed(() => {
  if (!productionInfo.value) return false
  return currentProduction.value >= productionInfo.value.maxAccumulation
})

const productionProgress = computed(() => {
  if (!productionInfo.value || productionInfo.value.maxAccumulation === 0) return 0
  return (currentProduction.value / productionInfo.value.maxAccumulation) * 100
})

const productionCountdown = ref('')
const upgradeCountdown = ref('')

function updateTimers() {
  currentTime.value = Date.now()
  if (upgradeQueueItem.value) {
    const diff = Math.max(0, new Date(upgradeQueueItem.value.completionTime).getTime() - currentTime.value)
    const hours = Math.floor(diff / 3600000).toString().padStart(2, '0')
    const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
    const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
    upgradeCountdown.value = `${hours}:${minutes}:${seconds}`
  }

  if (productionInfo.value) {
    if (isProductionFull.value) {
      productionCountdown.value = 'Kho đã đầy'
    } else {
      const remainingCapacity = productionInfo.value.maxAccumulation - currentProduction.value
      const secondsToFull = (remainingCapacity / productionInfo.value.ratePerMinute) * 60

      if (secondsToFull <= 0) {
        productionCountdown.value = 'Sắp đầy'
      } else {
        const hours = Math.floor(secondsToFull / 3600)
        const minutes = Math.floor((secondsToFull % 3600) / 60)

        if (hours > 0) {
          productionCountdown.value = `~${hours}h ${minutes}m`
        } else {
          const secs = Math.floor(secondsToFull % 60)
          productionCountdown.value = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
        }
      }
    }
  }
}

onMounted(() => {
  updateTimers()
  timerInterval = setInterval(updateTimers, 1000)
})
onUnmounted(() => { clearInterval(timerInterval) })

// ... (logic còn lại: productionResource, handleCollect, handleClick, upgradeProgress, state, etc. giữ nguyên)

const upgradeProgress = computed(() => {
  if (!upgradeQueueItem.value) return 0
  const start = new Date(upgradeQueueItem.value.startTime).getTime()
  const end = new Date(upgradeQueueItem.value.completionTime).getTime()
  const now = currentTime.value
  if (now >= end) return 100
  return ((now - start) / (end - start)) * 100
})

function handleCollect() {
  if (currentProduction.value < 1) return
  const amount = Math.floor(currentProduction.value)
  resourcePop.value = {
    symbol: productionResource.value.symbol,
    amount,
    color: productionResource.value.color
  }
  showResourcePop.value = true
  setTimeout(() => { showResourcePop.value = false }, 1500)
  emit('collect') // Chỉ phát sự kiện chung
}

function handleClick() {
  if (currentProduction.value >= 1) { // Cho phép thu hoạch sớm
    handleCollect()
  } else {
    emit('select')
  }
}

const productionResource = computed(() => {
  if (!productionInfo.value) return {}
  const res = RESOURCES[productionInfo.value.resourceId]
  let symbol = '?'
  let color = '#FFFFFF'
  switch (res.id) {
    case 'linhMoc': symbol = '木'; color = '#86efac'; break
    case 'hanNgoc': symbol = '玉'; color = '#7dd3fc'; break
  }
  return { ...res, symbol, color }
})

const state = computed(() => {
  if (upgradeQueueItem.value) {
    return { status: 'upgrading', icon: '築', buttonText: 'Đang Bận', textColor: 'text-amber-300', iconColor: 'text-amber-400', borderColor: 'border-amber-600/50', buttonClass: 'bg-transparent border-amber-800 text-amber-400', glowColor: 'bg-amber-500/10 blur-md' }
  }
  if (building.value.level > 0) {
    // Nếu là công trình sản xuất, trả về state 'producing'
    if (productionInfo.value) {
      return { status: 'producing', icon: '產', buttonText: 'Sản xuất', textColor: 'text-green-300', iconColor: 'text-green-400', borderColor: 'border-green-600/50 group-hover:border-green-500', buttonClass: 'bg-transparent', glowColor: 'bg-green-500/10 blur-md' }
    }
    // Các công trình khác
    return { status: 'idle', icon: '升', buttonText: 'Nâng Cấp', textColor: 'text-green-300', iconColor: 'text-green-400', borderColor: 'border-green-600/50 group-hover:border-green-500', buttonClass: 'bg-transparent border-green-800 group-hover:bg-green-900/50 text-white', glowColor: 'bg-green-500/10 blur-md' }
  }
  // Logic kiểm tra có thể xây được không (đơn giản hóa)
  const canBuild = true
  if (canBuild) {
    return { status: 'can_build', icon: '啟', buttonText: 'Khai Mở', textColor: 'text-cyan-300', iconColor: 'text-cyan-400', borderColor: 'border-cyan-600/50 group-hover:border-cyan-500', buttonClass: 'bg-transparent border-cyan-800 group-hover:bg-cyan-900/50 text-white', glowColor: 'bg-cyan-500/10 blur-md' }
  }
  return { status: 'locked', icon: '封', buttonText: 'Chưa Mở', textColor: 'text-gray-500', iconColor: 'text-gray-600', borderColor: 'border-gray-700/50', buttonClass: 'bg-transparent border-gray-700 text-gray-500', glowColor: 'bg-gray-500/10 blur-md' }
})
</script>

<style scoped>
.resource-pop-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.resource-pop-leave-active {
  transition: all 1s cubic-bezier(0.6, 0.04, 0.98, 0.335);
}
.resource-pop-enter-from,
.resource-pop-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px) scale(0.5);
}
.resource-pop-enter-to,
.resource-pop-leave-from {
  opacity: 1;
  transform: translate(-50%, -150%) scale(1.1);
}
</style>
