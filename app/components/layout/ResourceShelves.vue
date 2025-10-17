<template>
  <div class="h-full bg-[url('/ui/shelf-bg.png')] bg-cover p-4">
    <h3 class="text-xl text-yellow-300 text-center mb-2">
      Tài Nguyên
    </h3>
    <div class="grid grid-cols-3 gap-2">
      <div
        v-for="resource in RESOURCES"
        :key="resource.id"
        class="text-center group cursor-pointer"
      >
        <div class="w-16 h-16 mx-auto bg-[url('/items/jar.png')] bg-contain bg-no-repeat flex items-center justify-center text-2xl font-bold text-white [text-shadow:0_0_5px_black]">
          {{ resource.symbol }}
        </div>
        <p class="text-sm text-gray-300">
          {{ resource.name }} {{ Math.floor(character.resources[resource.id] || 0) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const { character } = useCharacterStore()
</script>
