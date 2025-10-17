<template>
  <div class="fixed bottom-0 left-0 w-full md:w-auto md:max-w-md p-4 z-50 pointer-events-none">
    <transition-group name="log-item" tag="div" class="flex flex-col-reverse items-start">
      <div
        v-for="log in logs.slice(0, 5)"
        :key="log.id"
        class="bg-black/70 backdrop-blur-sm text-base font-sans shadow-lg rounded-md px-4 py-2 mb-2 border-l-4 w-full"
        :class="{
          'border-green-500 text-green-300': log.type === 'success',
          'border-red-500 text-red-300': log.type === 'error',
          'border-cyan-500 text-cyan-300': log.type === 'info',
        }"
      >
        {{ log.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const { logs } = useGameLog();
</script>

<style>
.log-item-enter-active,
.log-item-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
.log-item-enter-from,
.log-item-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(30px);
}
.log-item-leave-active {
  position: absolute;
}
</style>
