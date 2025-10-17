<template>
  <div class="min-h-screen bg-[url('/bg/main-hall-bg.jpg')] bg-black bg-cover bg-center bg-fixed text-white font-serif">
    <!-- <div class="absolute inset-0 bg-black/50 grain-overlay" /> -->

    <AuthView v-if="!loggedIn" />
    <CreateCharacterView v-else-if="!session.character" />

    <div
      v-else-if="isDataReady"
      class="flex h-screen"
    >
      <aside class="hidden lg:flex lg:flex-shrink-0 w-24">
        <TheNavigation />
      </aside>

      <div class="flex-1 flex flex-col min-w-0 h-screen">
        <main class="flex-1 p-4 pt-0 lg:p-6 lg:pt-0 min-h-0">
          <div class="">
            <Transition
              name="view-fade"
              mode="out-in"
            >
              <component :is="activeViewComponent" />
            </Transition>
          </div>
        </main>
      </div>

      <nav class="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-t-2 border-yellow-800/30">
        <TheNavigation />
      </nav>
    </div>

    <div
      v-else
      class="h-screen flex items-center justify-center"
    >
      <p class="text-xl text-yellow-400 animate-pulse">
        [Đang khai mở thiên địa, xin đạo hữu chờ trong giây lát...]
      </p>
    </div>

    <GameLog />
  </div>
</template>

<script setup>
import TheNavigation from '~/components/layout/TheNavigation.vue'
import AuthView from '~/components/views/AuthView.vue'
import CreateCharacterView from '~/components/views/CreateCharacterView.vue'
import GameLog from '~/components/GameLog.vue'

const { loggedIn, session } = useUserSession()
const { currentView } = useGameView()

const { fetchCharacter } = useCharacterStore()
const { fetchTerritory } = useTerritoryStore()

// Ánh xạ 'currentView' (string) sang component thực tế
const viewComponents = {
  DASHBOARD: resolveComponent('ViewsDashboardView'),
  TERRITORY: resolveComponent('ViewsTerritoryView')
}
const activeViewComponent = computed(() => viewComponents[currentView.value])
const isDataReady = ref(false)

// Dùng watch để theo dõi trạng thái đăng nhập và tạo nhân vật
watch(
  () => loggedIn.value && session.value.character,
  async (isReadyForGame) => {
    if (isReadyForGame && !isDataReady.value) {
      await Promise.all([
        fetchCharacter(),
        fetchTerritory()
      ])
      isDataReady.value = true
    }
  },
  { immediate: true }
)
</script>

<style>
/* Style cũ giữ nguyên, không cần thay đổi */
.grain-overlay {
  position: fixed; top: -100%; left: -100%; width: 300%; height: 300%;
  background-image: url('/effects/grain.png');
  animation: grain 8s steps(10) infinite;
  pointer-events: none;
}
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-5%, -10%); }
  20% { transform: translate(-15%, 5%); }
  30% { transform: translate(7%, -25%); }
  40% { transform: translate(-5%, 25%); }
  50% { transform: translate(-15%, 10%); }
  60% { transform: translate(15%, 0%); }
  70% { transform: translate(0%, 15%); }
  80% { transform: translate(-10%, 5%); }
  90% { transform: translate(5%, 0%); }
}

.view-fade-enter-active,
.view-fade-leave-active {
  transition: opacity 0.3s ease;
}
.view-fade-enter-from,
.view-fade-leave-to {
  opacity: 0;
}
</style>
