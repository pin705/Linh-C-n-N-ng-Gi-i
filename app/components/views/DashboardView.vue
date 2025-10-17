<template>
  <div class="p-4 sm:p-6 min-h-full font-serif bg-[url('/bg/dashboard-bg.jpg')] bg-cover bg-fixed">
    <!-- <div class="absolute inset-0 bg-black/50 pointer-events-none" /> -->

    <header class="p-4 lg:p-6 lg:flex lg:gap-6">
      <div class="lg:w-[320px] lg:flex-shrink-0 mb-4 lg:mb-0">
        <CharacterProfile />
      </div>
      <div class="flex-1">
        <LayoutResourceShelves />
      </div>
    </header>
  </div>
</template>

<script setup>
// Script cho DashboardView.vue không cần thay đổi gì thêm,
// vì các component con đã tự động lấy dữ liệu từ store.
</script>
