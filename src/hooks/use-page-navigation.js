import { useSyncExternalStore } from 'react'

function subscribe(listener) {
  window.addEventListener('popstate', listener)
  return () => window.removeEventListener('popstate', listener)
}

function currentPage() {
  return window.location.pathname === '/applications' ? 'applications' : 'overview'
}

export function usePageNavigation() {
  const page = useSyncExternalStore(subscribe, currentPage, () => 'overview')
  function navigate(event, destination, disabled = false) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (disabled) return
    if (window.location.pathname !== destination) {
      window.history.pushState(null, '', destination)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo(0, 0)
      document.getElementById('main-content')?.focus()
    }
  }
  return { page, navigate }
}
