<template>
  <div class="fixed bottom-4 right-4 w-full max-w-sm z-50 pointer-events-none">
    <transition-group
      name="log-item"
      tag="div"
      class="flex flex-col items-end"
    >
      <div
        v-for="log in logs"
        :key="log.id"
        class="relative bg-gradient-to-r from-gray-900/80 via-black/70 to-gray-900/80 backdrop-blur-md text-base  shadow-lg rounded-lg px-4 py-3 mb-3 border-l-4 w-auto max-w-full"
        :class="logClasses[log.type].border"
      >
        <div
          class="absolute inset-0 rounded-lg opacity-20 animate-pulse-fast"
          :class="logClasses[log.type].glow"
        />

        <div class="flex items-center gap-3">
          <span
            class="text-xl"
            :class="logClasses[log.type].text"
          >{{ logClasses[log.type].icon }}</span>
          <p class="text-gray-200">
            {{ log.message }}
          </p>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
const { logs } = useGameLog()

// Định nghĩa các thuộc tính giao diện cho từng loại truyền âm
const logClasses = {
  success: {
    icon: '✔',
    border: 'border-green-500',
    text: 'text-green-400',
    glow: 'bg-green-500'
  },
  error: {
    icon: '✘',
    border: 'border-red-500',
    text: 'text-red-400',
    glow: 'bg-red-500'
  },
  info: {
    icon: '…',
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    glow: 'bg-cyan-500'
  }
}
</script>

<style scoped>
/* Hiệu ứng "Linh Phù Hiện Thế" và "Tiêu Tán" */
.log-item-enter-active,
.log-item-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}
.log-item-enter-from,
.log-item-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
.log-item-move {
  transition: transform 0.4s cubic-bezier(0.25, 1, 0.5, 1);
}
</style>
