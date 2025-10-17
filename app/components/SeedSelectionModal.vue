<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center" @click.self="close">
      <div class="bg-gray-800 border-2 border-yellow-700/50 rounded-lg shadow-xl w-full max-w-md p-6 font-serif">
        <h3 class="text-2xl text-yellow-300 mb-4">Chọn Hạt Giống</h3>
        <ul v-if="seeds.length > 0" class="max-h-80 overflow-y-auto space-y-2 pr-2">
          <li
            v-for="seed in seeds"
            :key="seed.itemId"
            class="p-3 rounded-md bg-gray-900/50 hover:bg-yellow-900/40 border border-gray-700 hover:border-yellow-700 transition-all cursor-pointer flex justify-between items-center"
            @click="selectSeed(seed.itemId)"
          >
            <div>
              <p class="font-semibold text-lg" :style="{ color: seed.color }">{{ seed.name }}</p>
              <p class="text-sm text-gray-400 ">{{ seed.description }}</p>
            </div>
            <span class=" text-xl font-bold text-amber-300 ml-4">x{{ seed.quantity }}</span>
          </li>
        </ul>
        <div v-else class="text-center text-gray-500 py-8">
          <p>Không có hạt giống nào trong Túi Càn Khôn.</p>
        </div>
        <button @click="close" class="mt-6 w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white transition-colors ">
          Hủy Bỏ
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: Boolean,
  seeds: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close', 'select-seed'])

function close() {
  emit('close')
}

function selectSeed(seedId) {
  emit('select-seed', seedId)
  close()
}
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
