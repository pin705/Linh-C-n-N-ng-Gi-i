<template>
  <div class="bg-gradient-to-br from-gray-900/70 to-black/50 backdrop-blur-sm border-2 border-yellow-800/40 p-6 rounded-lg shadow-xl shadow-black/20 relative">
    <div v-if="!character" class="text-center text-gray-400 py-8">
      Đang tải thông tin đạo hữu...
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-6 font-serif">
      <div class="flex flex-col items-center md:items-start text-center md:text-left col-span-1 md:col-span-1">
        <h2 class="text-3xl font-bold text-yellow-200 tracking-wider [text-shadow:0_0_10px_rgba(251,191,36,0.4)]">
          {{ character.name }}
        </h2>
        <p class="text-gray-300 mt-1">
          Cảnh giới:
          <span class="text-green-300 font-semibold text-lg italic ml-2">{{ character.realm }}</span>
        </p>
      </div>

      <div class="flex flex-col justify-center col-span-1 md:col-span-2">
        <p class="text-base text-cyan-200 mb-1">
          Tu Vi Kinh Nghiệm
        </p>
        <div class="w-full bg-black/40 rounded-full h-5 border-2 border-cyan-900/50 p-0.5 relative overflow-hidden group">
          <div
            class="bg-gradient-to-r from-cyan-600 to-sky-400 h-full rounded-full transition-all duration-500 ease-out"
            :style="{ width: `${cultivationPercentage}%` }"
          >
            <div class="absolute top-0 left-0 h-full w-full bg-[url('/effects/flow.png')] bg-repeat-x opacity-30 animate-flow" />
          </div>
          <span class="absolute inset-0 text-center text-xs text-white  font-bold leading-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
            {{ character.cultivationExp.toLocaleString() }} / {{ nextRealmExp.toLocaleString() }}
          </span>
        </div>
      </div>

      <div class="md:col-span-3">
        <h3 class="text-xl text-yellow-300 mb-2 border-b-2 border-yellow-800/30 pb-2">
          Túi Càn Khôn
        </h3>
        <div v-if="character.inventory && character.inventory.length" class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-gray-300 max-h-40 overflow-y-auto pr-2">
          <div
            v-for="item in character.inventory"
            :key="item.itemId + item.quality"
            class="flex items-center justify-between text-base p-2 rounded-md hover:bg-white/5"
          >
            <span
              class="truncate"
              :style="{ color: item.color, textShadow: `0 0 5px ${item.color}60` }"
            >{{ item.name }}</span>
            <span class=" font-semibold text-gray-400 ml-2">x{{ item.quantity }}</span>
          </div>
        </div>
        <p v-else class="text-gray-500 italic text-sm py-4">
          Trong túi trống rỗng, không có một cọng linh thảo.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { character } = useCharacterStore()

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

<style scoped>
@keyframes flow {
  from { background-position: 0 0; }
  to { background-position: -100px 0; }
}
.animate-flow {
  animation: flow 2s linear infinite;
}
</style>
