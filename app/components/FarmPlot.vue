<template>
  <div class="mt-10">
    <h2 class="text-4xl text-green-300 mb-6 font-serif tracking-wider">
      Linh Điền
    </h2>
    <div
      v-if="pending"
      class="text-center text-gray-400 py-12"
    >
      Đang tải linh điền...
    </div>
    <div
      v-else-if="error"
      class="text-red-400 py-12"
    >
      Lỗi: {{ error.message }}
    </div>
    <div
      v-else-if="farm"
      class="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      <div
        v-for="plot in farm.plots"
        :key="plot.plotId"
        class="relative aspect-square rounded-lg flex flex-col items-center justify-center p-4 cursor-pointer transition-all duration-300 group"
        :class="getPlotClasses(plot)"
        @click="handlePlotClick(plot)"
      >
        <div
          v-if="plot.status === 'empty'"
          class="text-center text-yellow-700 group-hover:text-yellow-500 transition-colors"
        >
          <span class="text-5xl font-thin">+</span>
          <p class="font-serif text-lg">
            Gieo hạt
          </p>
        </div>

        <div
          v-else
          class="text-center"
        >
          <div
            v-if="getRemainingSeconds(plot) > 0"
            class="absolute inset-0 bg-green-400/20 rounded-lg blur-xl animate-pulse"
          />
          <div
            v-else
            class="absolute inset-0 bg-yellow-400/25 rounded-lg blur-2xl animate-pulse-fast"
          />

          <span
            class="text-6xl drop-shadow-lg"
            :class="{ 'animate-bounce-slow': getRemainingSeconds(plot) > 0 }"
          >
            {{ getRemainingSeconds(plot) > 0 ? '🌱' : '🌿' }}
          </span>

          <p class="font-serif text-lg text-green-200 font-semibold drop-shadow-md mt-2">
            {{ getSeedName(plot.seedId) }}
          </p>

          <p
            class="text-sm font-sans tracking-widest h-5 mt-1"
            :class="getRemainingSeconds(plot) > 0 ? 'text-cyan-300' : 'text-yellow-300 font-bold'"
          >
            {{ formatTime(plot) }}
          </p>
        </div>
      </div>
    </div>
  </div>

  <SeedSelectionModal
    :is-open="isModalOpen"
    :seeds="availableSeeds"
    @close="isModalOpen = false"
    @select-seed="plantSelectedSeed"
  />
</template>

<script setup lang="ts">
import { SEEDS } from '~~/shared'

const { data: farm, pending, error } = await useFetch('/api/farm/my-farm', { key: 'my-farm' })
const { performAction, isLoading } = useGameAction()
const { character } = useCharacterStore()

// --- LOGIC CHO MODAL VÀ GIEO HẠT LINH HOẠT ---
const isModalOpen = ref(false)
const selectedPlotId = ref(null)

// Lọc ra những vật phẩm là hạt giống từ túi đồ trong store
const availableSeeds = computed(() => {
  if (!character.value || !character.value.inventory) return []
  return character.value.inventory.filter(item => item.type === 'seed' && item.quantity > 0)
})

async function handlePlotClick(plot) {
  if (isLoading.value) return

  if (plot.status === 'empty') {
    if (availableSeeds.value.length === 0) {
      useGameLog().addLog('Không có hạt giống nào để gieo trồng!', 'info')
      return
    }
    // Mở Modal để người chơi chọn hạt giống
    selectedPlotId.value = plot.plotId
    isModalOpen.value = true
  } else if (plot.status === 'growing' && getRemainingSeconds(plot) === 0) {
    // Gọi action thu hoạch
    await performAction('farm/harvest', { plotId: plot.plotId })
  } else {
    useGameLog().addLog('Linh dược chưa chín, không thể thu hoạch!', 'info')
  }
}

// Hàm được gọi khi người chơi chọn hạt giống từ Modal
async function plantSelectedSeed(seedId) {
  if (!selectedPlotId.value) return

  await performAction('farm/plantSeed', {
    plotId: selectedPlotId.value,
    seedId: seedId
  })

  selectedPlotId.value = null // Reset lại sau khi gieo
}

// --- LOGIC HIỂN THỊ THỜI GIAN ---
const currentTime = ref(new Date())
let timerInterval = null

onMounted(() => {
  timerInterval = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerInterval)
})

function getSeedName(seedId) {
  return SEEDS[seedId]?.name || 'Linh Thảo'
}

function getRemainingSeconds(plot) {
  if (plot.status !== 'growing' || !plot.plantedAt) {
    return 0
  }
  const growthDuration = (SEEDS[plot.seedId]?.growthTime || 30) * 1000
  const endTime = new Date(plot.plantedAt).getTime() + growthDuration
  const remainingMs = Math.max(0, endTime - currentTime.value.getTime())
  return Math.floor(remainingMs / 1000)
}

function formatTime(plot) {
  const secondsLeft = getRemainingSeconds(plot)
  if (secondsLeft > 0) {
    const minutes = Math.floor(secondsLeft / 60)
    const seconds = secondsLeft % 60
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return 'Sẵn sàng'
}

function getPlotClasses(plot) {
  if (plot.status === 'empty') {
    return 'bg-gradient-to-br from-yellow-900/40 to-yellow-950/60 border-2 border-yellow-800/60 hover:border-yellow-600 hover:bg-yellow-900/50'
  }

  if (getRemainingSeconds(plot) > 0) {
    return 'bg-gradient-to-br from-green-900/40 to-green-950/70 border-2 border-green-700/50'
  }

  return 'bg-gradient-to-br from-amber-800/60 to-yellow-950/80 border-2 border-amber-500/80 shadow-lg shadow-yellow-500/10'
}
</script>

<style>
@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(-10%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 2s infinite;
}
@keyframes pulse-fast {
  50% {
    opacity: .5;
  }
}
.animate-pulse-fast {
  animation: pulse-fast 1s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
