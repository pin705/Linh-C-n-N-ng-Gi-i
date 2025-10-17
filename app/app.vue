<template>
  <div class="bg-gray-900 text-white min-h-screen">
    <AuthView v-if="!loggedIn" />
    <div
      v-else-if="!session.character"
      class="h-screen"
    >
      <CreateCharacterView />
    </div>

    <div
      v-else-if="isDataReady"
      class="flex"
    >
      <TheSidebar />
      <main class="flex-1 max-h-screen overflow-y-auto">
        <DashboardView v-if="currentView === 'DASHBOARD'" />
        <!-- <FarmView v-if="currentView === 'FARM'" /> -->
        <TerritoryView v-if="currentView === 'TERRITORY'" />
      </main>
    </div>
    <div
      v-else
      class="h-screen flex items-center justify-center"
    >
      <p class="text-xl text-yellow-400 animate-pulse">
        Đang khai mở thiên địa, xin đạo hữu chờ trong giây lát...
      </p>
    </div>

    <GameLog />
  </div>
</template>

<script setup>
import AuthView from '~/components/views/AuthView.vue' // <-- Import AuthView
import CreateCharacterView from '~/components/views/CreateCharacterView.vue'
// Import các view chính
import DashboardView from '~/components/views/DashboardView.vue'
// import FarmView from '~/components/views/FarmView.vue'
import TerritoryView from '~/components/views/TerritoryView.vue'

const { session, fetch: fetchSession, loggedIn, clear } = useUserSession()
const { currentView } = useGameView()
const { fetchCharacter } = useCharacterStore()
const { fetchTerritory } = useTerritoryStore()

const isDataReady = ref(false)

// Dùng watch để theo dõi trạng thái đăng nhập và tạo nhân vật
watch(
  () => loggedIn.value && session.value.character,
  async (isReadyForGame) => {
    if (isReadyForGame && !isDataReady.value) {
      // Dùng Promise.all để tải song song tất cả dữ liệu game
      await Promise.all([
        fetchCharacter(),
        fetchTerritory()
      ])
      isDataReady.value = true
    }
  },
  { immediate: true } // immediate: true để watch chạy ngay lần đầu tiên
)

// Khi component được mount, fetch session để đảm bảo trạng thái là mới nhất
onMounted(() => {
  fetchSession()
})
</script>
