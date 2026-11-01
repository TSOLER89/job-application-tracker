import { useSyncExternalStore } from 'react'

function subscribe(listener) {
  window.addEventListener('popstate', listener)
  return () => window.removeEventListener('popstate', listener)
}

function currentPage() {
  return window.location.pathname + window.location.search
}

export function usePageNavigation() {
  const location = useSyncExternalStore(subscribe, currentPage, () => '/')
  const page = location.split('?')[0] === '/applications' ? 'applications' : 'overview'
  const requestedId = Number(new URLSearchParams(location.split('?')[1] ?? '').get('application'))
  const applicationId = Number.isSafeInteger(requestedId) && requestedId > 0 ? requestedId : null
  function navigate(event, destination, disabled = false) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    if (disabled) return
    if (window.location.pathname + window.location.search !== destination) {
      window.history.pushState(null, '', destination)
      window.dispatchEvent(new PopStateEvent('popstate'))
      window.scrollTo(0, 0)
      document.getElementById('main-content')?.focus()
    }
  }
  return { page, navigate, applicationId }
}
