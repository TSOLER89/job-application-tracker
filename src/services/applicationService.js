const BASE_URL = import.meta.env.VITE_API_BASE_URL
import { apiFetch } from './authService'
const API_URL = `${BASE_URL}/api/JobApplications`

async function request(url, options) {
  let response
  try {
    response = await apiFetch(url, options)
  } catch {
    throw new Error('Kunde inte nå servern. Kontrollera anslutningen och försök igen.')
  }
  if (!response.ok) {
    if (response.status >= 500) {
      throw new Error('Servern kunde inte behandla din begäran. Försök igen om en stund.')
    }
    let message = 'Åtgärden kunde inte genomföras. Försök igen.'
    try {
      const problem = await response.json()
      const errors = Object.values(problem.errors || {}).flat()
      message = errors.length ? [...new Set(errors)].join(' ') : problem.title || message
    } catch { /* A proxy may return a non-JSON error page. */ }
    throw new Error(message)
  }
  return response.status === 204 ? null : response.json()
}

export function getApplications() {
  return request(API_URL)
}

export function createApplication(application) {
  return request(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  })
}

export function updateApplication(id, application) {
  return request(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(application)
  })
}

export function deleteApplication(id) {
  return request(`${API_URL}/${id}`, { method: 'DELETE' })
}

export async function uploadImage(file) {
  const formData = new FormData()
  formData.append('file', file)
  const data = await request(`${API_URL}/uploadimage`, { method: 'POST', body: formData })
  return data.imageUrl
}
