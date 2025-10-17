<template>
  <Transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center"
      @click.self="close"
    >
      <slot />
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

function close() {
  emit('close')
}
</script>

<style>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
