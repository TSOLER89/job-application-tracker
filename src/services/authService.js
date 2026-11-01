const AUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth`
let csrfToken = null
let authGeneration = 0
let sessionRequest = null

export async function errorMessage(response, fallback = 'Åtgärden misslyckades. Försök igen.') {
  if (response.status >= 500) return 'Servern kunde inte behandla din begäran. Försök igen om en stund.'
  try {
    const problem = await response.json()
    const messages = Object.values(problem.errors || {}).flat()
    return messages.length ? [...new Set(messages)].join(' ') : problem.title || fallback
  } catch { return fallback }
}

async function loadSession() {
  const generation = authGeneration
  const response = await fetch(`${AUTH_URL}/session`, { credentials: 'include', cache: 'no-store' })
  if (!response.ok) throw new Error(await errorMessage(response))
  const session = await response.json()
  if (generation === authGeneration) csrfToken = session.csrfToken
  return session.user
}

export function getSession() {
  if (!sessionRequest) sessionRequest = loadSession().finally(() => { sessionRequest = null })
  return sessionRequest
}

export async function apiFetch(url, options = {}) {
  const generation = authGeneration
  const headers = new Headers(options.headers)
  if (!['GET', 'HEAD', 'OPTIONS'].includes(options.method || 'GET')) {
    if (!csrfToken) await getSession()
    headers.set('X-CSRF-TOKEN', csrfToken)
  }
  const response = await fetch(url, { ...options, headers, credentials: 'include' })
  if (generation === authGeneration && response.status === 401 && !url.endsWith('/login') && !url.endsWith('/register')) {
    csrfToken = null
    authGeneration++
    window.dispatchEvent(new Event('jobtrack-session-expired'))
  }
  return response
}

export async function authenticate(action, email, password) {
  await getSession()
  if (!csrfToken) await getSession()
  authGeneration++
  const response = await apiFetch(`${AUTH_URL}/${action}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email.trim(), password })
  })
  if (!response.ok) throw new Error(await errorMessage(response))
  const session = await response.json()
  csrfToken = session.csrfToken
  return session.user
}

export async function logout() {
  authGeneration++
  const response = await apiFetch(`${AUTH_URL}/logout`, { method: 'POST' })
  if (!response.ok) throw new Error(await errorMessage(response))
  csrfToken = null
}
