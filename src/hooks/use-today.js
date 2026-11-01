import { useEffect, useState } from 'react'
import { todayKey } from '../utils/planningNotices'

export function useToday() {
  const [today, setToday] = useState(todayKey)
  useEffect(() => {
    let timer
    function schedule() {
      const now = new Date()
      const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = window.setTimeout(refresh, next.getTime() - now.getTime() + 50)
    }
    function refresh() {
      setToday(todayKey())
      window.clearTimeout(timer)
      schedule()
    }
    function visible() { if (document.visibilityState === 'visible') refresh() }
    schedule()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', visible)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', visible)
    }
  }, [])
  return today
}
