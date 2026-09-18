const API_URL = 'http://localhost:3001'

export async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`No fue posible completar la operación (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}
