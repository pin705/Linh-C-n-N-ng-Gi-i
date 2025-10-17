<template>
  <div class="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-yellow-700/50 p-4 sm:p-6 rounded-lg mb-8 shadow-xl shadow-yellow-900/10 relative overflow-hidden">
    <div class="absolute top-0 left-0 w-16 h-16 bg-[url('/decor/corner-pattern.svg')] bg-contain bg-no-repeat opacity-20 transform -rotate-90" />
    <div class="absolute bottom-0 right-0 w-16 h-16 bg-[url('/decor/corner-pattern.svg')] bg-contain bg-no-repeat opacity-20 transform rotate-90" />

    <div
      v-if="!character"
      class="text-center text-gray-400 py-8"
    >
      Đang tải thông tin đạo hữu...
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-3 gap-6 font-serif"
    >
      <div class="flex flex-col items-center md:items-start text-center md:text-left">
        <h2 class="text-3xl font-bold text-yellow-300 tracking-wider">
          {{ character.name }}
        </h2>
        <p class="text-gray-300 mt-1">
          Cảnh giới:
          <span class="text-green-400 font-medium text-lg italic">{{ character.realm }}</span>
        </p>
      </div>

      <div class="flex flex-col justify-center">
        <p class="text-lg text-gray-200 mb-1">
          Tu Vi Thú Sư
        </p>
        <div class="w-full bg-black/30 rounded-full h-5 border-2 border-blue-900/50 p-0.5 overflow-hidden">
          <div
            class="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
            :style="{ width: `${cultivationPercentage}%` }"
          >
            <div class="w-full h-full bg-white/20 animate-pulse-fast" />
          </div>
        </div>
        <p class="text-center text-sm mt-1.5 text-cyan-300 font-sans font-semibold tracking-widest">
          {{ character.cultivationExp }} / {{ nextRealmExp }}
        </p>
      </div>

      <div>
        <h3 class="text-xl text-yellow-400 mb-2 border-b-2 border-yellow-800/50 pb-1">
          Túi Càn Khôn
        </h3>
        <ul
          v-if="character.inventory && character.inventory.length"
          class="space-y-1 text-gray-300 max-h-40 overflow-y-auto pr-2"
        >
          <li
            v-for="item in character.inventory"
            :key="item.itemId + item.quality"
            class="flex justify-between items-center text-base"
          >
            <span :style="{ color: item.color }">{{ item.name }}</span>
            <span class="font-sans font-semibold text-amber-300">x{{ item.quantity }}</span>
          </li>
        </ul>
        <p
          v-else
          class="text-gray-500 italic text-sm"
        >
          Trong túi trống rỗng, không có một cọng linh thảo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { REALMS } from '~~/shared'

// Tham chiếu chân thân từ Linh Đài
const { character } = useCharacterStore()

// --- LOGIC MỚI ĐỂ TÍNH TOÁN THANH TU VI ---
const currentRealmIndex = computed(() => {
  if (!character.value) return 0
  return REALMS.findIndex(r => r.name === character.value.realm)
})

const nextRealmExp = computed(() => {
  if (!character.value) return 1000
  const nextIndex = currentRealmIndex.value + 1
  return REALMS[nextIndex] ? REALMS[nextIndex].expRequired : character.value.cultivationExp
})

const currentRealmExp = computed(() => {
  if (!character.value) return 0
  return REALMS[currentRealmIndex.value]?.expRequired || 0
})

const cultivationPercentage = computed(() => {
  if (!character.value || nextRealmExp.value === currentRealmExp.value) return 100
  const expInCurrentRealm = character.value.cultivationExp - currentRealmExp.value
  const expNeededForNextRealm = nextRealmExp.value - currentRealmExp.value
  return Math.max(0, Math.min(100, (expInCurrentRealm / expNeededForNextRealm) * 100))
})
</script>
