// composables/useGameView.ts
import { useState } from '#imports'

type GameView = 'DASHBOARD' | 'FARM' | 'TERRITORY'

export const useGameView = () => {
  const currentView = useState<GameView>('game-view', () => 'DASHBOARD')

  const setView = (view: GameView) => {
    currentView.value = view
  }

  return {
    currentView,
    setView,
  }
}
