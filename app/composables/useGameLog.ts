// composables/useGameLog.ts
import { ref } from 'vue'

interface LogEntry {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
  timestamp: Date
}

const logs = ref<LogEntry[]>([])

export function useGameLog() {
  const addLog = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    logs.value.unshift({
      id: Date.now(),
      message,
      type,
      timestamp: new Date(),
    })
    // Giới hạn số lượng log để tránh tràn bộ nhớ
    if (logs.value.length > 50) {
      logs.value.pop()
    }
  }

  return {
    logs,
    addLog,
  }
}
